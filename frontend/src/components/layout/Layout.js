import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { gradients } from '../../styles/colors';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        background: gradients.background,
        backgroundAttachment: 'fixed'
      }}
    >
      <Navbar />
      <motion.main
        className="flex-grow container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout; 