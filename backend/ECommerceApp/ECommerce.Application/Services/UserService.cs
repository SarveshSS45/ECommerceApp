using BCrypt.Net;
using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;

namespace ECommerce.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserProfileDTO?> GetProfileAsync(int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
                return null;

            return new UserProfileDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                ProfileImageUrl = user.ProfileImageUrl,
                Role = user.Role
            };
        }

        public async Task<UserProfileDTO?> UpdateProfileAsync(
            int userId,
            UpdateUserProfileDTO dto)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
                return null;

            user.Name = dto.Name;
            user.Phone = dto.Phone;

            await _userRepository.UpdateUserAsync(user);

            return new UserProfileDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                ProfileImageUrl = user.ProfileImageUrl,
                Role = user.Role
            };
        }

        public async Task<bool> ChangePasswordAsync(
            int userId,
            ChangePasswordDTO dto)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
                return false;

            if (!BCrypt.Net.BCrypt.Verify(
                    dto.CurrentPassword,
                    user.PasswordHash))
            {
                return false;
            }

            if (dto.NewPassword != dto.ConfirmNewPassword)
            {
                return false;
            }

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _userRepository.UpdateUserAsync(user);

            return true;
        }

        public async Task<ProfileImageUpdateResultDTO?> UpdateProfilePictureAsync(
    int userId,
    string profileImageUrl)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
                return null;

            // Store the existing image URL before replacing it
            var oldProfileImageUrl = user.ProfileImageUrl;

            user.ProfileImageUrl = profileImageUrl;

            await _userRepository.UpdateUserAsync(user);

            var profile = new UserProfileDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                ProfileImageUrl = user.ProfileImageUrl,
                Role = user.Role
            };

            return new ProfileImageUpdateResultDTO
            {
                Profile = profile,
                OldProfileImageUrl = oldProfileImageUrl
            };
        }
    }
}