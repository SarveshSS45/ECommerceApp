using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface IDashboardRepository
    {
        Task<DashboardDTO> GetDashboardDataAsync();
    }
}