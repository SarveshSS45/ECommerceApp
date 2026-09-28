using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace ECommerceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _environment;

        public UserController(IUserService userService, IWebHostEnvironment environment)
        {
            _userService = userService;
            _environment = environment;
        }

        private const long MaxProfileImageSize = 5 * 1024 * 1024;

        private static readonly string[] AllowedProfileImageExtensions =
        {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
};

        private static readonly string[] AllowedProfileImageContentTypes =
        {
    "image/jpeg",
    "image/png",
    "image/webp"
};

        private int GetUserId()
        {
            return int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
        }

        // GET: api/User/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();

            var profile = await _userService.GetProfileAsync(userId);

            if (profile == null)
            {
                return NotFound(
                    new ApiResponse<string>(
                        false,
                        "User profile not found.",
                        null));
            }

            return Ok(profile);
        }

        // PUT: api/User/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateUserProfileDTO dto)
        {
            var userId = GetUserId();

            var profile = await _userService.UpdateProfileAsync(userId, dto);

            if (profile == null)
            {
                return NotFound(
                    new ApiResponse<string>(
                        false,
                        "User profile not found.",
                        null));
            }

            return Ok(profile);
        }

        // PUT: api/User/change-password
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(
            ChangePasswordDTO dto)
        {
            var userId = GetUserId();

            var result =
                await _userService.ChangePasswordAsync(
                    userId,
                    dto);

            if (!result)
            {
                return BadRequest(
                    new ApiResponse<string>(
                        false,
                        "Invalid current password or passwords do not match.",
                        null));
            }

            return Ok(
                new ApiResponse<string>(
                    true,
                    "Password changed successfully.",
                    null));
        }

        // POST: api/User/profile-picture
        [HttpPost("profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(
            IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest(
                    new ApiResponse<object>(
                        false,
                        "Please select a profile image."
                    ));
            }

            if (image.Length > MaxProfileImageSize)
            {
                return BadRequest(
                    new ApiResponse<object>(
                        false,
                        "Profile image size cannot exceed 5 MB."
                    ));
            }

            var extension =
                Path.GetExtension(image.FileName).ToLowerInvariant();

            if (!AllowedProfileImageExtensions.Contains(extension))
            {
                return BadRequest(
                    new ApiResponse<object>(
                        false,
                        "Only JPG, JPEG, PNG and WEBP images are allowed."
                    ));
            }

            if (!AllowedProfileImageContentTypes.Contains(
                    image.ContentType.ToLowerInvariant()))
            {
                return BadRequest(
                    new ApiResponse<object>(
                        false,
                        "Invalid profile image type."
                    ));
            }

            var userId = GetUserId();

            var imageUrl = await SaveProfileImageAsync(image);

            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                return BadRequest(
                    new ApiResponse<object>(
                        false,
                        "Profile image could not be saved."
                    ));
            }

            var profile = await _userService.UpdateProfilePictureAsync(userId, imageUrl);

            if (profile == null)
            {
                return NotFound(
                    new ApiResponse<object>(
                        false,
                        "User profile not found."
                    ));
            }

            DeleteProfileImageFile(profile.OldProfileImageUrl);


            return Ok(
                new ApiResponse<ProfileImageUpdateResultDTO>(
                    true,
                    "Profile image uploaded successfully.",
                    profile));
        }

        private void DeleteProfileImageFile(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return;

            try
            {
                var imagePath = Path.Combine(
                    _environment.WebRootPath,
                    imageUrl
                        .TrimStart('/')
                        .Replace(
                            '/',
                            Path.DirectorySeparatorChar));

                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Profile image deletion failed: {ex.Message}");
            }
        }


        private async Task<string?> SaveProfileImageAsync(IFormFile image)
        {
            if (image == null || image.Length == 0)
                return null;

            var uploadsFolder = Path.Combine(_environment.WebRootPath, "images", "users");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName =
                $"{Guid.NewGuid()}_{image.FileName}";

            var filePath =
                Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(
                filePath,
                FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return $"/images/users/{fileName}";
        }
    }
}