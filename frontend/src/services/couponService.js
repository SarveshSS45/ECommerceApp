import api from "./api";

export const applyCoupon = async (code, orderAmount) => {
  const response = await api.post("/Coupons/apply", {
    code,
    orderAmount,
  });

  return response.data;
};