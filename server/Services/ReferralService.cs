using MongoDB.Driver;
using server.Models;
using System.Text.RegularExpressions;

namespace server.Services
{
    public class ReferralService
    {
        private readonly UserService _userService;
        private readonly WalletService _walletService;
        private readonly TenantService _tenantService;

        public ReferralService(
            UserService userService,
            WalletService walletService,
            TenantService tenantService)
        {
            _userService = userService;
            _walletService = walletService;
            _tenantService = tenantService;
        }

        public string GenerateReferralCode(string fullName, string email)
        {
            string cleanName = Regex.Replace(fullName.ToUpper(), @"[^A-Z]", "");
            if (cleanName.Length < 3) cleanName = (cleanName + "CARS").Substring(0, 3);
            else cleanName = cleanName.Substring(0, 3);

            string hash = Math.Abs((fullName + email + Guid.NewGuid().ToString()).GetHashCode()).ToString("X");
            if (hash.Length < 4) hash = hash.PadRight(4, '9');
            else hash = hash.Substring(0, 4);

            return $"REF-{cleanName}-{hash}";
        }

        public async Task<(bool IsValid, User? ReferrerUser, TenantConfig? TenantConfig, string Message)> ValidateReferralCodeAsync(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return (false, null, null, "Referral code cannot be empty.");

            var cleanCode = code.Trim().ToUpper();
            var usersCollection = _userService.GetUsersCollection();
            var referrer = await usersCollection.Find(u => u.ReferralCode == cleanCode).FirstOrDefaultAsync();

            if (referrer == null)
                return (false, null, null, "Invalid referral code. No account found.");

            var tenantConfig = await _tenantService.GetTenantConfigAsync(referrer.TenantId);
            return (true, referrer, tenantConfig, $"Valid referral code from {referrer.FullName}! You'll receive +{tenantConfig.SignupRewardReferee} welcome bonus points.");
        }

        public async Task<bool> ProcessReferralSignupAsync(User newUser, string referralCode)
        {
            if (string.IsNullOrWhiteSpace(referralCode)) return false;

            var (isValid, referrer, tenantConfig, _) = await ValidateReferralCodeAsync(referralCode);
            if (!isValid || referrer == null || tenantConfig == null) return false;

            // Anti-misuse: cannot refer self (same user ID, email, or phone)
            if (referrer.Id == newUser.Id ||
                referrer.Email.Equals(newUser.Email, StringComparison.OrdinalIgnoreCase) ||
                (!string.IsNullOrEmpty(newUser.Phone) && referrer.Phone.Equals(newUser.Phone)))
            {
                return false;
            }

            newUser.ReferredByCode = referrer.ReferralCode;
            newUser.ReferredByUserId = referrer.Id;
            await _userService.UpdateAsync(newUser.Id!, newUser);

            // Increment referrer's referral count
            referrer.ReferralCount += 1;
            await _userService.UpdateAsync(referrer.Id!, referrer);

            // Reward Referrer on Signup
            if (tenantConfig.SignupRewardReferrer > 0)
            {
                await _walletService.AddPointsAsync(
                    referrer.Id!,
                    referrer.TenantId,
                    "ReferralSignupBonus",
                    tenantConfig.SignupRewardReferrer,
                    $"Referral bonus for inviting {newUser.FullName}",
                    newUser.Id
                );
            }

            // Reward Referee (New User) Welcome Bonus
            if (tenantConfig.SignupRewardReferee > 0)
            {
                await _walletService.AddPointsAsync(
                    newUser.Id!,
                    newUser.TenantId,
                    "WelcomeBonus",
                    tenantConfig.SignupRewardReferee,
                    $"Welcome bonus for signing up with referral code {referrer.ReferralCode}",
                    referrer.Id
                );
            }

            return true;
        }

        public async Task ProcessPurchaseReferralRewardAsync(string buyerUserId, string bookingId)
        {
            var buyer = await _userService.GetByIdAsync(buyerUserId);
            if (buyer == null || string.IsNullOrEmpty(buyer.ReferredByUserId)) return;

            var referrer = await _userService.GetByIdAsync(buyer.ReferredByUserId);
            if (referrer == null) return;

            var buyerTenantConfig = await _tenantService.GetTenantConfigAsync(buyer.TenantId);
            var referrerTenantConfig = await _tenantService.GetTenantConfigAsync(referrer.TenantId);

            // Reward Referrer for referee's car purchase
            if (referrerTenantConfig.PurchaseRewardReferrer > 0)
            {
                var tx = await _walletService.AddPointsAsync(
                    referrer.Id!,
                    referrer.TenantId,
                    "PurchaseReferralBonus",
                    referrerTenantConfig.PurchaseRewardReferrer,
                    $"Purchase referral reward: {buyer.FullName} completed a car booking",
                    bookingId
                );

                if (tx != null)
                {
                    referrer.SuccessfulReferrals += 1;
                    await _userService.UpdateAsync(referrer.Id!, referrer);
                }
            }

            // Reward Buyer (Referee) for completing purchase
            if (buyerTenantConfig.PurchaseRewardReferee > 0)
            {
                await _walletService.AddPointsAsync(
                    buyer.Id!,
                    buyer.TenantId,
                    "PurchaseReferralBonus",
                    buyerTenantConfig.PurchaseRewardReferee,
                    $"Purchase completed bonus for booking vehicle",
                    bookingId
                );
            }
        }

        public async Task ProcessSaleReferralRewardAsync(string sellerUserId, string appointmentId)
        {
            var seller = await _userService.GetByIdAsync(sellerUserId);
            if (seller == null || string.IsNullOrEmpty(seller.ReferredByUserId)) return;

            var referrer = await _userService.GetByIdAsync(seller.ReferredByUserId);
            if (referrer == null) return;

            var sellerTenantConfig = await _tenantService.GetTenantConfigAsync(seller.TenantId);
            var referrerTenantConfig = await _tenantService.GetTenantConfigAsync(referrer.TenantId);

            // Reward Referrer for referee's car sale/valuation appointment
            if (referrerTenantConfig.SaleRewardReferrer > 0)
            {
                var tx = await _walletService.AddPointsAsync(
                    referrer.Id!,
                    referrer.TenantId,
                    "SaleReferralBonus",
                    referrerTenantConfig.SaleRewardReferrer,
                    $"Sale referral reward: {seller.FullName} completed a car valuation/sale",
                    appointmentId
                );

                if (tx != null)
                {
                    referrer.SuccessfulReferrals += 1;
                    await _userService.UpdateAsync(referrer.Id!, referrer);
                }
            }

            // Reward Seller (Referee) for completing car sale appointment
            if (sellerTenantConfig.SaleRewardReferee > 0)
            {
                await _walletService.AddPointsAsync(
                    seller.Id!,
                    seller.TenantId,
                    "SaleReferralBonus",
                    sellerTenantConfig.SaleRewardReferee,
                    $"Car sale valuation bonus for completing inspection",
                    appointmentId
                );
            }
        }
    }
}
