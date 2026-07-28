namespace ECommerce.Application.DTOs
{
    public class OrderResponseDTO
    {
        public int Id { get; set; }

        public string Status { get; set; }

        public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; }

        public string UserName { get; set; }

        public string UserEmail { get; set; }

        // NEW
        public string RazorpayPaymentId { get; set; }

        // NEW
        public int AddressId { get; set; }

        // NEW
        public AddressDTO Address { get; set; }

        public List<OrderItemResponseDTO> Items { get; set; }
    }

    public class OrderItemResponseDTO
    {
        public int Id { get; set; }

        public string ProductName { get; set; }

        public int Quantity { get; set; }
        public string ProductImage { get; set; }

        public decimal Price { get; set; }
    }

}