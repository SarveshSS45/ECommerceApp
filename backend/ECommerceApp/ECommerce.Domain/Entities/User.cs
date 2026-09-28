namespace ECommerce.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; }

    public string? Phone { get; set; }
    public string? ProfileImageUrl { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();

    public ICollection<Address> Addresses { get; set; } = new List<Address>();
}