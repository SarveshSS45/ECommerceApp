using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface IAddressService
    {
        Task<IEnumerable<AddressDTO>> GetAddressesByUserIdAsync(int userId);

        Task<AddressDTO?> GetAddressByIdAsync(int id);

        Task<ApiResponse<string>> AddAddressAsync(int userId, CreateAddressDTO dto);

        Task<ApiResponse<string>> UpdateAddressAsync(int id, int userId, UpdateAddressDTO dto);

        Task<ApiResponse<string>> DeleteAddressAsync(int id, int userId);

        Task<ApiResponse<string>> SetDefaultAddressAsync(int id, int userId);
    }
}