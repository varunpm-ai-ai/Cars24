using MongoDB.Driver;
using server.Models;

namespace server.Services
{
    public class WalletService
    {
        private readonly IMongoCollection<Wallet> _wallets;
        private readonly IMongoCollection<WalletTransaction> _transactions;
        private readonly TenantService _tenantService;

        public WalletService(IConfiguration config, TenantService tenantService)
        {
            var client = new MongoClient(config.GetConnectionString("Cars24DB"));
            var databaseName = config["MongoDB:DatabaseName"] ?? "Cars24DB";
            var database = client.GetDatabase(databaseName);
            _wallets = database.GetCollection<Wallet>("Wallets");
            _transactions = database.GetCollection<WalletTransaction>("WalletTransactions");
            _tenantService = tenantService;
        }

        public async Task<Wallet> GetOrCreateWalletAsync(string userId, string tenantId = "tenant-default")
        {
            var wallet = await _wallets.Find(w => w.UserId == userId).FirstOrDefaultAsync();
            if (wallet == null)
            {
                wallet = new Wallet
                {
                    UserId = userId,
                    TenantId = string.IsNullOrEmpty(tenantId) ? "tenant-default" : tenantId,
                    CurrentBalance = 0,
                    LifetimeEarned = 0,
                    LifetimeRedeemed = 0,
                    UpdatedAt = DateTime.UtcNow
                };
                await _wallets.InsertOneAsync(wallet);
            }
            return wallet;
        }

        public async Task<List<WalletTransaction>> GetTransactionsAsync(string userId)
        {
            return await _transactions
                .Find(t => t.UserId == userId)
                .SortByDescending(t => t.Timestamp)
                .ToListAsync();
        }

        public async Task<bool> TransactionExistsAsync(string userId, string type, string referenceId)
        {
            if (string.IsNullOrEmpty(referenceId)) return false;
            var existing = await _transactions
                .Find(t => t.UserId == userId && t.Type == type && t.ReferenceId == referenceId)
                .FirstOrDefaultAsync();
            return existing != null;
        }

        public async Task<WalletTransaction?> AddPointsAsync(
            string userId,
            string tenantId,
            string type,
            int points,
            string description,
            string? referenceId = null)
        {
            if (points <= 0) return null;

            // Check duplicate reward rule
            if (!string.IsNullOrEmpty(referenceId))
            {
                var isDup = await TransactionExistsAsync(userId, type, referenceId);
                if (isDup) return null; // Prevent double-crediting
            }

            var wallet = await GetOrCreateWalletAsync(userId, tenantId);
            wallet.CurrentBalance += points;
            wallet.LifetimeEarned += points;
            wallet.UpdatedAt = DateTime.UtcNow;

            await _wallets.ReplaceOneAsync(w => w.Id == wallet.Id, wallet);

            var transaction = new WalletTransaction
            {
                WalletId = wallet.Id!,
                UserId = userId,
                TenantId = wallet.TenantId,
                Type = type,
                Points = points,
                Description = description,
                ReferenceId = referenceId,
                Timestamp = DateTime.UtcNow,
                Status = "Completed"
            };

            await _transactions.InsertOneAsync(transaction);
            return transaction;
        }

        public async Task<(bool Success, string Message, WalletTransaction? Transaction)> DeductPointsAsync(
            string userId,
            string tenantId,
            int pointsToRedeem,
            string description,
            string? referenceId = null)
        {
            if (pointsToRedeem <= 0)
                return (false, "Points to redeem must be greater than zero.", null);

            var wallet = await GetOrCreateWalletAsync(userId, tenantId);
            var tenantConfig = await _tenantService.GetTenantConfigAsync(wallet.TenantId);

            if (wallet.CurrentBalance < pointsToRedeem)
                return (false, $"Insufficient balance. Available: {wallet.CurrentBalance} points.", null);

            if (pointsToRedeem < tenantConfig.MinRedeemPoints)
                return (false, $"Minimum {tenantConfig.MinRedeemPoints} points required for redemption under {tenantConfig.TenantName}.", null);

            wallet.CurrentBalance -= pointsToRedeem;
            wallet.LifetimeRedeemed += pointsToRedeem;
            wallet.UpdatedAt = DateTime.UtcNow;

            await _wallets.ReplaceOneAsync(w => w.Id == wallet.Id, wallet);

            var transaction = new WalletTransaction
            {
                WalletId = wallet.Id!,
                UserId = userId,
                TenantId = wallet.TenantId,
                Type = "PointsRedeemed",
                Points = -pointsToRedeem,
                Description = description,
                ReferenceId = referenceId,
                Timestamp = DateTime.UtcNow,
                Status = "Completed"
            };

            await _transactions.InsertOneAsync(transaction);
            return (true, "Points redeemed successfully.", transaction);
        }

        public async Task<(bool IsValid, string Message, decimal DiscountAmount, int MaxAllowedPoints)> ValidateRedemptionAsync(
            string userId,
            string tenantId,
            int pointsToRedeem,
            decimal transactionPrice)
        {
            var wallet = await GetOrCreateWalletAsync(userId, tenantId);
            var tenantConfig = await _tenantService.GetTenantConfigAsync(wallet.TenantId);

            if (wallet.CurrentBalance <= 0)
                return (false, "You currently have 0 reward points in your wallet.", 0m, 0);

            if (pointsToRedeem < tenantConfig.MinRedeemPoints)
                return (false, $"Minimum redeemable points for your region ({tenantConfig.TenantName}) is {tenantConfig.MinRedeemPoints} points.", 0m, wallet.CurrentBalance);

            if (pointsToRedeem > wallet.CurrentBalance)
                return (false, $"Requested points ({pointsToRedeem}) exceed your balance ({wallet.CurrentBalance}).", 0m, wallet.CurrentBalance);

            // Calculate max allowed points based on tenant's MaxRedemptionPercent
            decimal maxDiscountLimit = transactionPrice * (tenantConfig.MaxRedemptionPercent / 100.0m);
            int maxAllowedPointsByPrice = (int)(maxDiscountLimit / tenantConfig.PointValueInINR);
            int maxAllowedPoints = Math.Min(wallet.CurrentBalance, maxAllowedPointsByPrice);

            if (pointsToRedeem > maxAllowedPoints)
            {
                return (false, $"Under {tenantConfig.TenantName} rules, maximum discount allowed is {tenantConfig.MaxRedemptionPercent}% of price ({maxAllowedPoints} points max for this item).", 0m, maxAllowedPoints);
            }

            decimal discountINR = pointsToRedeem * tenantConfig.PointValueInINR;
            return (true, "Valid point redemption.", discountINR, maxAllowedPoints);
        }
    }
}
