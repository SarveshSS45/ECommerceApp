using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface ICouponService
    {
        Task<IEnumerable<CouponDTO>> GetAllCouponsAsync();

        Task<CouponDTO?> GetCouponByIdAsync(int id);

        Task<ApiResponse<string>> CreateCouponAsync(CreateCouponDTO dto);

        Task<ApiResponse<string>> UpdateCouponAsync(int id, CreateCouponDTO dto);

        Task<ApiResponse<string>> DeleteCouponAsync(int id);

        Task<CouponValidationResultDTO> ApplyCouponAsync(ApplyCouponDTO dto);

        Task IncrementCouponUsageAsync(string couponCode);
    }
}