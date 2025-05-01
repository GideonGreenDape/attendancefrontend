import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Axios global configuration
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest",
};

const AdminSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://attendancebackend-gjjw.onrender.com/adminlog",
        formData,
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      if (response.status === 200) {
        // Store admin details in localStorage
        localStorage.setItem(
          "adminDetails",
          JSON.stringify({
            username: response.data.username,
            role: response.data.role,
          })
        );
        navigate("/admin-dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during sign in"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-burnt-orange-50 via-white to-brand-green-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div>
          <h1 className="text-center text-2xl sm:text-3xl font-bold text-burnt-orange-500 font-poppins">
            Welcome Admin
          </h1>
          <h2 className="mt-6 text-center text-base sm:text-lg text-brand-green-500 font-poppins">
            Sign in to access your dashboard
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-500 focus:border-brand-green-500 focus:z-10 sm:text-sm font-poppins"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-500 focus:border-brand-green-500 focus:z-10 sm:text-sm font-poppins"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-md bg-red-50 p-4"
            >
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 font-poppins">{error}</h3>
                </div>
              </div>
            </motion.div>
          )}

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-burnt-orange-500 hover:bg-burnt-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burnt-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-poppins"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-burnt-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-brand-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
        />
      </div>
    </div>
  );
};

export default AdminSignIn;
