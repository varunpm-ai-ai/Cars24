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

    public string TenantId { get; set; } = "tenant-default";

    public string ReferralCode { get; set; } = string.Empty;

    public string? ReferredByCode { get; set; }

    public string? ReferredByUserId { get; set; }

    public int ReferralCount { get; set; } = 0;

    public int SuccessfulReferrals { get; set; } = 0;

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> BookingId { get; set; } = new List<string>();

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> AppointmentId { get; set; } = new List<string>();
}
