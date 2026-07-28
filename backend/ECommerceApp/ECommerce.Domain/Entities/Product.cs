namespace ECommerce.Domain.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ImageUrl { get; set; }

    public int CategoryId { get; set; }

    public Category Category { get; set; }

    public ICollection<Review> Reviews { get; set; } = new List<Review>();


    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();

    public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
}