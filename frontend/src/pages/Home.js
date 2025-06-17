import React from 'react';
import { Link } from 'react-router-dom';
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
  return (
    <div className="flex flex-col">
      {/* Title Section */}
      <div className="text-center pt-52 pb-32">
        <h1 className="text-7xl font-bold text-white mb-8">
          Student Score Predictor
        </h1>
        <p className="text-2xl text-white text-opacity-90 max-w-3xl mx-auto">
          Harness the power of machine learning to predict student performance 
          in math, reading, and writing tests.
        </p>
      </div>

      {/* Cards Section */}
      <div className="pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-4">
          <Card
            to="/prediction"
            title="Make Predictions"
            description="Curious how machine learning works in practice? Use this interactive tool to predict your own test scores based on your input. This simulation demonstrates how regression models can identify patterns in data and make accurate predictions. It's a hands-on way to explore the potential of AI and data science, all in real time."
            icon={FaRobot}
          />
          <Card
            to="/analysis"
            title="View Analysis"
            description="Take a deep dive into the data analysis that powered this predictive model. This section breaks down how I cleaned, transformed, and explored the dataset to prepare it for machine learning. You'll see the full process—from handling missing values to engineering features, along with visualizations that highlight key trends and insights discovered during analysis. These charts help explain not just what the model learned, but why the data matters."
            icon={FaChartBar}
          />
          <Card
            to="/about"
            title="Learn More"
            description="Learn what inspired me to create this project and how it reflects my passion for data and software. I break down the full tech stack, from the tools used to build the backend and frontend, to the libraries that handled data processing and analysis. You'll also get a glimpse into who I am as a developer and problem-solver, and more importantly, how this project fits into my journey in tech."
            icon={FaLaptopCode}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-32 mb-16">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-6">
            Key Features
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Discover how our platform combines powerful machine learning with intuitive design to deliver accurate predictions and meaningful insights.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-4">
          <FeatureCard
            title="Machine Learning Powered"
            description="Our advanced machine learning model analyzes multiple factors to provide accurate predictions of student performance in various subjects."
          />
          <FeatureCard
            title="Data-Driven Insights"
            description="Gain valuable insights into student performance patterns and identify areas for improvement through comprehensive data analysis."
          />
          <FeatureCard
            title="Easy to Use Interface"
            description="Simple and intuitive interface makes it easy to input student data and receive instant predictions and recommendations."
          />
          <FeatureCard
            title="Comprehensive Analysis"
            description="View detailed breakdowns of predictions, including confidence scores and contributing factors to better understand the results."
          />
        </div>
      </div>
    </div>
  );
};

export default Home; 