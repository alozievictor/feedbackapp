import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-2 space-x-6">
            <Link to="/about" className="text-gray-500 hover:text-gray-600">
              About
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-600">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-600">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-600">
              Contact
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} Rivong Creative Agency. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
