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

    private static readonly string ServiceAccountJson = @"{
  ""type"": ""service_account"",
  ""project_id"": ""cars24-c182f"",
  ""private_key_id"": ""d413e120c601867102fe48267469f2afca78bcea"",
  ""private_key"": ""-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwJejwkw1lfGU5\nPGCWGMEpBW2XqDtCpvjhy2D649+CxKbTChGuqpyXAP7Gp7ZUSnKI8XxW0e1tHJz1\nr/6nSfxpoDVETyXqn46dBE8biR4k9zDwFPslRbIlcv3lsi/it3UqRUjGwMBNgApb\n+SPR7c/4plIlIAVKiZcMqUw2zbJTAQXFOx+kE7wPOvQPvwqJXXPLfLd0sAxARaHL\niCXy4GXM24SGwaTd6LygZSdipAlYNQ+2Spho51FqZTzDclcTPH13K+poLP80GKuE\nfPImkkfQs2+ueq8v+6rmBCmct79+cXc7TvZm4TadbfufXatwR/sC/ZFlJc7PiDTq\nAc4s6xNbAgMBAAECggEACcup5wr+cTjYNjUd1+r7fuj+3bKszPmVGJVjSMB4UwDV\nmCHUtuZk+97BzFFSSeCz+tqXBAr7jZhMQDtvyWTLZSJUI/7UyHXkC+ZL8eePphWb\nApbgGoQEMqHw7Z+Zmx2Bpf6hW/AnIYgvy0qRC+ESMi0pn0fnE2yQWlNl2hxZQNVT\nlpjF/eYtNnfxCy41f6uvc8fh5qB9aTNy7JuK+y1cPZuv4auf94l/pyCbtio0PLx6\nGZfbhn0CmvxoTOTf8q36nONHJeWMX+q+jbBTk4pEw7i0dfO9swPKSbZIf3XNKryf\nhaFoJSkSmHZPpY6sff88fOo62ToWbrUtEsJy01PTXQKBgQDcrCejYpmy2U9v7+lP\nWtHvYXMqiAFtqvzwYBu8figQdw7VbV+gedD131PIDl/iD8RNXPQ53kK9WHl3A8mw\nlEzoaRKJfWwwH7RetcA3vzDMGPkmSmeF4W9StXx/q81k/8JnSkyUb1/XHuPgxRJK\ngJreARihmq0vUkyM/3SP5FrZXwKBgQDMWQG+KqLN2GF883VzZu/it7PObOII2N4O\nPdaT5vss16YEGl2nBuIP+TVrE14mcbprmBoyr42RObZwIvhIHutG4lh0QbMyprwA\nEmyz82u3orEtbFltvZFYeGshaDOtluWxaXIVpKx78LDNEWmdXkHsfn1hV2r8FWgQ\nlSKJ2Gj7hQKBgDILvQWZ4/+itxhM0Z3UnA3tDOBVbfWANNMTCNdLySxKxAt1PZ24\nYsKQPoD9eZNcPgnJjf3dwUcN3KY4LrKkP3jp83FJB5M2bYKZN5ms+5UeCMs9TpMX\nWFbqn+yYewFv25fvSsTTKWoxMD8Wkppg5j55AywLV0GHKaNEgBvuDwiDAoGAJXw2\nW6IKl2QYDgnDA9ZgLuCv9S/4DtNpeIdTc3ItpT4x0BLeFyOmGHQInonA/aBjKBWQ\nyLd3aqqBkvR3QxOY6TngLANZUfNQDVtT4XbHzbnkcoarqPvbS7VbQZeR00gY/oBv\nUxUQJvQyGowVKa7+vNk/OroEgBWVL2WMHmk6aNkCgYBClFLjqQ8z858ShtmpCmq8\nFFldM5WHFmUB4QFiedCVCdmwlPLMgrHL2haVMZ22NtYDpLZZ6e0UcynYJ1e/AQWL\nL4pFelz9tx9d0RrnK7SEIEHxZPPAHfAz5jPxSL7qonjd9lIhwWTj36c1U5QjVlTA\n576lz4Ubwuzx4Nx32B0vKQ==\n-----END PRIVATE KEY-----\n"",
  ""client_email"": ""firebase-adminsdk-fbsvc@cars24-c182f.iam.gserviceaccount.com"",
  ""client_id"": ""116124206873409164079"",
  ""auth_uri"": ""https://accounts.google.com/o/oauth2/auth"",
  ""token_uri"": ""https://oauth2.googleapis.com/token"",
  ""auth_provider_x509_cert_url"": ""https://www.googleapis.com/oauth2/v1/certs"",
  ""client_x509_cert_url"": ""https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40cars24-c182f.iam.gserviceaccount.com"",
  ""universe_domain"": ""googleapis.com""
}";

    public NotificationService(IConfiguration configuration, UserService userService, ILogger<NotificationService> logger)
    {
        _userService = userService;
        _logger = logger;
        string connectionString = configuration.GetConnectionString("Cars24DB");
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
                FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromJson(ServiceAccountJson)
                });
                _logger.LogInformation("Firebase Admin SDK initialized successfully.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing Firebase Admin SDK.");
        }
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
