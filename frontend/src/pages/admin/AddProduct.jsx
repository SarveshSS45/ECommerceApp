import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

import ProductForm from "../../components/admin/ProductForm";
import { createProduct } from "../../services/adminService";

const AddProduct = () => {
  const navigate = useNavigate();

  const handleCreateProduct = async (data) => {
    try {
      await createProduct(data);
      toast.success("Product created successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product");
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
        <p className="text-gray-500 mt-1">Fill in the details to add a new product</p>
      </div>

      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
};

export default AddProduct;