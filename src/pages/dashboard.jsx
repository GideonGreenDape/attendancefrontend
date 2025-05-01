import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Header from "../components/header"

// Axios global configuration
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
};


const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMarked, setHasMarked] = useState(false);
  const [markingTime, setMarkingTime] = useState(null);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [validLink, setValidLink] = useState(false);
  const [linkMessage, setLinkMessage] = useState("");
  const [softSkillHasMarked, setSoftSkillHasMarked] = useState(false);
  const [softSkillMarkingTime, setSoftSkillMarkingTime] = useState(null);
  const [markingSoftSkill, setMarkingSoftSkill] = useState(false);
  const [softSkillMessage, setSoftSkillMessage] = useState("");
  const [softSkillTotalAttendance, setSoftSkillTotalAttendance] = useState(0);

  // First useEffect to get user details

  useEffect(() => {
    try {
      const details = localStorage.getItem("userDetails");
      if (!details) {
        navigate("/signin");
        return;
      }
      const parsedDetails = JSON.parse(details);
      setUserDetails(parsedDetails);

      // Move the status check here
      const checkStatus = async () => {
        try {
          // Regular attendance check
          const response = await axios.get(
            `https://attendancebackend-gjjw.onrender.com/performance/check/${parsedDetails.student_id}`, {
              withCredentials: true,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            }
          );
          console.log("Regular Check Response:", response.data);
          setHasMarked(response.data.data.hasMarked);
          setMarkingTime(response.data.data.timestamp);

          // Regular attendance performance
          const perfResponse = await axios.get(
            `https://attendancebackend-gjjw.onrender.com/performance/${parsedDetails.student_id}`
          );
          setTotalAttendance(perfResponse.data.data.totalDays);
          console.log("Regular Performance Response:", perfResponse.data);

          // Soft skills attendance check
          const softSkillResponse = await axios.get(
            `https://attendancebackend-gjjw.onrender.com/softskillperformance/check/${parsedDetails.student_id}`, {
              withCredentials: true,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            }
          );
          console.log("Soft Skills Check Response:", softSkillResponse.data);
          setSoftSkillHasMarked(softSkillResponse.data.data.hasMarked);
          setSoftSkillMarkingTime(softSkillResponse.data.data.timestamp);

          // Soft skills attendance performance
          const softSkillPerfResponse = await axios.get(
            `https://attendancebackend-gjjw.onrender.com/softskillperformance/${parsedDetails.student_id}`, {
              withCredentials: true,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            }
          );
          setSoftSkillTotalAttendance(
            softSkillPerfResponse.data.data.totalDays
          );
          console.log(
            "Soft Skills Performance Response:",
            softSkillPerfResponse.data
          );
        } catch (err) {
          console.error("API Error:", err);
          setError("Failed to fetch attendance status");
        } finally {
          setLoading(false);
        }
      };

      checkStatus();
    } catch (err) {
      console.error("localStorage Error:", err);
      setError("Failed to load user details");
      setLoading(false);
    }
  }, [navigate]);

  const validateAttendanceLink = async () => {
    const validLinkId = localStorage.getItem("validLinkId");

    if (!validLinkId) {
      setLinkMessage(
        "You can only mark attendance with the unique link the admin sends close to the end of the class, follow that link so you can mark your attendance"
      );
      return false;
    }

    try {
      const response = await axios.get(
        `https://attendancebackend-gjjw.onrender.com/validatelink/${validLinkId}`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      return response.data.valid;
    } catch (err) {
      console.error("Link validation error:", err);
      setLinkMessage("Invalid or expired attendance link");
      return false;
    }
  };

  const markAttendance = async () => {
    if (!userDetails) return;

    setMarkingAttendance(true);
    setError("");
    setLinkMessage("");

    try {
      const isValidLink = await validateAttendanceLink();

      if (!isValidLink) {
        setMarkingAttendance(false);
        return;
      }

      const response = await axios.post(
        "https://attendancebackend-gjjw.onrender.com/mark",
        {
          student_id: userDetails.student_id,
          department: userDetails.department,
        }, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );

      if (response.data.message === "Attendance marked successfully") {
        setHasMarked(true);
        setMarkingTime(new Date().toISOString());
        setTotalAttendance((prev) => prev + 1);
        // Clear the valid link ID after successful marking
        localStorage.removeItem("validLinkId");
      }
    } catch (err) {
      console.error("Mark Attendance Error:", err);
      setError("Failed to mark attendance");
    } finally {
      setMarkingAttendance(false);
    }
  };

  const validateSoftSkillLink = async () => {
    const softLinkId = localStorage.getItem("softLinkId");

    if (!softLinkId) {
      setSoftSkillMessage(
        "You can only mark soft skills attendance with the unique link the admin sends"
      );
      return false;
    }

    try {
      const response = await axios.get(
        `https://attendancebackend-gjjw.onrender.com/softskillvalidate/${softLinkId}`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      return response.data.valid;
    } catch (err) {
      console.error("Soft skill link validation error:", err);
      setSoftSkillMessage("Invalid or expired soft skills link");
      return false;
    }
  };

  // Add this new function after markAttendance
  const markSoftSkillAttendance = async () => {
    if (!userDetails) return;
  
    setMarkingSoftSkill(true);
    setError("");
    setSoftSkillMessage("");
  
    try {
      const isValidLink = await validateSoftSkillLink();
  
      if (!isValidLink) {
        setMarkingSoftSkill(false);
        return;
      }
  
      const response = await axios.post(
        "https://attendancebackend-gjjw.onrender.com/softskillmark",
        {
          student_id: userDetails.student_id,
          department: userDetails.department,
        }, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
  
      if (response.data.message === "Soft skill attendance marked successfully") {
        setSoftSkillHasMarked(true);
        setSoftSkillMarkingTime(new Date().toISOString());
        setSoftSkillTotalAttendance(prev => prev + 1); // Add this line to increment the total
        localStorage.removeItem("softLinkId");
      }
    } catch (err) {
      console.error("Mark Soft Skill Attendance Error:", err);
      setError("Failed to mark soft skill attendance");
    } finally {
      setMarkingSoftSkill(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-burnt-orange-50 via-white to-brand-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burnt-orange-500"></div>
      </div>
    );
  }


  return (
    <>
      <Header />
      <div className="font-lato min-h-screen bg-gradient-to-br from-burnt-orange-50 via-white to-brand-green-50 p-3 sm:p-6 lg:p-8 pt-24 sm:pt-28 md:pt-32">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-[65px]"
          >
            <h1 className="text-2xl font-lato font-bold text-burnt-orange-500 mb-2">
              Welcome, {userDetails?.firstname} {userDetails?.lastname}
            </h1>
            <p className="text-brand-green-500 font-poppins">
              Department: {userDetails?.department}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Update Regular Attendance Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-lato font-semibold text-gray-800">
                Today's Attendance
              </h2>
              {hasMarked && (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              )}
            </div>

            {hasMarked ? (
              <p className="text-sm font-lato text-gray-600">
                Marked at: {new Date(markingTime).toLocaleTimeString()}
              </p>
            ) : (
              <div className="space-y-4">
                <button
                onClick={markAttendance}
                disabled={markingAttendance}
                className="w-full bg-burnt-orange-500 text-white py-2 px-4 rounded-md
                hover:bg-burnt-orange-600 focus:outline-none focus:ring-2 
                focus:ring-burnt-orange-500 focus:ring-offset-2 disabled:opacity-50
                transition-colors duration-200"
              >
                {markingAttendance ? "Marking..." : "Mark Attendance"}
              </button>
                {linkMessage && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                    {linkMessage}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-lato font-semibold text-gray-800">
                Soft Skills Attendance
              </h2>
              {softSkillHasMarked && (
                <CheckCircleIcon className="h-6 w-6 text-purple-500" />
              )}
            </div>

            {softSkillHasMarked ? (
              <p className="text-sm font-lato text-gray-600">
                Marked at: {new Date(softSkillMarkingTime).toLocaleTimeString()}
              </p>
            ) : (
              <div className="space-y-4">
                <button
                onClick={markSoftSkillAttendance}
                disabled={markingSoftSkill}
                className="w-full bg-brand-green-500 text-white py-2 px-4 rounded-md
                hover:bg-brand-green-600 focus:outline-none focus:ring-2 
                focus:ring-brand-green-500 focus:ring-offset-2 disabled:opacity-50
                transition-colors duration-200"
              >
                {markingSoftSkill ? "Marking..." : "Mark Soft Skills Attendance"}
              </button>

                {softSkillMessage && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                    {softSkillMessage}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-lato text-gray-800">
                Total Attendance
              </h2>
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-lato text-gray-800">
                Total Soft Skills Attendance
              </h2>
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-purple-500" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-purple-600"
            >
              {softSkillTotalAttendance}
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
    </>
  );
};

export default Dashboard;
