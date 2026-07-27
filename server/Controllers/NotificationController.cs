using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public class TokenRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }

    [HttpPost("register-token")]
    public async Task<IActionResult> RegisterToken([FromBody] TokenRequest request)
    {
        if (string.IsNullOrEmpty(request.UserId) || string.IsNullOrEmpty(request.Token))
            return BadRequest("UserId and Token are required.");

        await _notificationService.RegisterTokenAsync(request.UserId, request.Token);
        return Ok(new { message = "FCM Token registered successfully." });
    }

    [HttpPost("unregister-token")]
    public async Task<IActionResult> UnregisterToken([FromBody] TokenRequest request)
    {
        if (string.IsNullOrEmpty(request.UserId) || string.IsNullOrEmpty(request.Token))
            return BadRequest("UserId and Token are required.");

        await _notificationService.UnregisterTokenAsync(request.UserId, request.Token);
        return Ok(new { message = "FCM Token unregistered successfully." });
    }

    [HttpGet("preferences/{userId}")]
    public async Task<IActionResult> GetPreferences(string userId)
    {
        var prefs = await _notificationService.GetPreferencesAsync(userId);
        return Ok(prefs);
    }

    [HttpPut("preferences/{userId}")]
    public async Task<IActionResult> UpdatePreferences(string userId, [FromBody] NotificationPreferences preferences)
    {
        await _notificationService.UpdatePreferencesAsync(userId, preferences);
        return Ok(new { message = "Preferences updated successfully.", preferences });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserNotifications(string userId)
    {
        var notifications = await _notificationService.GetUserNotificationsAsync(userId);
        return Ok(notifications);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        await _notificationService.MarkAsReadAsync(id);
        return Ok(new { message = "Notification marked as read." });
    }

    [HttpPut("user/{userId}/read-all")]
    public async Task<IActionResult> MarkAllAsRead(string userId)
    {
        await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(new { message = "All notifications marked as read." });
    }

    public class TestTriggerRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string EventType { get; set; } = "appointment_confirmation"; // "appointment_confirmation", "bid_update", "price_drop", "new_message"
        public string? Title { get; set; }
        public string? Message { get; set; }
        public Dictionary<string, string>? CustomData { get; set; }
    }

    [HttpPost("test-trigger")]
    public async Task<IActionResult> TestTriggerNotification([FromBody] TestTriggerRequest request)
    {
        if (string.IsNullOrEmpty(request.UserId))
            return BadRequest("UserId is required.");

        string defaultTitle = request.EventType switch
        {
            "appointment_confirmation" => "Appointment Confirmed! 📅",
            "bid_update" => "New Bid Update! 🔨",
            "price_drop" => "Price Drop Alert! 🏷️",
            "new_message" => "New Message Received! 💬",
            _ => "Cars24 Alert 🚗"
        };

        string defaultMessage = request.EventType switch
        {
            "appointment_confirmation" => "Your test drive appointment for Honda City has been confirmed for tomorrow at 10:00 AM.",
            "bid_update" => "Someone placed a new bid of ₹5,25,000 on your listed Hyundai Creta.",
            "price_drop" => "Great news! The price of Maruti Swift (2021) in your wishlist just dropped by ₹15,000.",
            "new_message" => "Seller Rajesh sent a message: 'Hi, is tomorrow 2 PM good for car inspection?'",
            _ => "You have a new update on your Cars24 account."
        };

        string title = !string.IsNullOrEmpty(request.Title) ? request.Title : defaultTitle;
        string message = !string.IsNullOrEmpty(request.Message) ? request.Message : defaultMessage;

        var result = await _notificationService.SendNotificationAsync(request.UserId, request.EventType, title, message, request.CustomData);
        if (result == null)
        {
            return Ok(new { message = "Notification triggered, but skipped based on user preferences or user not found.", sent = false });
        }

        return Ok(new { message = "Notification sent successfully via FCM and saved to inbox.", sent = true, notification = result });
    }
}
