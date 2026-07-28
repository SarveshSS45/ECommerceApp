namespace ECommerce.Application.DTOs
{
    public class ApplyCouponDTO
    {
        public string Code { get; set; } = string.Empty;

        public decimal OrderAmount { get; set; }
    }
}