namespace ECommerce.Domain.Entities
{
    public class Address
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public string FullName { get; set; }

        public string MobileNumber { get; set; }

        public string AddressLine1 { get; set; }

        public string? AddressLine2 { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string PostalCode { get; set; }

        public string Country { get; set; }

        public string AddressType { get; set; }

        public bool IsDefault { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}