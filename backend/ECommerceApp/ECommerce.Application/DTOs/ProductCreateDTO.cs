namespace ECommerce.Application.DTOs
{
    public class ProductCreateDTO
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int Stock { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        // NEW
        public int CategoryId { get; set; }
    }
}