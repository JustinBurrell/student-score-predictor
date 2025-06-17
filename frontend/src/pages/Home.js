import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gradients } from '../styles/colors';
import { FaRobot, FaChartBar, FaLaptopCode } from 'react-icons/fa';

const Card = ({ to, title, description, icon: Icon }) => (
  <Link
    to={to}
    className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
  >
    <div 
      className="rounded-xl overflow-hidden relative flex flex-col h-full"
      style={{
        background: gradients.card,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-white text-opacity-90 leading-relaxed">{description}</p>
      </div>
      {Icon && (
        <div className="w-full flex justify-center pb-6 opacity-20">
          <Icon size={48} className="text-white" />
        </div>
      )}
    </div>
  </Link>
);

const FeatureCard = ({ title, description }) => (
  <div 
    className="p-8 rounded-xl max-w-lg mx-auto w-full transform transition-all duration-300 hover:scale-105"
    style={{
      background: gradients.card,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
    <p className="text-white/80 leading-relaxed text-lg">{description}</p>
  </div>
);

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure page transition animation completes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const fadeInUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.5 } }
  });
  const slideLeft = (delay = 0) => ({
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay } },
    exit: { opacity: 0, x: -60, transition: { duration: 0.5 } }
  });
  const slideRight = (delay = 0) => ({
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay } },
    exit: { opacity: 0, x: 60, transition: { duration: 0.5 } }
  });

  return (
    <div className="flex flex-col">
      {/* Title Section */}
      <div className="text-center pt-24 pb-16 sm:pt-32 sm:pb-24 md:pt-52 md:pb-32 px-2">
        <motion.h1 
          key="title"
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-8"
          variants={fadeInUp(0)}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          exit="exit"
        >
          Student Score Predictor
        </motion.h1>
        <motion.p 
          key="description"
          className="text-lg sm:text-xl md:text-2xl text-white text-opacity-90 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto"
          variants={fadeInUp(0.3)}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          exit="exit"
        >
          Using the power of artificial intelligence and machine learning, this project predicts student test scores based on a dataset that was cleaned, transformed, and analyzed to uncover key performance trends.
        </motion.p>
      </div>

      {/* Cards Section */}
      <div className="pt-8 sm:pt-16 md:pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 max-w-xs sm:max-w-2xl md:max-w-6xl mx-auto px-2 sm:px-4">
          <motion.div
            key="card1"
            variants={slideLeft(0.6)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            <Card
              to="/prediction"
              title="Make Predictions"
              description="Curious how machine learning works in practice? Use this interactive tool to predict your own test scores based on your input. This simulation demonstrates how regression models can identify patterns in data and make accurate predictions. It's a hands-on way to explore the potential of AI and data science, all in real time."
              icon={FaRobot}
            />
          </motion.div>
          <motion.div
            key="card2"
            variants={slideLeft(0.8)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            <Card
              to="/analysis"
              title="View Analysis"
              description="Take a deep dive into the data analysis that powered this predictive model. This section breaks down how I cleaned, transformed, and explored the dataset to prepare it for machine learning. You'll see the full process—from handling missing values to engineering features, along with visualizations that highlight key trends and insights discovered during analysis. These charts help explain not just what the model learned, but why the data matters."
              icon={FaChartBar}
            />
          </motion.div>
          <motion.div
            key="card3"
            variants={slideLeft(1.0)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            <Card
              to="/about"
              title="Learn More"
              description="Learn what inspired me to create this project and how it reflects my passion for data and software. I break down the full tech stack, from the tools used to build the backend and frontend, to the libraries that handled data processing and analysis. You'll also get a glimpse into who I am as a developer and problem-solver, and more importantly, how this project fits into my journey in tech."
              icon={FaLaptopCode}
            />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 sm:mt-20 md:mt-32 mb-8 sm:mb-12 md:mb-16">
        <div className="text-center mb-10 sm:mb-16 md:mb-20 px-2">
          <motion.h2 
            key="features-title"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-6"
            variants={fadeInUp(1.3)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            Key Features
          </motion.h2>
          <motion.p 
            key="features-description"
            className="text-base sm:text-lg md:text-xl text-white/80 max-w-xs sm:max-w-xl md:max-w-2xl mx-auto"
            variants={fadeInUp(1.5)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            Discover how this project combines data science, machine learning, and modern web development to create an engaging educational tool.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-xs sm:max-w-2xl md:max-w-6xl mx-auto px-2 sm:px-4">
          {/* Top two cards - slide in from left */}
          <motion.div
            key="feature1"
            variants={slideLeft(1.8)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            <FeatureCard
              title="AI/ML Powered Predictions"
              description="Demonstrates the complete machine learning lifecycle—from data preprocessing to model deployment. The project showcases the critical importance of data cleaning, feature engineering, and the iterative process of building effective predictive models."
            />
          </motion.div>
          <motion.div
            key="feature2"
            variants={slideLeft(2.0)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            <FeatureCard
              title="Comprehensive Analysis"
              description="Leveraging advanced data analysis techniques to uncover meaningful patterns and trends within the dataset. This thorough exploration informed the data cleaning process, resulting in a robust training dataset that powers accurate predictions."
            />
          </motion.div>
          {/* Bottom two cards - slide in from right */}
          <motion.div
            key="feature3"
            variants={slideRight(2.2)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            <FeatureCard
              title="Interactive User Experience"
              description="Built with React's powerful component system, the application offers an intuitive interface for testing the ML model. Users can input their own data and receive instant predictions, demostrating how to make complex machine learning accessible to everyone."
            />
          </motion.div>
          <motion.div
            key="feature4"
            variants={slideRight(2.4)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            <FeatureCard
              title="Modern Design Architecture"
              description="Crafted with React, enhanced by Framer animations, and styled using Tailwind CSS to create a responsive and engaging user interface. The result is a seamless, enjoyable experience that makes interacting with machine learning models both intuitive and visually appealing."
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home; 