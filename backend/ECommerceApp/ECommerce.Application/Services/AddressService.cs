using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services
{
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _addressRepository;

        public AddressService(IAddressRepository addressRepository)
        {
            _addressRepository = addressRepository;
        }

        public async Task<IEnumerable<AddressDTO>> GetAddressesByUserIdAsync(int userId)
        {
            var addresses = await _addressRepository
                .GetAddressesByUserIdAsync(userId);

            return addresses.Select(a => new AddressDTO
            {
                Id = a.Id,
                FullName = a.FullName,
                MobileNumber = a.MobileNumber,
                AddressLine1 = a.AddressLine1,
                AddressLine2 = a.AddressLine2,
                City = a.City,
                State = a.State,
                PostalCode = a.PostalCode,
                Country = a.Country,
                AddressType = a.AddressType,
                IsDefault = a.IsDefault
            });
        }

        public async Task<AddressDTO?> GetAddressByIdAsync(int id)
        {
            var address = await _addressRepository
                .GetAddressByIdAsync(id);

            if (address == null)
                return null;

            return new AddressDTO
            {
                Id = address.Id,
                FullName = address.FullName,
                MobileNumber = address.MobileNumber,
                AddressLine1 = address.AddressLine1,
                AddressLine2 = address.AddressLine2,
                City = address.City,
                State = address.State,
                PostalCode = address.PostalCode,
                Country = address.Country,
                AddressType = address.AddressType,
                IsDefault = address.IsDefault
            };
        }

        public async Task<ApiResponse<string>> AddAddressAsync(
            int userId,
            CreateAddressDTO dto)
        {
            if (dto.IsDefault)
            {
                await _addressRepository
                    .SetDefaultAddressAsync(userId, 0);
            }

            var address = new Address
            {
                UserId = userId,
                FullName = dto.FullName,
                MobileNumber = dto.MobileNumber,
                AddressLine1 = dto.AddressLine1,
                AddressLine2 = dto.AddressLine2,
                City = dto.City,
                State = dto.State,
                PostalCode = dto.PostalCode,
                Country = dto.Country,
                AddressType = dto.AddressType,
                IsDefault = dto.IsDefault,
                CreatedAt = DateTime.UtcNow
            };

            await _addressRepository.AddAddressAsync(address);
            await _addressRepository.SaveChangesAsync();

            return new ApiResponse<string>(
                true,
                "Address added successfully.",
                null);
        }

        public async Task<ApiResponse<string>> UpdateAddressAsync(
            int id,
            int userId,
            UpdateAddressDTO dto)
        {
            var address = await _addressRepository
                .GetAddressByIdAsync(id);

            if (address == null || address.UserId != userId)
            {
                return new ApiResponse<string>(
                    false,
                    "Address not found.",
                    null);
            }

            if (dto.IsDefault)
            {
                await _addressRepository
                    .SetDefaultAddressAsync(userId, id);
            }

            address.FullName = dto.FullName;
            address.MobileNumber = dto.MobileNumber;
            address.AddressLine1 = dto.AddressLine1;
            address.AddressLine2 = dto.AddressLine2;
            address.City = dto.City;
            address.State = dto.State;
            address.PostalCode = dto.PostalCode;
            address.Country = dto.Country;
            address.AddressType = dto.AddressType;
            address.IsDefault = dto.IsDefault;

            await _addressRepository.UpdateAddressAsync(address);
            await _addressRepository.SaveChangesAsync();

            return new ApiResponse<string>(
                true,
                "Address updated successfully.",
                null);
        }

        public async Task<ApiResponse<string>> DeleteAddressAsync(
            int id,
            int userId)
        {
            var address = await _addressRepository
                .GetAddressByIdAsync(id);

            if (address == null || address.UserId != userId)
            {
                return new ApiResponse<string>(
                    false,
                    "Address not found.",
                    null);
            }

            await _addressRepository.DeleteAddressAsync(address);
            await _addressRepository.SaveChangesAsync();

            return new ApiResponse<string>(
                true,
                "Address deleted successfully.",
                null);
        }

        public async Task<ApiResponse<string>> SetDefaultAddressAsync(
            int id,
            int userId)
        {
            var address = await _addressRepository
                .GetAddressByIdAsync(id);

            if (address == null || address.UserId != userId)
            {
                return new ApiResponse<string>(
                    false,
                    "Address not found.",
                    null);
            }

            await _addressRepository
                .SetDefaultAddressAsync(userId, id);

            await _addressRepository.SaveChangesAsync();

            return new ApiResponse<string>(
                true,
                "Default address updated successfully.",
                null);
        }
    }
}