import { useState } from "react";
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

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "", // Add email to form data
    password: "",
    department: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    try {
      const response = await axios.post("https://attendancebackend-gjjw.onrender.com/signup", formData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.data.success) {
        setSuccess(response.data.message);
        // Optionally store the student_id
        localStorage.setItem('newStudentId', response.data.student_id);
        // Redirect to notice page after 3 seconds
        setTimeout(() => navigate('/notice'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
          <h1 className="text-center text-lg sm:text-3xl font-bold text-burnt-orange-500 font-poppins">
            MyDreamConnect
          </h1>
          <h2 className="mt-6 text-center text-base sm:text-2xl font-bold text-brand-green-500 font-poppins">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Update all input fields with brand colors */}
            <div>
              <label htmlFor="firstname" className="sr-only">First Name</label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-500 focus:border-brand-green-500 focus:z-10 sm:text-sm font-poppins"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            {/* ...repeat similar styling for other input fields... */}

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
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

          {success && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-md bg-green-50 p-4"
            >
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 font-poppins">{success}</h3>
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
              {loading ? "Registering..." : "Sign Up"}
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

export default SignUp;