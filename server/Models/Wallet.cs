using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class Wallet
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public string TenantId { get; set; } = "tenant-default";

        public int CurrentBalance { get; set; } = 0;

        public int LifetimeEarned { get; set; } = 0;

        public int LifetimeRedeemed { get; set; } = 0;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
