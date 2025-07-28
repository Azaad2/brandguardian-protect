
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomeLink from "@/components/navigation/HomeLink";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Track 404 errors for analytics if needed
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <HomeLink />
      </div>
    </div>
  );
};

export default NotFound;
