import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  getProductImages,
  uploadProductImages,
  setPrimaryImage,
  deleteProductImage,
} from "../../services/productImageService";

const ProductImageGallery = ({ productId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (productId) {
      loadImages();
    }
  }, [productId]);

  const loadImages = async () => {
    try {
      const response = await getProductImages(productId);

      setImages(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    try {
      setUploading(true);

      await uploadProductImages(productId, selectedImages);

      toast.success("Images uploaded successfully.");

      setSelectedImages([]);

      await loadImages();
    } catch (error) {
      console.error(error);

      toast.error("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId) => {
    console.log("Setting primary:", imageId);

    try {
      await setPrimaryImage(imageId);

      toast.success("Primary image updated successfully.");

      await loadImages();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update primary image.");
    }
  };

  const handleDeleteImage = async (image) => {
    const confirmed = window.confirm(
      image.isPrimary
        ? "This is the primary image. After deletion, the next available image will automatically become the primary image.\n\nDo you want to continue?"
        : "Are you sure you want to delete this image?",
    );

    if (!confirmed) return;

    try {
      await deleteProductImage(image.id);

      toast.success("Image deleted successfully.");

      await loadImages();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete image.");
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Product Gallery</h2>

      {/* Upload Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      {/* Gallery */}
      {images.length === 0 ? (
        <p className="text-gray-500">No gallery images found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border rounded-lg p-3">
              <img
                src={`https://localhost:7172${image.imageUrl}`}
                alt=""
                className="w-full h-40 object-cover rounded"
              />

              <div className="mt-3">
                {image.isPrimary ? (
                  <span className="text-green-600 font-semibold">
                    Primary Image
                  </span>
                ) : (
                  <span className="text-gray-500">Gallery Image</span>
                )}
              </div>

              <div className="text-sm text-gray-400 mt-1">
                Order : {image.displayOrder}
              </div>

              <div className="mt-3">
                {!image.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                  >
                    Make Primary
                  </button>
                )}

                <button
                  onClick={() => handleDeleteImage(image)}
                  className="w-full mt-2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Delete Image
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
