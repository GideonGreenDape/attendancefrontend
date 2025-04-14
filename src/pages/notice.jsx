import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Notice = () => {
  return (
    <div className="font-lato min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <ClipboardDocumentCheckIcon 
                className="h-10 w-10 text-indigo-600 sm:h-12 sm:w-12 md:h-14 md:w-14" 
              />
            </motion.div>
          </div>

          <h1 className="font-lato text-base font-bold text-indigo-600 sm:text-lg md:text-xl mb-3
            transition-all duration-300 hover:text-indigo-800">
            How <span className="text-gray-800"> MyDreamConnect Attendance System</span> Works
          </h1>

          <div className="mt-3 p-3 bg-white rounded-lg shadow-lg space-y-2
            transform transition-all duration-300 hover:scale-105">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-lato text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed"
            >
              The attendance system operates through a <span className="text-indigo-600 font-medium">secure link</span> sent to you.
              Once you receive the link, simply:
            </motion.p>
            
            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-lato text-left space-y-1.5 text-gray-600 text-xs sm:text-sm md:text-base"
            >
              <li className="flex items-center">
                <span className="h-1 w-1 bg-indigo-500 rounded-full mr-1.5"></span>
                Click the &nbsp; <span className="text-indigo-600 font-medium"> provided link</span>
              </li>
              <li className="flex items-center">
                <span className="h-1 w-1 bg-indigo-500 rounded-full mr-1.5"></span>
                Sign in with your &nbsp; <span className="text-indigo-600 font-medium"> credentials </span>
              </li>
              <li className="flex items-center">
                <span className="h-1 w-1 bg-indigo-500 rounded-full mr-1.5"></span>
                Mark your &nbsp;  <span className="text-indigo-600 font-medium"> attendance &nbsp; </span> for the day
              </li>
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Notice;