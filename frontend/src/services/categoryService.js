import api from "./api";

// GET ALL CATEGORIES
export const getCategories = async () => {
  const res = await api.get("/admin/categories");

  return res.data.data; // <-- IMPORTANT
};

// CREATE CATEGORY
export const createCategory = async (categoryData) => {
  const res = await api.post(
    "/admin/categories",
    categoryData
  );

  return res.data.data;
};

// UPDATE CATEGORY
export const updateCategory = async (
  id,
  categoryData
) => {
  const res = await api.put(
    `/admin/categories/${id}`,
    categoryData
  );

  return res.data.data;
};

// DELETE CATEGORY
export const deleteCategory = async (id) => {
  const res = await api.delete(
    `/admin/categories/${id}`
  );

  return res.data;
};