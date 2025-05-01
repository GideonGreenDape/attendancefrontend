import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";


// Axios global configuration
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Origin': window.location.origin
};

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);



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
      const response = await axios.post("https://attendancebackend-gjjw.onrender.com/signin", {
        student_id: formData.student_id,
        password: formData.password,
      }, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      // Save user details to localStorage
      if (response.data.firstname) {
        localStorage.setItem(
          "userDetails",
          JSON.stringify({
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            department: response.data.department,
            student_id: formData.student_id,
          })
        );
        navigate("/dashboard", { replace: true });
      } else {
        setError("Invalid credentials");
      }
      if (!isInitialized) {
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
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
          <h1 className="font-lato text-center text-lg sm:text-2xl font-bold text-burnt-orange-500">
            MyDreamConnect Attendance Management System
          </h1>
          <h2 className="font-lato mt-8 text-center text-base sm:text-xl font-extrabold text-brand-green-500">
            Sign in to your account
          </h2>
        </div>
        <form
          className="mt-8 space-y-6 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="rounded-md bg-red-50 p-4 w-full max-w-[280px]">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px w-full max-w-[280px]">
            <div>
              <label htmlFor="studentId" className="sr-only">
                Student ID
              </label>
              <input
                id="student_id"
                name="student_id"
                type="text"
                required
                className="font-poppins appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-500 focus:border-brand-green-500 focus:z-10 sm:text-sm"
                placeholder="Student ID"
                value={formData.student_id}
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
                className="font-poppins appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-500 focus:border-brand-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full max-w-[280px]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="font-poppins group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-burnt-orange-500 hover:bg-burnt-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burnt-orange-500 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "Signing in..." : "Sign in"}
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

export default SignIn;
