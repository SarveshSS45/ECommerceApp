import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; // ✅ NEW

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);

      login(res.token, res.refreshToken);

      toast.success("Login successful ✅"); // ✅ NEW

      navigate(from, { replace: true });
    } catch {
      toast.error("Invalid credentials ❌"); // ✅ REPLACED alert
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Login</h1>

      <input
        placeholder="Email"
        className="border p-2 block mb-3"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 block mb-3"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;