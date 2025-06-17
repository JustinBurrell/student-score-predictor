import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Student Score Predictor</h3>
            <p className="text-sm text-gray-300">
              Built with React, Flask, and Machine Learning
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} Student Score Predictor. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 