import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { gradients } from '../../styles/colors';

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
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 