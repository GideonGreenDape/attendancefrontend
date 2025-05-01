import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';



const GeneralPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto px-4 h-screen flex flex-col justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-xl w-full p-6"
        >
          {/* Logo/Title Section */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600 mb-4 font-poppins ">
              MyDreamConnect
            </h1>
            <p className="text-gray-600 font-poppins text-sm sm:text-base md:text-lg mb-6">
              Bootcamp Attendance Management System
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Streamlining attendance tracking for the next generation of tech innovators.
            </p>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center space-x-2 text-left">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Easy Sign-In Process</span>
            </div>
            <div className="flex items-center space-x-2 text-left">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Real-time Tracking</span>
            </div>
            <div className="flex items-center space-x-2 text-left">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Attendance Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-left">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Performance Insights</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Welcome to MyDreamConnect digital attendance platform. Designed to make tracking attendance 
              seamless and efficient for both students and administrators.
            </p>
          </div>

          {/* Buttons Section */}
          <div className="space-y-4 sm:space-y-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/signin')}
              className="w-full sm:w-80 py-3 px-6 bg-indigo-600 text-white rounded-lg
                shadow-lg hover:bg-indigo-700 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign In as Student
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin')}
              className="w-full sm:w-80 py-3 px-6 bg-white text-indigo-600 rounded-lg
                shadow-lg hover:bg-gray-50 border border-indigo-200 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Admin Sign In
            </motion.button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-gray-600 text-xs sm:text-sm">
            <p className="mb-2">
              Need help? Contact support at support@mydreamconnect.com
            </p>
            <p className="italic">
              "Empowering future tech leaders through efficient attendance management"
            </p>
          </div>

          {/* Footer Section */}
          <div className="mt-12 text-gray-500 text-xs sm:text-sm">
            <p>© 2024 MyDreamConnect. All rights reserved.</p>
          </div>
        </motion.div>

        {/* Decorative Elements - unchanged */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPage;