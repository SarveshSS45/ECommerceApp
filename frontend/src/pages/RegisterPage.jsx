import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiLoader, FiLock, FiMail, FiUser } from "react-icons/fi";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-hidden focus:ring-2 focus:ring-black/10";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI only
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      const res = await registerUser(name, email, password);

      login(res.token, res.refreshToken);

      toast.success("Registration successful");

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center p-6">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-xs">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Register</h1>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>

            <div className="relative">
              <FiUser
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Your name"
                className={`${inputClass} pl-9`}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>

            <div className="relative">
              <FiMail
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="you@example.com"
                className={`${inputClass} pl-9`}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Password</label>

            <div className="relative">
              <FiLock
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className={`${inputClass} pl-9 pr-10`}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <FiLoader size={16} className="animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;