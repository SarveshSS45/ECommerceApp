import api from "./api";

export const getProductImages = async (productId) => {
    const response = await api.get(`/product-images/${productId}`);

    return response.data;
};

export const uploadProductImages = async (productId, images) => {
    const formData = new FormData();

    formData.append("productId", productId);

    images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await api.post(
        "/product-images",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const deleteProductImage = async (imageId) => {
    const response = await api.delete(`/product-images/${imageId}`);

    return response.data;
};

export const setPrimaryImage = async (imageId) => {
    const response = await api.put(
        `/product-images/${imageId}/primary`
    );

    return response.data;
};