using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDTO?> GetProfileAsync(int userId);

        Task<UserProfileDTO?> UpdateProfileAsync(
            int userId,
            UpdateUserProfileDTO dto);

        Task<bool> ChangePasswordAsync(
            int userId,
            ChangePasswordDTO dto);

        Task<ProfileImageUpdateResultDTO?> UpdateProfilePictureAsync(int userId, string profileImageUrl);
    }
}