import React from 'react';
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-white/90">
              Student Score Predictor
            </h3>
            <p className="text-sm text-white/70">
              Built with React, Flask, and Machine Learning
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://github.com/JustinBurrell"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors duration-300 text-2xl"
              aria-label="GitHub Profile"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/thejustinburrell/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors duration-300 text-2xl"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="mailto:justinburrell715@gmail.com"
              className="text-white/70 hover:text-white transition-colors duration-300 text-2xl"
              aria-label="Email Me"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Justin Burrell. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 