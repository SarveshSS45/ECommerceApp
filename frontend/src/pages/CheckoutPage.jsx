import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { applyCoupon } from "../services/couponService";
import { getAddresses } from "../services/addressService";
import { FiLoader, FiMapPin, FiTag } from "react-icons/fi";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-hidden focus:ring-2 focus:ring-black/10";

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

  // STOCK VALIDATION
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

  // APPLY COUPON
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

  // PAYMENT
  const handlePayment = async () => {
    if (loading) return;

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
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
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Delivery Address */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-lg font-semibold text-gray-900">
                <FiMapPin size={16} />
                Delivery Address
              </h2>

              <button
                onClick={() => navigate("/addresses")}
                className="text-sm font-medium text-gray-600 hover:text-black hover:underline"
              >
                Manage Addresses
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="text-sm text-gray-500">No address found.</p>

                <button
                  onClick={() => navigate("/addresses")}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block cursor-pointer rounded-lg border p-4 transition ${
                      selectedAddress?.id === address.id
                        ? "border-black bg-gray-50 ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedAddress?.id === address.id}
                        onChange={() => setSelectedAddress(address)}
                        className="mt-1 h-4 w-4 border-gray-300 text-black focus:ring-black/20"
                      />

                      <div className="text-sm text-gray-700">
                        <p className="font-semibold text-gray-900">
                          {address.fullName}
                        </p>

                        <p>{address.mobileNumber}</p>

                        <p>
                          {address.addressLine1}
                          {address.addressLine2
                            ? `, ${address.addressLine2}`
                            : ""}
                        </p>

                        <p>
                          {address.city}, {address.state}
                        </p>

                        <p>
                          {address.postalCode}, {address.country}
                        </p>

                        {address.isDefault && (
                          <span className="mt-2 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
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
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiTag
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={couponApplied}
                    className={`${inputClass} pl-9 disabled:bg-gray-100 disabled:text-gray-500`}
                  />
                </div>

                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                  className="rounded-lg bg-black px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {couponApplied ? "Applied" : "Apply"}
                </button>
              </div>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-sm font-semibold text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{finalAmount}
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FiLoader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;