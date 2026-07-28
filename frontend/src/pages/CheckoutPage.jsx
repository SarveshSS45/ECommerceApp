import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { applyCoupon } from "../services/couponService";
import { getAddresses } from "../services/addressService";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    setFinalAmount(total);

    fetchAddresses();
  }, [total]);

  // ✅ STOCK VALIDATION
  const validateStock = async () => {
    try {
      for (let item of cart) {
        const res = await api.get(`/products/${item.id}`);

        const latestProduct = res.data;

        if (!latestProduct) {
          toast.error("Product not found");
          return false;
        }

        if (latestProduct.stock < item.quantity) {
          toast.error(
            `${latestProduct.name} only has ${latestProduct.stock} left`,
          );

          return false;
        }
      }

      return true;
    } catch (err) {
      console.error(err);

      toast.error("Stock validation failed");

      return false;
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();

      setAddresses(data);

      const defaultAddress = data.find((a) => a.isDefault);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to load addresses");
    }
  };

  // ✅ APPLY COUPON
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter coupon code");

      return;
    }

    try {
      const result = await applyCoupon(couponCode, total);

      if (!result.isValid) {
        toast.error(result.message);

        return;
      }

      setDiscount(result.discountAmount);
      setFinalAmount(result.finalAmount);
      setCouponApplied(true);

      toast.success(result.message);
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to apply coupon");
    }
  };

  // ✅ PAYMENT
  const handlePayment = async () => {
    if (loading) return;

    if (cart.length === 0) {
      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }

      toast.error("Cart is empty");

      return;
    }

    try {
      setLoading(true);

      const isValid = await validateStock();

      if (!isValid) {
        setLoading(false);

        return;
      }

      const res = await api.post("/payments/create-order", {
        amount: finalAmount,
      });

      console.log("API Response:", res.data);

      const order = res.data.data;

      console.log("Order:", order);
      console.log("Order Amount:", order.amount);
      console.log("Order Id:", order.id);

      const options = {
        key: "rzp_test_Sg7lE8vCRpN7oZ",
        amount: order.amount,
        currency: "INR",
        name: "My ECommerce",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            const payload = {
              RazorpayPaymentId: response.razorpay_payment_id,
              RazorpayOrderId: response.razorpay_order_id,
              RazorpaySignature: response.razorpay_signature,

              AddressId: selectedAddress.id,

              couponCode: couponApplied ? couponCode : null,

              items: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
            };

            const saveRes = await api.post("/orders", payload);

            toast.success("Payment successful");

            clearCart();

            navigate("/order-success", {
              state: {
                orderId: saveRes.data.orderId,
                paymentId: response.razorpay_payment_id,
                amount: finalAmount,
              },
            });
          } catch (err) {
            console.error(err);

            toast.error("Order saving failed");
          }
        },

        modal: {
          ondismiss: function () {
            toast("Payment cancelled");
          },
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (err) {
      console.error(err);

      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  console.log(addresses);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Delivery Address */}
      <div className="border rounded-lg p-6 shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Delivery Address</h2>

          <button
            onClick={() => navigate("/addresses")}
            className="text-blue-600 hover:underline"
          >
            Manage Addresses
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="space-y-3">
            <p className="text-gray-500">No address found.</p>

            <button
              onClick={() => navigate("/addresses")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`block border rounded-lg p-4 cursor-pointer transition ${
                  selectedAddress?.id === address.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    checked={selectedAddress?.id === address.id}
                    onChange={() => setSelectedAddress(address)}
                  />

                  <div>
                    <p className="font-bold">{address.fullName}</p>

                    <p>{address.mobileNumber}</p>

                    <p>
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                    </p>

                    <p>
                      {address.city}, {address.state}
                    </p>

                    <p>
                      {address.postalCode}, {address.country}
                    </p>

                    {address.isDefault && (
                      <span className="inline-block mt-2 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="border rounded-lg p-6 shadow space-y-5">
        <h2 className="text-xl font-bold">Order Summary</h2>

        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>₹{total}</span>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            disabled={couponApplied}
            className="border rounded px-3 py-2 flex-1"
          />

          <button
            onClick={handleApplyCoupon}
            disabled={couponApplied}
            className="bg-green-600 text-white px-5 rounded"
          >
            {couponApplied ? "Applied" : "Apply"}
          </button>
        </div>

        {couponApplied && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Discount</span>

            <span>-₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between text-xl font-bold border-t pt-4">
          <span>Total</span>

          <span>₹{finalAmount}</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-lg"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
