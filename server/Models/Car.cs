using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
namespace server.Models;

public class Specs
{
    public int Year { get; set; }
    public string Km { get; set; } = string.Empty;
    public string Fuel { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string Owner { get; set; } = string.Empty;
    public string Insurance { get; set; } = string.Empty;
}
public class Car
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string? UserId { get; set; }
    public string SellerName { get; set; } = string.Empty;

    public List<string> Images { get; set; } = new List<string>();
    public string Title { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public double BasePriceNumeric { get; set; }
    public double RecommendedPriceNumeric { get; set; }
    public string BodyType { get; set; } = "SUV"; // SUV, Hatchback, Sedan, MUV, EV, Luxury
    public string Emi { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public Specs Specs { get; set; } = new Specs();
    public List<string> Features { get; set; } = new List<string>();
    public List<string> Highlights { get; set; } = new List<string>();
}