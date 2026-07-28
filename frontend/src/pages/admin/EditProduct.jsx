import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

import ProductForm from "../../components/admin/ProductForm";
import { getAdminProducts, updateProduct } from "../../services/adminService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const products = await getAdminProducts();
      const found = products.find((p) => p.id === Number(id));
      if (!found) {
        toast.error("Product not found");
        navigate("/admin/products");
        return;
      }
      setProduct(found);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (data) => {
    try {
      await updateProduct(id, data);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/products"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          Back to Products
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-1">Update the details for this product</p>
      </div>

      <ProductForm initialData={product} onSubmit={handleUpdateProduct} />
    </div>
  );
};

export default EditProduct;