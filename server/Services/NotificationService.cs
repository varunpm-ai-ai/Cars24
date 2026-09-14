using System.Linq;
using System.Text.Json;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using MongoDB.Driver;
using server.Models;

namespace server.Services;

public class NotificationService
{
    private readonly IMongoCollection<NotificationItem> _notifications;
    private readonly UserService _userService;
    private readonly ILogger<NotificationService> _logger;
    private readonly IConfiguration _configuration;

    public NotificationService(IConfiguration configuration, UserService userService, ILogger<NotificationService> logger)
    {
        _configuration = configuration;
        _userService = userService;
        _logger = logger;
        string? connectionString = configuration.GetConnectionString("Cars24DB");
        var client = new MongoClient(connectionString);
        var database = client.GetDatabase("Cars24DB");
        _notifications = database.GetCollection<NotificationItem>("Notifications");

        EnsureFirebaseInitialized();
    }

    private void EnsureFirebaseInitialized()
    {
        try
        {
            if (FirebaseApp.DefaultInstance == null)
            {
                string? serviceAccountJson = GetServiceAccountJson();
                if (string.IsNullOrEmpty(serviceAccountJson))
                {
                    _logger.LogWarning("Firebase Service Account configuration is missing or empty.");
                    return;
                }

                FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromJson(serviceAccountJson)
                });
                _logger.LogInformation("Firebase Admin SDK initialized successfully.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing Firebase Admin SDK.");
        }
    }

    private string? GetServiceAccountJson()
    {
        var rawJson = _configuration["Firebase:ServiceAccountJson"] ?? _configuration["FirebaseServiceAccountJson"];
        if (!string.IsNullOrWhiteSpace(rawJson))
        {
            return rawJson;
        }

        var firebaseSection = _configuration.GetSection("Firebase");
        if (firebaseSection.Exists())
        {
            var dict = firebaseSection.GetChildren()
                .ToDictionary(x => x.Key, x => x.Value);
            return JsonSerializer.Serialize(dict);
        }

        return null;
    }

    public async Task RegisterTokenAsync(string userId, string token)
    {
        var user = await _userService.GetByIdAsync(userId);
        if (user == null || string.IsNullOrEmpty(user.Id)) return;

        if (user.FcmTokens == null)
        {
            user.FcmTokens = new List<string>();
        }

        if (!user.FcmTokens.Contains(token))
        {
            user.FcmTokens.Add(token);
            await _userService.UpdateAsync(user.Id, user);
        }
    }

    public async Task UnregisterTokenAsync(string userId, string token)
    {
        var user = await _userService.GetByIdAsync(userId);
        if (user == null || string.IsNullOrEmpty(user.Id) || user.FcmTokens == null) return;

        if (user.FcmTokens.Contains(token))
        {
            user.FcmTokens.Remove(token);
            await _userService.UpdateAsync(user.Id, user);
        }
    }

    public async Task<NotificationPreferences> GetPreferencesAsync(string userId)
    {
        var user = await _userService.GetByIdAsync(userId);
        if (user == null || user.Preferences == null)
        {
            return new NotificationPreferences();
        }
        return user.Preferences;
    }

    public async Task UpdatePreferencesAsync(string userId, NotificationPreferences preferences)
    {
        var user = await _userService.GetByIdAsync(userId);
        if (user == null || string.IsNullOrEmpty(user.Id)) return;

        user.Preferences = preferences;
        await _userService.UpdateAsync(user.Id, user);
    }

    public async Task<List<NotificationItem>> GetUserNotificationsAsync(string userId)
    {
        return await _notifications
            .Find(n => n.UserId == userId)
            .SortByDescending(n => n.CreatedAt)
            .Limit(50)
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(string notificationId)
    {
        var update = Builders<NotificationItem>.Update.Set(n => n.IsRead, true);
        await _notifications.UpdateOneAsync(n => n.Id == notificationId, update);
    }

    public async Task MarkAllAsReadAsync(string userId)
    {
        var update = Builders<NotificationItem>.Update.Set(n => n.IsRead, true);
        await _notifications.UpdateManyAsync(n => n.UserId == userId && !n.IsRead, update);
    }

    public async Task<NotificationItem?> SendNotificationAsync(string userId, string eventType, string title, string message, Dictionary<string, string>? customData = null)
    {
        var user = await _userService.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning($"Cannot send notification: User {userId} not found.");
            return null;
        }

        var prefs = user.Preferences ?? new NotificationPreferences();

        // Check event type preference
        bool isEventAllowed = eventType switch
        {
            "appointment_confirmation" => prefs.AppointmentConfirmations,
            "bid_update" => prefs.BidUpdates,
            "price_drop" => prefs.PriceDrops,
            "new_message" => prefs.NewMessages,
            _ => true
        };

        if (!isEventAllowed)
        {
            _logger.LogInformation($"Notification skipped for user {userId} due to preference settings for event type '{eventType}'.");
            return null;
        }

        customData ??= new Dictionary<string, string>();
        customData["eventType"] = eventType;
        customData["timestamp"] = DateTime.UtcNow.ToString("o");

        // 1. Create In-App Notification if enabled
        NotificationItem? item = null;
        if (prefs.InAppEnabled)
        {
            item = new NotificationItem
            {
                UserId = userId,
                Title = title,
                Message = message,
                EventType = eventType,
                Channel = "in_app",
                Data = customData,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            await _notifications.InsertOneAsync(item);
        }

        // 2. Send Push Notification via Firebase Cloud Messaging if enabled and FCM tokens exist
        if (prefs.PushEnabled && user.FcmTokens != null && user.FcmTokens.Count > 0)
        {
            try
            {
                var multicastMessage = new MulticastMessage()
                {
                    Tokens = user.FcmTokens,
                    Notification = new FirebaseAdmin.Messaging.Notification()
                    {
                        Title = title,
                        Body = message
                    },
                    Data = customData
                };

                var response = await FirebaseMessaging.DefaultInstance.SendEachForMulticastAsync(multicastMessage);
                _logger.LogInformation($"FCM Multicast sent to user {userId}: {response.SuccessCount} successful, {response.FailureCount} failed out of {user.FcmTokens.Count} tokens.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send FCM push notification to user {userId}");
            }
        }

        return item;
    }
}
