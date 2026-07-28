namespace ECommerce.Application.DTOs
{
    public class LowStockProductDTO
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public int Stock { get; set; }
    }
}