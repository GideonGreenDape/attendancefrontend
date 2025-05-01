import { useState, useEffect } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="font-lato text-center text-lg sm:text-3xl font-bold text-indigo-600">
          MyDreamConnect Attendance Management System
          </h1>
          <h2 className="font-lato mt-8 text-center text-base sm:text-xl font-extrabold text-gray-700">
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
                name="student_id" // Changed from studentId to student_id
                type="text"
                required
                className="font-lato appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="font-lato appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full max-w-[280px]">
            <button
              type="submit"
              disabled={loading}
              className="font-lato group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
