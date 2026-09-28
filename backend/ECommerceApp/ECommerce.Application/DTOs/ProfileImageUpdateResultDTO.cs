namespace ECommerce.Application.DTOs
{
    public class ProfileImageUpdateResultDTO
    {
        public UserProfileDTO Profile { get; set; }

        public string? OldProfileImageUrl { get; set; }
    }
}