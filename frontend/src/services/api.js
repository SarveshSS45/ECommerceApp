import axios from "axios";

// ✅ Create Axios instance
// ✅ Backend server URL
const API_BASE_URL = "https://localhost:7172";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// 🔁 REFRESH TOKEN FUNCTION
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const res = await axios.post(
      "https://localhost:7172/api/Auth/refresh-token",
      {
        refreshToken,
      },
    );

    const { token, refreshToken: newRefreshToken } = res.data;

    // ✅ Save new tokens
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", newRefreshToken);

    return token;
  } catch (err) {
    console.error("❌ Refresh token failed", err);
    localStorage.clear();
    window.location.href = "/login"; // force logout
    return null;
  }
};

// ✅ REQUEST INTERCEPTOR (attach token automatically)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ RESPONSE INTERCEPTOR (handle 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔁 If token expired → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // retry request
      }
    }

    return Promise.reject(error);
  },
);

export { API_BASE_URL };
export default api;
