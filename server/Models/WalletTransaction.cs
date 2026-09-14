using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class WalletTransaction
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string WalletId { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public string TenantId { get; set; } = "tenant-default";

        // e.g. "ReferralSignupBonus", "WelcomeBonus", "PurchaseReferralBonus", "SaleReferralBonus", "PointsRedeemed", "PointsRefunded"
        public string Type { get; set; } = string.Empty;

        public int Points { get; set; }

        public string Description { get; set; } = string.Empty;

        public string? ReferenceId { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Completed";
    }
}
