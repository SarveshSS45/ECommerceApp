namespace ECommerce.Application.DTOs
{
    public class TopProductDTO
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; }
            = string.Empty;

        public int TotalSold { get; set; }
    }
}