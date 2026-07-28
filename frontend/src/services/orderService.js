import api from "./api";

// Get logged-in user's orders
export const getMyOrders = async () => {
  const res = await api.get("/orders/user");

  return res.data;
};

// Get order details
export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);

  return res.data;
};