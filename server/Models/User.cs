using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string Phone { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> BookingId { get; set; } = new List<string>();

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> AppointmentId { get; set; } = new List<string>();

    public List<string> FcmTokens { get; set; } = new List<string>();

    public NotificationPreferences Preferences { get; set; } = new NotificationPreferences();
}
