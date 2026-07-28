using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Interfaces
{
    public interface ICouponRepository
    {
        Task<IEnumerable<Coupon>> GetAllCouponsAsync();

        Task<Coupon?> GetCouponByIdAsync(int id);

        Task<Coupon?> GetCouponByCodeAsync(string code);

        Task AddCouponAsync(Coupon coupon);

        Task UpdateCouponAsync(Coupon coupon);

        Task IncrementCouponUsageAsync(string couponCode);

        Task DeleteCouponAsync(Coupon coupon);
    }
}