namespace ECommerce.Application.DTOs
{
    public class UserProfileDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string? Phone { get; set; }

        public string? ProfileImageUrl { get; set; }

        public string Role { get; set; }
    }
}