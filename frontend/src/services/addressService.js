import api from "./api";

// Get all addresses of logged-in user
export const getAddresses = async () => {
  const response = await api.get("/Addresses");

  return response.data;
};

// Get address by id
export const getAddressById = async (id) => {
  const response = await api.get(`/Addresses/${id}`);

  return response.data;
};

// Add new address
export const addAddress = async (address) => {
  const response = await api.post("/Addresses", address);

  return response.data;
};

// Update address
export const updateAddress = async (id, address) => {
  const response = await api.put(`/Addresses/${id}`, address);

  return response.data;
};

// Delete address
export const deleteAddress = async (id) => {
  const response = await api.delete(`/Addresses/${id}`);

  return response.data;
};

// Set default address
export const setDefaultAddress = async (id) => {
  const response = await api.put(`/Addresses/default/${id}`);

  return response.data;
};