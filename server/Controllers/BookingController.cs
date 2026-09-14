using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;
        private readonly UserService _userService;
        private readonly CarService _carService;
        private readonly WalletService _walletService;
        private readonly ReferralService _referralService;

        public class bookingDto
        {
            public required Booking Booking { get; set; }
            public Car? Car { get; set; }
        }

        public BookingController(
            BookingService bookingService,
            UserService userService,
            CarService carService,
            WalletService walletService,
            ReferralService referralService)
        {
            _bookingService = bookingService;
            _userService = userService;
            _carService = carService;
            _walletService = walletService;
            _referralService = referralService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromQuery] string userId, [FromBody] Booking booking)
        {
            if (booking == null || string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(booking.CarId))
                return BadRequest(new { message = "UserId and CarId are required." });

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var car = await _carService.GetByIdAsync(booking.CarId);
            decimal originalPrice = 0m;
            if (car != null && !string.IsNullOrEmpty(car.Price))
            {
                decimal.TryParse(car.Price.Replace(",", "").Replace("₹", "").Trim(), out originalPrice);
            }

            booking.TenantId = string.IsNullOrEmpty(user.TenantId) ? "tenant-default" : user.TenantId;

            // Handle points redemption if requested
            if (booking.PointsRedeemed > 0)
            {
                var validation = await _walletService.ValidateRedemptionAsync(
                    userId,
                    booking.TenantId,
                    booking.PointsRedeemed,
                    originalPrice
                );

                if (!validation.IsValid)
                {
                    return BadRequest(new { message = validation.Message });
                }

                var redemption = await _walletService.DeductPointsAsync(
                    userId,
                    booking.TenantId,
                    booking.PointsRedeemed,
                    $"Redeemed {booking.PointsRedeemed} points for booking car '{car?.Title ?? booking.CarId}'",
                    booking.CarId
                );

                if (!redemption.Success)
                {
                    return BadRequest(new { message = redemption.Message });
                }

                booking.DiscountAmount = validation.DiscountAmount;
                booking.FinalPrice = Math.Max(0, originalPrice - validation.DiscountAmount);
            }
            else
            {
                booking.DiscountAmount = 0m;
                booking.FinalPrice = originalPrice;
            }

            await _bookingService.CreateAsync(booking);

            if (user.BookingId == null)
            {
                user.BookingId = new List<string>();
            }
            user.BookingId.Add(booking.Id!);
            await _userService.UpdateAsync(user.Id!, user);

            // Reward referrer & referee for completing a purchase
            await _referralService.ProcessPurchaseReferralRewardAsync(userId, booking.Id!);

            return CreatedAtAction(nameof(GetbookingById), new { id = booking.Id }, booking);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetbookingById(string id)
        {
            var booking = await _bookingService.GetByIdAsynch(id);
            if (booking == null)
                return NotFound();
            return Ok(booking);
        }

        [HttpGet("user/{userId}/bookings")]
        public async Task<IActionResult> GetbookingByUserId(string userId)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound();
            var results = new List<bookingDto>();
            if (user.BookingId != null)
            {
                foreach (var bookingid in user.BookingId)
                {
                    var booking = await _bookingService.GetByIdAsynch(bookingid);
                    if (booking != null)
                    {
                        var car = await _carService.GetByIdAsync(booking.CarId);
                        results.Add(new bookingDto
                        {
                            Booking = booking,
                            Car = car
                        });
                    }
                }
            }
            return Ok(results);
        }
    }
}