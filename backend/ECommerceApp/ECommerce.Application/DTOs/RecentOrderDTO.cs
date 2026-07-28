namespace ECommerce.Application.DTOs
{
    public class RecentOrderDTO
    {
        public int OrderId { get; set; }

        public string CustomerName { get; set; }
            = string.Empty;

        public decimal Amount { get; set; }

        public string Status { get; set; }
            = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}