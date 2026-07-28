import api from "./api";

// PRODUCTS

export const getAdminProducts = async () => {
  const res = await api.get(
    "/admin/products"
  );

  return res.data.data;
};

export const createProduct = async (
  productData,
) => {
  const res = await api.post(
    "/admin/products",
    productData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

  return res.data;
};

export const updateProduct = async (
  id,
  productData,
) => {
  const res = await api.put(
    `/admin/products/${id}`,
    productData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

  return res.data;
};

export const deleteProduct = async (
  id,
) => {
  const res = await api.delete(
    `/admin/products/${id}`,
  );

  return res.data;
};

// ORDERS

export const getAllOrders = async () => {
  const res = await api.get(
    "/admin/orders",
  );

  return res.data.data;
};

export const updateOrderStatus = async (
  orderId,
  status,
) => {
  const res = await api.put(
    `/admin/orders/${orderId}/status`,
    { status },
  );

  return res.data;
};