import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  // Set document title
  useEffect(() => {
    document.title = '404 - Page Not Found | Rivong Feedback System';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-yellow-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-900">Page not found</h2>
        <p className="mt-4 text-gray-600 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Go back home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
