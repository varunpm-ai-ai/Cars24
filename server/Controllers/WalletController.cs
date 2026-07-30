using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WalletController : ControllerBase
    {
        private readonly WalletService _walletService;
        private readonly UserService _userService;
        private readonly ReferralService _referralService;
        private readonly TenantService _tenantService;

        public WalletController(
            WalletService walletService,
            UserService userService,
            ReferralService referralService,
            TenantService tenantService)
        {
            _walletService = walletService;
            _userService = userService;
            _referralService = referralService;
            _tenantService = tenantService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserWallet(string userId)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            // Generate referral code if user didn't have one previously
            if (string.IsNullOrEmpty(user.ReferralCode))
            {
                user.ReferralCode = _referralService.GenerateReferralCode(user.FullName, user.Email);
                await _userService.UpdateAsync(user.Id!, user);
            }

            var tenantId = string.IsNullOrEmpty(user.TenantId) ? "tenant-default" : user.TenantId;
            var wallet = await _walletService.GetOrCreateWalletAsync(userId, tenantId);
            var tenantConfig = await _tenantService.GetTenantConfigAsync(tenantId);

            return Ok(new
            {
                userId = user.Id,
                tenantId = wallet.TenantId,
                referralCode = user.ReferralCode,
                referredByCode = user.ReferredByCode,
                referralCount = user.ReferralCount,
                successfulReferrals = user.SuccessfulReferrals,
                currentBalance = wallet.CurrentBalance,
                lifetimeEarned = wallet.LifetimeEarned,
                lifetimeRedeemed = wallet.LifetimeRedeemed,
                equivalentInINR = wallet.CurrentBalance * tenantConfig.PointValueInINR,
                tenantConfig
            });
        }

        [HttpGet("{userId}/transactions")]
        public async Task<IActionResult> GetTransactions(string userId)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            var transactions = await _walletService.GetTransactionsAsync(userId);
            return Ok(transactions);
        }

        [HttpPost("validate-code")]
        public async Task<IActionResult> ValidateReferralCode([FromBody] ValidateCodeRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.ReferralCode))
                return BadRequest(new { isValid = false, message = "Referral code is required." });

            var (isValid, referrer, tenantConfig, message) = await _referralService.ValidateReferralCodeAsync(request.ReferralCode);

            if (!isValid)
                return BadRequest(new { isValid = false, message });

            return Ok(new
            {
                isValid = true,
                message,
                referrerName = referrer?.FullName,
                tenantId = referrer?.TenantId,
                signupRewardReferee = tenantConfig?.SignupRewardReferee ?? 50
            });
        }

        [HttpPost("preview-redemption")]
        public async Task<IActionResult> PreviewRedemption([FromBody] PreviewRedemptionRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.UserId) || request.PointsToRedeem <= 0 || request.ItemPrice <= 0)
                return BadRequest("Invalid parameters.");

            var user = await _userService.GetByIdAsync(request.UserId);
            if (user == null) return NotFound("User not found.");

            var tenantId = string.IsNullOrEmpty(user.TenantId) ? "tenant-default" : user.TenantId;
            var (isValid, message, discountAmount, maxAllowedPoints) = await _walletService.ValidateRedemptionAsync(
                request.UserId,
                tenantId,
                request.PointsToRedeem,
                request.ItemPrice
            );

            return Ok(new
            {
                isValid,
                message,
                discountAmount,
                maxAllowedPoints,
                finalPrice = isValid ? request.ItemPrice - discountAmount : request.ItemPrice
            });
        }

        public class ValidateCodeRequest
        {
            public string ReferralCode { get; set; } = string.Empty;
        }

        public class PreviewRedemptionRequest
        {
            public string UserId { get; set; } = string.Empty;
            public int PointsToRedeem { get; set; }
            public decimal ItemPrice { get; set; }
        }
    }
}
