using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.DTOs
{
    public class CreateReviewDTO
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Comment { get; set; } = string.Empty;
    }
}