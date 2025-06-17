import React from 'react';
import { Link } from 'react-router-dom';
import { gradients } from '../styles/colors';

const Card = ({ to, title, description }) => (
  <Link
    to={to}
    className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
  >
    <div 
      className="rounded-xl overflow-hidden"
      style={{
        background: gradients.card,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-white text-opacity-90">{description}</p>
      </div>
    </div>
  </Link>
);

const FeatureCard = ({ title, description }) => (
  <div 
    className="p-6 rounded-xl"
    style={{
      background: gradients.card,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-white/80 leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Title Section */}
      <div className="text-center pt-32 pb-16">
        <h1 className="text-6xl font-bold text-white mb-6">
          Student Score Predictor
        </h1>
        <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto">
          Harness the power of machine learning to predict student performance 
          in math, reading, and writing tests.
        </p>
      </div>

      {/* Cards Section */}
      <div className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card
            to="/prediction"
            title="Make Predictions"
            description="Get accurate predictions for student test scores"
          />
          <Card
            to="/analysis"
            title="View Analysis"
            description="Explore data insights and performance metrics"
          />
          <Card
            to="/about"
            title="Learn More"
            description="Discover the technology behind the project"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 mb-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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