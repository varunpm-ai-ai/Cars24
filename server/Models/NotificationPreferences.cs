namespace server.Models;

public class NotificationPreferences
{
    public bool AppointmentConfirmations { get; set; } = true;
    public bool BidUpdates { get; set; } = true;
    public bool PriceDrops { get; set; } = true;
    public bool NewMessages { get; set; } = true;

    public bool PushEnabled { get; set; } = true;
    public bool InAppEnabled { get; set; } = true;
    public bool EmailEnabled { get; set; } = true;
    public bool SmsEnabled { get; set; } = true;
}
