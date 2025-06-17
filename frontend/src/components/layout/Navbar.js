import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors } from '../../styles/colors';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full h-14 sm:h-16 bg-gradient-to-b from-black/20 to-transparent pt-4 sm:pt-12">
      <div className="h-full flex justify-center items-center px-2 sm:px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-full px-3 py-1 sm:px-6 sm:py-2 shadow-lg">
          <div className="flex space-x-4 sm:space-x-8">
            <Link
              to="/"
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/prediction"
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                isActive('/prediction') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Prediction
            </Link>
            <Link
              to="/analysis"
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                isActive('/analysis') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Analysis
            </Link>
            <Link
              to="/about"
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                isActive('/about') 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar; 