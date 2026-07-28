namespace ECommerce.Application.DTOs
{
    public class ProductSearchDTO
    {
        public string? SearchTerm { get; set; }

        public int? CategoryId { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 10;

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }
        public bool? InStock { get; set; }
        public string? SortBy { get; set; } = "newest";
    }
}