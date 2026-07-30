using MongoDB.Driver;
using server.Models;

namespace server.Services
{
    public class TenantService
    {
        private readonly IMongoCollection<TenantConfig> _tenantConfigs;

        public TenantService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Cars24DB"));
            var databaseName = config["MongoDB:DatabaseName"] ?? "Cars24DB";
            var database = client.GetDatabase(databaseName);
            _tenantConfigs = database.GetCollection<TenantConfig>("TenantConfigs");

            SeedDefaultTenantConfigs();
        }

        private void SeedDefaultTenantConfigs()
        {
            var count = _tenantConfigs.CountDocuments(FilterDefinition<TenantConfig>.Empty);
            if (count == 0)
            {
                var defaults = new List<TenantConfig>
                {
                    new TenantConfig
                    {
                        TenantId = "tenant-default",
                        TenantName = "Cars24 Standard",
                        SignupRewardReferrer = 100,
                        SignupRewardReferee = 50,
                        PurchaseRewardReferrer = 500,
                        PurchaseRewardReferee = 250,
                        SaleRewardReferrer = 300,
                        SaleRewardReferee = 150,
                        PointValueInINR = 1.0m,
                        MaxRedemptionPercent = 20.0m,
                        MinRedeemPoints = 50,
                        Description = "Standard default tenant benefits across all regions."
                    },
                    new TenantConfig
                    {
                        TenantId = "tenant-delhi",
                        TenantName = "Cars24 Delhi-NCR Hub",
                        SignupRewardReferrer = 150,
                        SignupRewardReferee = 75,
                        PurchaseRewardReferrer = 600,
                        PurchaseRewardReferee = 300,
                        SaleRewardReferrer = 350,
                        SaleRewardReferee = 200,
                        PointValueInINR = 1.0m,
                        MaxRedemptionPercent = 25.0m,
                        MinRedeemPoints = 50,
                        Description = "Exclusive regional perks for Delhi NCR automotive customers."
                    },
                    new TenantConfig
                    {
                        TenantId = "tenant-mumbai",
                        TenantName = "Cars24 Mumbai Metro",
                        SignupRewardReferrer = 120,
                        SignupRewardReferee = 60,
                        PurchaseRewardReferrer = 550,
                        PurchaseRewardReferee = 275,
                        SaleRewardReferrer = 320,
                        SaleRewardReferee = 160,
                        PointValueInINR = 1.0m,
                        MaxRedemptionPercent = 20.0m,
                        MinRedeemPoints = 50,
                        Description = "Metropolitan referral tier for Mumbai buyers & sellers."
                    },
                    new TenantConfig
                    {
                        TenantId = "tenant-bangalore",
                        TenantName = "Cars24 Bangalore Tech Hub",
                        SignupRewardReferrer = 200,
                        SignupRewardReferee = 100,
                        PurchaseRewardReferrer = 700,
                        PurchaseRewardReferee = 350,
                        SaleRewardReferrer = 400,
                        SaleRewardReferee = 200,
                        PointValueInINR = 1.0m,
                        MaxRedemptionPercent = 30.0m,
                        MinRedeemPoints = 50,
                        Description = "High-tier rewards for Silicon Valley of India customers."
                    }
                };

                _tenantConfigs.InsertMany(defaults);
            }
        }

        public async Task<List<TenantConfig>> GetAllTenantConfigsAsync() =>
            await _tenantConfigs.Find(_ => true).ToListAsync();

        public async Task<TenantConfig> GetTenantConfigAsync(string tenantId)
        {
            var config = await _tenantConfigs.Find(t => t.TenantId == tenantId).FirstOrDefaultAsync();
            if (config == null)
            {
                // Fallback to tenant-default
                config = await _tenantConfigs.Find(t => t.TenantId == "tenant-default").FirstOrDefaultAsync();
                if (config == null)
                {
                    config = new TenantConfig();
                }
            }
            return config;
        }

        public async Task CreateOrUpdateTenantConfigAsync(TenantConfig config)
        {
            var existing = await _tenantConfigs.Find(t => t.TenantId == config.TenantId).FirstOrDefaultAsync();
            if (existing != null)
            {
                config.Id = existing.Id;
                await _tenantConfigs.ReplaceOneAsync(t => t.TenantId == config.TenantId, config);
            }
            else
            {
                await _tenantConfigs.InsertOneAsync(config);
            }
        }
    }
}
