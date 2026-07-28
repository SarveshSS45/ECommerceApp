using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Interfaces
{
    public interface IAuthService
    {
        Task<User> LoginAsync(LoginDTO dto);

        Task<User> RegisterAsync(RegisterDTO dto);
    }
}