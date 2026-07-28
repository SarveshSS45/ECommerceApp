namespace ECommerce.Application.DTOs
{
    public class DashboardDTO
    {
        public int TotalProducts { get; set; }

        public int TotalCategories { get; set; }

        public int TotalUsers { get; set; }

        public int TotalOrders { get; set; }

        public decimal TotalRevenue { get; set; }

        public List<RecentOrderDTO> RecentOrders { get; set; } = new();

        public List<TopProductDTO> TopProducts { get; set; } = new();

        public List<LowStockProductDTO> LowStockProducts { get; set; } = new();
        public List<LatestProductDTO> LatestProducts { get; set; } = new();

        public List<OrderStatusSummaryDTO> OrderStatusSummary { get; set; } = new();

        public List<RevenueChartDTO> RevenueChart { get; set; } = new();
    }
}