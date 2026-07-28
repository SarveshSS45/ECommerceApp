using ECommerce.Domain.Entities;

namespace ECommerce.Application.Interfaces
{
    public interface IAddressRepository
    {
        Task<IEnumerable<Address>> GetAddressesByUserIdAsync(int userId);

        Task<Address?> GetAddressByIdAsync(int id);

        Task AddAddressAsync(Address address);

        Task UpdateAddressAsync(Address address);

        Task DeleteAddressAsync(Address address);

        Task SetDefaultAddressAsync(int userId, int addressId);

        Task SaveChangesAsync();
    }
}