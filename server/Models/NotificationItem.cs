using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models;

public class NotificationItem
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    // Event Types: "appointment_confirmation", "bid_update", "price_drop", "new_message"
    public string EventType { get; set; } = string.Empty;

    public string Channel { get; set; } = "push";

    public Dictionary<string, string> Data { get; set; } = new Dictionary<string, string>();

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
