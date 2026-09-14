using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class Booking
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }  
        public string CarId { get; set; } = null!;  
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PreferredDate { get; set; } = string.Empty;
        public string PreferredTime { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string LoanRequired { get; set; } = string.Empty;
        public string DownPayment { get; set; } = string.Empty;

        public string TenantId { get; set; } = "tenant-default";
        public int PointsRedeemed { get; set; } = 0;
        public decimal DiscountAmount { get; set; } = 0m;
        public decimal FinalPrice { get; set; } = 0m;
    }
}
