import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ClipboardDocumentCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMarked, setHasMarked] = useState(false);
  const [markingTime, setMarkingTime] = useState(null);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [markingAttendance, setMarkingAttendance] = useState(false);

  // First useEffect to get user details
  useEffect(() => {
    try {
      const details = localStorage.getItem('userDetails');
      if (!details) {
        navigate('/signin');
        return;
      }
      const parsedDetails = JSON.parse(details);
      setUserDetails(parsedDetails);
      
      // Move the status check here
      const checkStatus = async () => {
        try {

          // Log the student_id being used in the request
          console.log('Using student_id:', parsedDetails.student_id);

          const response = await axios.get(
            `http://localhost:3000/performance/check/${parsedDetails.student_id}`
          );
          console.log('Check Response:', response.data); 
          setHasMarked(response.data.data.hasMarked);
          setMarkingTime(response.data.data.timestamp);

          // Get total attendance with corrected property name
          const perfResponse = await axios.get(
            `http://localhost:3000/performance/${parsedDetails.student_id}`
          );
          setTotalAttendance(perfResponse.data.data.totalDays); // Changed from totalAttendance to totalDays
          console.log('Performance Response:', perfResponse.data); // Add logging for debugging
        } catch (err) {
          console.error('API Error:', err);
          setError('Failed to fetch attendance status');
        } finally {
          setLoading(false);
        }
      };

      checkStatus();
    } catch (err) {
      console.error('localStorage Error:', err);
      setError('Failed to load user details');
      setLoading(false);
    }
  }, [navigate]);

  const markAttendance = async () => {
    if (!userDetails) return;

    setMarkingAttendance(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/mark', {
        student_id: userDetails.student_id,
        department: userDetails.department
      });

      if (response.data.message === "Attendance marked successfully") {
        setHasMarked(true);
        setMarkingTime(new Date().toISOString());
        setTotalAttendance(prev => prev + 1);
      }
    } catch (err) {
      console.error('Mark Attendance Error:', err);
      setError('Failed to mark attendance');
    } finally {
      setMarkingAttendance(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="font-lato min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h1 className="text-2xl font-lato font-bold text-gray-800 mb-2">
            Welcome, {userDetails?.firstname} {userDetails?.lastname}
          </h1>
          <p className="font-lato text-gray-600">Department: {userDetails?.department}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-lato font-semibold text-gray-800">Today's Attendance</h2>
              {hasMarked && (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              )}
            </div>
            
            {hasMarked ? (
              <p className="text-sm font-lato text-gray-600">
                Marked at: {new Date(markingTime).toLocaleTimeString()}
              </p>
            ) : (
              <button
                onClick={markAttendance}
                disabled={markingAttendance}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md
                  hover:bg-indigo-700 focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50
                  transition-colors duration-200"
              >
                {markingAttendance ? 'Marking...' : 'Mark Attendance'}
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-lato text-gray-800">Total Attendance</h2>
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-indigo-500" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-indigo-600"
            >
              {totalAttendance}
            </motion.div>
          </motion.div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;