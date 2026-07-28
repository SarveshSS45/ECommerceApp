import axios from "axios";

const API = "https://localhost:7172/api/products";

export const getProducts = async () => {
  const res = await axios.get(API);

  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${API}/${id}`);

  return res.data.data;
};

export const searchProducts = async ({
  searchTerm = "",
  categoryId = "",
  pageNumber = 1,
  pageSize = 9,
  minPrice = "",
  maxPrice = "",
  inStock = false,
  sortBy = "newest",
}) => {
  const res = await axios.get(`${API}/search`, {
    params: {
      searchTerm,
      categoryId: categoryId === "" ? undefined : categoryId,
      pageNumber,
      pageSize,
      minPrice: minPrice === "" ? undefined : minPrice,
      maxPrice: maxPrice === "" ? undefined : maxPrice,
      inStock: inStock ? true : undefined,
      sortBy,
    },
  });

  return res.data;
};
