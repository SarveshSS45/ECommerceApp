namespace ECommerce.Domain.Entities;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; }

    public int AddressId { get; set; }

    public Address Address { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; }

    public string? RazorpayPaymentId { get; set; }

    public List<OrderItem> Items { get; set; } = new();
}