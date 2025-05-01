import { Link } from 'react-router-dom';
import { useState } from 'react';

const ErrorPage = () => {
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 800);
  };

  return (
    <div className="font-lato min-h-screen flex items-center justify-center bg-gradient-to-br from-burnt-orange-50 via-white to-brand-green-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 
            className={`font-lato text-6xl font-bold text-burnt-orange-500 sm:text-8xl md:text-9xl
              animate-[float_3s_ease-in-out_infinite] hover:scale-110 transition-transform
              cursor-pointer ${isShaking ? 'animate-[shake_0.8s_ease-in-out]' : ''}`}
            onClick={triggerShake}
          >
            404
          </h1>
          <h2 className="font-lato mt-4 text-xl font-semibold text-gray-800 sm:text-2xl md:text-3xl
            transition-all duration-300 hover:text-brand-green-500">
            Page Not Found
          </h2>
          <p className="font-lato mt-4 text-gray-600 text-base sm:text-lg
            transition-opacity duration-300 hover:opacity-75">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <div className="mt-8 p-4 bg-brand-green-50 rounded-lg">
            <p className="font-lato text-brand-green-600 font-medium">
              Please reach out to the administrator to get the required link to access the system.
            </p>
          </div>
        </div>
        
        <Link 
          to="/"
          className="inline-flex items-center justify-center px-5 py-3 border 
            border-transparent text-base font-medium rounded-md text-white 
            bg-burnt-orange-500 hover:bg-burnt-orange-600 sm:text-lg
            transform transition-all duration-300 hover:scale-105 
            hover:shadow-lg active:scale-95"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;