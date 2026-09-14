using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using BCrypt.Net;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserAuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ReferralService _referralService;
    private readonly WalletService _walletService;

    public UserAuthController(
        UserService userService,
        ReferralService referralService,
        WalletService walletService)
    {
        _userService = userService;
        _referralService = referralService;
        _walletService = walletService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound("User not found.");

        if (string.IsNullOrEmpty(user.ReferralCode))
        {
            user.ReferralCode = _referralService.GenerateReferralCode(user.FullName, user.Email);
            await _userService.UpdateAsync(user.Id!, user);
        }

        return Ok(user);
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        var existingUser = await _userService.GetByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(new { message = "User already exists." });

        var tenantId = string.IsNullOrWhiteSpace(request.TenantId) ? "tenant-default" : request.TenantId.Trim();
        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            Phone = request.Phone,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            TenantId = tenantId,
            ReferralCode = _referralService.GenerateReferralCode(request.FullName, request.Email)
        };

        await _userService.CreateAsync(user);

        // Process referral code if provided
        if (!string.IsNullOrWhiteSpace(request.ReferralCode))
        {
            await _referralService.ProcessReferralSignupAsync(user, request.ReferralCode.Trim());
        }

        // Initialize wallet
        var wallet = await _walletService.GetOrCreateWalletAsync(user.Id!, user.TenantId);

        return Ok(new
        {
            message = "Signup successful",
            user = new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                phone = user.Phone,
                tenantId = user.TenantId,
                referralCode = user.ReferralCode,
                referredByCode = user.ReferredByCode,
                walletBalance = wallet.CurrentBalance
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userService.GetByEmailAsync(request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            return Unauthorized(new { message = "Invalid credentials" });

        if (string.IsNullOrEmpty(user.ReferralCode))
        {
            user.ReferralCode = _referralService.GenerateReferralCode(user.FullName, user.Email);
            await _userService.UpdateAsync(user.Id!, user);
        }

        var tenantId = string.IsNullOrEmpty(user.TenantId) ? "tenant-default" : user.TenantId;
        var wallet = await _walletService.GetOrCreateWalletAsync(user.Id!, tenantId);

        return Ok(new
        {
            message = "Login successful",
            user = new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                phone = user.Phone,
                tenantId = user.TenantId,
                referralCode = user.ReferralCode,
                referredByCode = user.ReferredByCode,
                walletBalance = wallet.CurrentBalance
            }
        });
    }

    public class SignupRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string TenantId { get; set; } = "tenant-default";
        public string? ReferralCode { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
