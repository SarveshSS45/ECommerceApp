using ECommerce.Application.DTOs;

public class CreateOrderDTO
{
    public int UserId { get; set; }

    public string RazorpayPaymentId { get; set; }
    public string RazorpayOrderId { get; set; }
    public string RazorpaySignature { get; set; }

    public string? CouponCode { get; set; }
    public int AddressId { get; set; }
    public List<OrderItemDTO> Items { get; set; }
}