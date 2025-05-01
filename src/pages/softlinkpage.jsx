import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Axios global configuration
axios.defaults.withCredentials = true;
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Origin': window.location.origin
};

const SoftLinkPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLinkValidity = async () => {
      try {
        const response = await axios.get(`https://attendancebackend-gjjw.onrender.com/softskillvalidate/${id}`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (response.data.valid) {
          // Store the valid ID in localStorage
          localStorage.setItem('softLinkId', id);
          navigate('/signin');
        } else {
          setError('This link has expired');
          // Clear the ID from localStorage if it exists
          localStorage.removeItem('softLinkId');
        }
      } catch (err) {
        setError('Link verification failed');
        localStorage.removeItem('softLinkId');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      checkLinkValidity();
    } else {
      setError('Invalid link');
      localStorage.removeItem('softLinkId');
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Verifying your link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-600 text-xl font-bold mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <p className="text-gray-600">Please request a new link or contact support.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default SoftLinkPage;