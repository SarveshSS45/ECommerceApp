using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories
{
    public class CouponRepository : ICouponRepository
    {
        private readonly AppDbContext _context;

        public CouponRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Coupon>> GetAllCouponsAsync()
        {
            return await _context.Coupons
                .OrderByDescending(c => c.Id)
                .ToListAsync();
        }

        public async Task<Coupon?> GetCouponByIdAsync(int id)
        {
            return await _context.Coupons
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Coupon?> GetCouponByCodeAsync(string code)
        {
            return await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code == code);
        }

        public async Task AddCouponAsync(Coupon coupon)
        {
            await _context.Coupons.AddAsync(coupon);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateCouponAsync(Coupon coupon)
        {
            _context.Coupons.Update(coupon);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteCouponAsync(Coupon coupon)
        {
            _context.Coupons.Remove(coupon);

            await _context.SaveChangesAsync();
        }

        public async Task IncrementCouponUsageAsync(string couponCode)
        {
            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c =>
                    c.Code == couponCode);

            if (coupon == null)
                return;

            coupon.UsedCount++;

            await _context.SaveChangesAsync();
        }
    }
}