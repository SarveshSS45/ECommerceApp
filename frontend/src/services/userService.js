import api from "./api";

// Get logged-in user's profile
export const getProfile = async () => {
    const response = await api.get("/User/profile");
    return response.data;
};

// Update logged-in user's profile
export const updateProfile = async (profileData) => {
    const response = await api.put("/User/profile", profileData);
    return response.data;
};

// Change logged-in user's password
export const changePassword = async (passwordData) => {
    const response = await api.put("/User/change-password", passwordData);
    return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post(
        "/User/profile-picture",
        formData
    );

    return response.data;
};