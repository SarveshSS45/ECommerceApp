using System.ComponentModel.DataAnnotations;

namespace ECommerce.Domain.Entities
{
    public class Review
    {
        public int Id { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int UserId { get; set; }

        public int ProductId { get; set; }

        // Navigation Properties
        public User User { get; set; } = null!;

        public Product Product { get; set; } = null!;
    }
}