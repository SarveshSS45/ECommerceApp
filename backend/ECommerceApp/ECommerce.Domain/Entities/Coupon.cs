namespace ECommerce.Domain.Entities
{
    public class Coupon
    {
        public int Id { get; set; }

        public string Code { get; set; } = string.Empty;

        public string? Description { get; set; }

        // Percentage or Flat
        public string DiscountType { get; set; } = string.Empty;

        // 20 (%) or 100 (₹)
        public decimal DiscountValue { get; set; }

        // Minimum cart amount required
        public decimal MinimumOrderAmount { get; set; }

        // Maximum discount allowed (mainly for percentage coupons)
        public decimal MaximumDiscount { get; set; }

        public DateTime ExpiryDate { get; set; }

        // Total number of times this coupon can be used
        public int UsageLimit { get; set; }

        // Current usage count
        public int UsedCount { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}