namespace ECommerce.Application.DTOs
{
    public class ErrorResponseDTO
    {
        public bool Success { get; set; } = false;

        public string Message { get; set; }

        public string? Details { get; set; }
    }
}