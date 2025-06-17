import React from 'react';
import { FaGithub, FaReact, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="mt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0 flex items-center">
            <span className="text-sm font-light text-white/90 mr-2">Created with</span>
            <motion.span
              className="mx-1"
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            >
              <FaReact className="w-5 h-5 text-cyan-400" />
            </motion.span>
            <span className="text-sm font-light text-white/90 ml-1">React</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://linkedin.com/in/thejustinburrell"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-white/80 hover:text-blue-400 transition-colors duration-300 text-lg"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/JustinBurrell/student-score-predictor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-white/80 hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
              aria-label="Source Code on GitHub"
            >
              <FaGithub className="w-6 h-6 mr-2" />
              Source Code
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