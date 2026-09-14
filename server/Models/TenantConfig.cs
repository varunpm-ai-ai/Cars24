using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class TenantConfig
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string TenantId { get; set; } = "tenant-default";

        public string TenantName { get; set; } = "Cars24 Standard";

        public int SignupRewardReferrer { get; set; } = 100;

        public int SignupRewardReferee { get; set; } = 50;

        public int PurchaseRewardReferrer { get; set; } = 500;

        public int PurchaseRewardReferee { get; set; } = 250;

        public int SaleRewardReferrer { get; set; } = 300;

        public int SaleRewardReferee { get; set; } = 150;

        public decimal PointValueInINR { get; set; } = 1.0m;

        public decimal MaxRedemptionPercent { get; set; } = 20.0m;

        public int MinRedeemPoints { get; set; } = 50;

        public string Description { get; set; } = "Standard tenant referral benefits and points wallet rules.";
    }
}
