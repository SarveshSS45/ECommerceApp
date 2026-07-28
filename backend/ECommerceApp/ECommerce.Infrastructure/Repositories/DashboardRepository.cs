using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly AppDbContext _context;

        public DashboardRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardDTO> GetDashboardDataAsync()
        {
            var dashboard = new DashboardDTO
            {
                TotalProducts = await _context.Products.CountAsync(),

                TotalCategories = await _context.Categories.CountAsync(),

                TotalUsers = await _context.Users.CountAsync(),

                TotalOrders = await _context.Orders.CountAsync(),

                TotalRevenue =
                    await _context.Orders.SumAsync(o =>
                        (decimal?)o.TotalAmount) ?? 0
            };

            dashboard.RecentOrders =
                await _context.Orders
                    .Include(o => o.User)
                    .OrderByDescending(o => o.CreatedAt)
                    .Take(5)
                    .Select(o => new RecentOrderDTO
                    {
                        OrderId = o.Id,
                        CustomerName = o.User.Name,
                        Amount = o.TotalAmount,
                        Status = o.Status,
                        CreatedAt = o.CreatedAt
                    })
                    .ToListAsync();

            dashboard.TopProducts =
                await _context.OrderItems
                    .Include(oi => oi.Product)
                    .GroupBy(oi => new
                    {
                        oi.ProductId,
                        oi.Product.Name
                    })
                    .Select(g => new TopProductDTO
                    {
                        ProductId = g.Key.ProductId,
                        ProductName = g.Key.Name,
                        TotalSold = g.Sum(x => x.Quantity)
                    })
                    .OrderByDescending(x => x.TotalSold)
                    .Take(5)
                    .ToListAsync();


            dashboard.LowStockProducts = await _context.Products
                .Where(p => p.Stock <= 5)
                .OrderBy(p => p.Stock)
                .Select(p => new LowStockProductDTO
                {
                    ProductId = p.Id,
                    ProductName = p.Name,
                    Stock = p.Stock
                })
                .ToListAsync();

            dashboard.LatestProducts = await _context.Products
                .OrderByDescending(p => p.Id)
                .Take(5)
                .Select(p => new LatestProductDTO
                {
                    ProductId = p.Id,
                    ProductName = p.Name,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl
                })
                .ToListAsync();

            dashboard.OrderStatusSummary = await _context.Orders
    .GroupBy(o => o.Status)
    .Select(g => new OrderStatusSummaryDTO
    {
        Status = g.Key,
        Count = g.Count()
    })
    .ToListAsync();

            var revenueData = await _context.Orders
                .GroupBy(o => new
                {
                    o.CreatedAt.Year,
                    o.CreatedAt.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Revenue = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            dashboard.RevenueChart = revenueData
                .Select(x => new RevenueChartDTO
                {
                    Month = new DateTime(x.Year, x.Month, 1).ToString("MMM yyyy"),
                    Revenue = x.Revenue
                })
                .ToList();

            return dashboard;
        }
    }
}