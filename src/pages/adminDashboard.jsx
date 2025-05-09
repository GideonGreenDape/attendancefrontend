import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import Header  from '../components/header';
import {motion} from 'framer-motion';

// Axios global configuration
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Origin': window.location.origin
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminDetails, setAdminDetails] = useState(null);
  const [temporaryLink, setTemporaryLink] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [softSkillLink, setSoftSkillLink] = useState("");
  const [softSkillExpiresAt, setSoftSkillExpiresAt] = useState("");
  const [softSkillLinkCopied, setSoftSkillLinkCopied] = useState(false);

  useEffect(() => {
    const details = localStorage.getItem("adminDetails");
    if (!details) {
      navigate("/admin");
      return;
    }
    setAdminDetails(JSON.parse(details));
    fetchStudentData();
  }, [navigate]);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(
        "https://attendancebackend-gjjw.onrender.com/fetchallstudentattendance",{
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      if (response.data.success) {
        // Create a merged data structure for the table
        const mergedData = response.data.data.regularAttendance.map(
          (regular) => {
            const softskill = response.data.data.softskillAttendance.find(
              (soft) => soft.student_id === regular.student_id
            );
            return {
              ...regular,
              softskillPresentDays: softskill?.presentDays || 0,
              softskillAbsentDays: softskill?.absentDays || 0,
              softskillAttendancePercentage:
                softskill?.attendancePercentage || 0,
            };
          }
        );
        setStudents(mergedData);
      }
    } catch (err) {
      setError("Failed to fetch student data");
    }
  };

  const generateTemporaryLink = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://attendancebackend-gjjw.onrender.com/generatelink/",{},{
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      const baseUrl = window.location.origin;
      setTemporaryLink(`${baseUrl}/link/${response.data.token}`);
      setExpiresAt(new Date(response.data.expiresAt).toLocaleTimeString());
    } catch (err) {
      setError("Failed to generate temporary link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(temporaryLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy link");
    }
  };

  const generateSoftSkillLink = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://attendancebackend-gjjw.onrender.com/softskillattendance",{},{
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      const baseUrl = window.location.origin;
      setSoftSkillLink(`${baseUrl}/softlink/${response.data.token}`);
      setSoftSkillExpiresAt(
        new Date(response.data.expiresAt).toLocaleTimeString()
      );
    } catch (err) {
      setError("Failed to generate soft skill link");
    } finally {
      setLoading(false);
    }
  };

  const copySoftSkillLink = async () => {
    try {
      await navigator.clipboard.writeText(softSkillLink);
      setSoftSkillLinkCopied(true);
      setTimeout(() => setSoftSkillLinkCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy soft skill link");
    }
  };

  const exportToDoc = () => {
    const header = 'Student Attendance Report\n\n';
    const tableData = students.map(student => 
      `${student.firstname} ${student.lastname} (${student.student_id})\n` +
      `Department: ${student.department}\n` +
      `Regular Attendance:\n` +
      `  Present Days: ${student.presentDays}\n` +
      `  Absent Days: ${student.absentDays}\n` +
      `  Attendance Rate: ${student.attendancePercentage}%\n` +
      `Soft Skills Attendance:\n` +
      `  Present Days: ${student.softskillPresentDays}\n` +
      `  Absent Days: ${student.softskillAbsentDays}\n` +
      `  Attendance Rate: ${student.softskillAttendancePercentage}%\n\n`
    ).join('');
  
    const blob = new Blob([header + tableData], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'attendance_report.doc';
    link.click();
  };

  return (
    <>
      <Header />
      <div className="font-lato min-h-screen bg-gradient-to-br from-burnt-orange-50 via-white to-brand-green-50 p-3 sm:p-6 lg:p-8 pt-24 sm:pt-28 md:pt-32">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Welcome Section - More compact on mobile */}
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-[65px]"
          >
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-burnt-orange-500">
              Welcome, {adminDetails?.username}
            </h1>
            <p className="text-sm sm:text-base font-poppins text-brand-green-500">
              Role: {adminDetails?.role}
            </p>
          </motion.div>

        {/* Link Generation Section - Stacked on mobile */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6"
          >
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <button
                onClick={generateTemporaryLink}
                disabled={loading}
                className="w-full sm:w-auto bg-burnt-orange-500 text-white px-4 py-2 rounded-md 
                hover:bg-burnt-orange-600 focus:outline-none focus:ring-2 focus:ring-burnt-orange-500 
                focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? "Generating..." : "Generate Attendance Token"}
              </button>

              {temporaryLink && (
                <div className="flex-1 flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                  <input
                    type="text"
                    readOnly
                    value={temporaryLink}
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs sm:text-sm overflow-x-auto"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="text-burnt-orange-500 hover:text-burnt-orange-600 flex-shrink-0"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              )}
            </div>

          {temporaryLink && (
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              This link will expire at {expiresAt} (valid for 15 minutes)
            </p>
          )}

          {linkCopied && (
            <p className="mt-2 text-xs sm:text-sm text-green-600">
              Link copied!
            </p>
          )}
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6"
          >
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <button
                onClick={generateSoftSkillLink}
                disabled={loading}
                className="w-full sm:w-auto bg-brand-green-500 text-white px-4 py-2 rounded-md 
                hover:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-500 
                focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? "Generating..." : "Generate Soft Skills Token"}
              </button>

              {softSkillLink && (
                <div className="flex-1 flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                  <input
                    type="text"
                    readOnly
                    value={softSkillLink}
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs sm:text-sm overflow-x-auto"
                  />
                  <button
                    onClick={copySoftSkillLink}
                    className="text-brand-green-500 hover:text-brand-green-600 flex-shrink-0"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              )}
            </div>

          {softSkillLink && (
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              This soft skills link will expire at {softSkillExpiresAt} (valid
              for 15 minutes)
            </p>
          )}

          {softSkillLinkCopied && (
            <p className="mt-2 text-xs sm:text-sm text-green-600">
              Soft skills link copied!
            </p>
          )}
        </motion.div>

        {/* Student Attendance Table Section - Scrollable on mobile */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-burnt-orange-500">
                All Student Attendance
              </h2>
              <button
                onClick={exportToDoc}
                className="w-full sm:w-auto bg-brand-green-500 text-white px-4 py-2 rounded-md 
                hover:bg-brand-green-600 focus:outline-none focus:ring-2 focus:ring-brand-green-500 
                focus:ring-offset-2 text-sm sm:text-base"
              >
                Export as DOC
              </button>
            </div>

            <div className="-mx-4 sm:mx-0 overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th colSpan="3" className="px-3 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-burnt-orange-500 uppercase tracking-wider bg-burnt-orange-50">
                        Regular Attendance
                      </th>
                      <th colSpan="3" className="px-3 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-brand-green-500 uppercase tracking-wider bg-brand-green-50">
                        Soft Skills Attendance
                      </th>
                  </tr>
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3"></th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3"></th>
                    <th className="hidden sm:table-cell px-6 py-3"></th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Absent
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      %
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Absent
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.student_id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {student.student_id}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {student.firstname} {student.lastname}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.department}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {student.presentDays}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {student.absentDays}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {student.attendancePercentage}%
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {student.softskillPresentDays}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {student.softskillAbsentDays}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {student.softskillAttendancePercentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </motion.div>

         {/* Error message */}
         {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-md bg-red-50 p-3 sm:p-4"
            >
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
