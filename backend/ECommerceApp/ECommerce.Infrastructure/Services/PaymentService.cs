using Microsoft.Extensions.Configuration;
using Razorpay.Api;

namespace ECommerce.Infrastructure.Services
{
    public class PaymentService
    {
        private readonly string _key;
        private readonly string _secret;

        public PaymentService(IConfiguration config)
        {
            _key = config["Razorpay:Key"];
            _secret = config["Razorpay:Secret"];
        }

        public object CreateOrder(decimal amount)
        {
            Console.WriteLine($"Amount Before Razorpay = {amount}");

            if (amount <= 0)
                throw new ArgumentException("Amount must be greater than zero");

            RazorpayClient client = new RazorpayClient(_key, _secret);

            var options = new Dictionary<string, object>
            {
                { "amount", (int)(amount * 100) }, // convert ₹ to paisa
                { "currency", "INR" },
                { "receipt", Guid.NewGuid().ToString() },
                { "payment_capture", 1 } // auto capture
            };

            Razorpay.Api.Order order = client.Order.Create(options);

            return new
            {
                id = order["id"].ToString(),
                amount = Convert.ToInt32(order["amount"]),
                currency = order["currency"].ToString()
            };
        }
    }
}