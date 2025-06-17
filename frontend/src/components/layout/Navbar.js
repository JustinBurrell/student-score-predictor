import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Score Predictor
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/' ? 'border-blue-500' : 'border-transparent'
                } ${isActive('/')}`}
              >
                Home
              </Link>
              <Link
                to="/prediction"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/prediction' ? 'border-blue-500' : 'border-transparent'
                } ${isActive('/prediction')}`}
              >
                Prediction
              </Link>
              <Link
                to="/analysis"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/analysis' ? 'border-blue-500' : 'border-transparent'
                } ${isActive('/analysis')}`}
              >
                Analysis
              </Link>
              <Link
                to="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/about' ? 'border-blue-500' : 'border-transparent'
                } ${isActive('/about')}`}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 