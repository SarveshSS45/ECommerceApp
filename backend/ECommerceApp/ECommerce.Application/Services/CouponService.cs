using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services
{
    public class CouponService : ICouponService
    {
        private readonly ICouponRepository _couponRepository;

        public CouponService(ICouponRepository couponRepository)
        {
            _couponRepository = couponRepository;
        }

        public async Task<IEnumerable<CouponDTO>> GetAllCouponsAsync()
        {
            var coupons = await _couponRepository.GetAllCouponsAsync();

            return coupons.Select(c => new CouponDTO
            {
                Id = c.Id,
                Code = c.Code,
                Description = c.Description,
                DiscountType = c.DiscountType,
                DiscountValue = c.DiscountValue,
                MinimumOrderAmount = c.MinimumOrderAmount,
                MaximumDiscount = c.MaximumDiscount,
                ExpiryDate = c.ExpiryDate,
                UsageLimit = c.UsageLimit,
                UsedCount = c.UsedCount,
                IsActive = c.IsActive
            });
        }

        public async Task<CouponDTO?> GetCouponByIdAsync(int id)
        {
            var coupon = await _couponRepository.GetCouponByIdAsync(id);

            if (coupon == null)
                return null;

            return new CouponDTO
            {
                Id = coupon.Id,
                Code = coupon.Code,
                Description = coupon.Description,
                DiscountType = coupon.DiscountType,
                DiscountValue = coupon.DiscountValue,
                MinimumOrderAmount = coupon.MinimumOrderAmount,
                MaximumDiscount = coupon.MaximumDiscount,
                ExpiryDate = coupon.ExpiryDate,
                UsageLimit = coupon.UsageLimit,
                UsedCount = coupon.UsedCount,
                IsActive = coupon.IsActive
            };
        }

        public async Task<ApiResponse<string>> CreateCouponAsync(CreateCouponDTO dto)
        {
            var existingCoupon =
                await _couponRepository.GetCouponByCodeAsync(dto.Code);

            if (existingCoupon != null)
            {
                return new ApiResponse<string>(
                    false,
                    "Coupon code already exists.",
                    null);
            }

            var coupon = new Coupon
            {
                Code = dto.Code.ToUpper(),
                Description = dto.Description,
                DiscountType = dto.DiscountType,
                DiscountValue = dto.DiscountValue,
                MinimumOrderAmount = dto.MinimumOrderAmount,
                MaximumDiscount = dto.MaximumDiscount,
                ExpiryDate = dto.ExpiryDate,
                UsageLimit = dto.UsageLimit,
                UsedCount = 0,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await _couponRepository.AddCouponAsync(coupon);

            return new ApiResponse<string>(
                true,
                "Coupon created successfully.",
                null);
        }

        public async Task<ApiResponse<string>> UpdateCouponAsync(
            int id,
            CreateCouponDTO dto)
        {
            var coupon =
                await _couponRepository.GetCouponByIdAsync(id);

            if (coupon == null)
            {
                return new ApiResponse<string>(
                    false,
                    "Coupon not found.",
                    null);
            }

            coupon.Code = dto.Code.ToUpper();
            coupon.Description = dto.Description;
            coupon.DiscountType = dto.DiscountType;
            coupon.DiscountValue = dto.DiscountValue;
            coupon.MinimumOrderAmount = dto.MinimumOrderAmount;
            coupon.MaximumDiscount = dto.MaximumDiscount;
            coupon.ExpiryDate = dto.ExpiryDate;
            coupon.UsageLimit = dto.UsageLimit;
            coupon.IsActive = dto.IsActive;

            await _couponRepository.UpdateCouponAsync(coupon);

            return new ApiResponse<string>(
                true,
                "Coupon updated successfully.",
                null);
        }

        public async Task<ApiResponse<string>> DeleteCouponAsync(int id)
        {
            var coupon =
                await _couponRepository.GetCouponByIdAsync(id);

            if (coupon == null)
            {
                return new ApiResponse<string>(
                    false,
                    "Coupon not found.",
                    null);
            }

            await _couponRepository.DeleteCouponAsync(coupon);

            return new ApiResponse<string>(
                true,
                "Coupon deleted successfully.",
                null);
        }

        public async Task<CouponValidationResultDTO> ApplyCouponAsync(
            ApplyCouponDTO dto)
        {
            var coupon =
                await _couponRepository.GetCouponByCodeAsync(dto.Code);

            if (coupon == null)
            {
                return new CouponValidationResultDTO
                {
                    IsValid = false,
                    Message = "Invalid coupon code."
                };
            }

            if (!coupon.IsActive)
            {
                return new CouponValidationResultDTO
                {
                    IsValid = false,
                    Message = "Coupon is inactive."
                };
            }

            if (coupon.ExpiryDate < DateTime.UtcNow)
            {
                return new CouponValidationResultDTO
                {
                    IsValid = false,
                    Message = "Coupon has expired."
                };
            }

            if (coupon.UsedCount >= coupon.UsageLimit)
            {
                return new CouponValidationResultDTO
                {
                    IsValid = false,
                    Message = "Coupon usage limit exceeded."
                };
            }

            if (dto.OrderAmount < coupon.MinimumOrderAmount)
            {
                return new CouponValidationResultDTO
                {
                    IsValid = false,
                    Message =
                        $"Minimum order amount is ₹{coupon.MinimumOrderAmount}"
                };
            }

            decimal discount = 0;

            if (coupon.DiscountType == "Percentage")
            {
                discount =
                    dto.OrderAmount * coupon.DiscountValue / 100;

                if (discount > coupon.MaximumDiscount)
                {
                    discount = coupon.MaximumDiscount;
                }
            }
            else
            {
                discount = coupon.DiscountValue;
            }

            return new CouponValidationResultDTO
            {
                IsValid = true,
                Message = "Coupon applied successfully.",
                DiscountAmount = discount,
                FinalAmount = dto.OrderAmount - discount
            };
        }

        public async Task IncrementCouponUsageAsync(string couponCode)
        {
            await _couponRepository
                .IncrementCouponUsageAsync(couponCode);
        }
    }
}