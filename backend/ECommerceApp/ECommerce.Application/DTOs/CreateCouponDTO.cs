namespace ECommerce.Application.DTOs
{
    public class CreateCouponDTO
    {
        public string Code { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string DiscountType { get; set; } = string.Empty;

        public decimal DiscountValue { get; set; }

        public decimal MinimumOrderAmount { get; set; }

        public decimal MaximumDiscount { get; set; }

        public DateTime ExpiryDate { get; set; }

        public int UsageLimit { get; set; }

        public bool IsActive { get; set; }
    }
}