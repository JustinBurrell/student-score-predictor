import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to Student Score Predictor
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Predict student performance using machine learning
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Make Predictions</h2>
          <p className="text-gray-600 mb-4">
            Get accurate predictions for math, reading, and writing scores
          </p>
          <Link
            to="/prediction"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Predicting
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">View Analysis</h2>
          <p className="text-gray-600 mb-4">
            Explore data insights and model performance metrics
          </p>
          <Link
            to="/analysis"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View Analysis
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Learn More</h2>
          <p className="text-gray-600 mb-4">
            Discover the technology and motivation behind the project
          </p>
          <Link
            to="/about"
            className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            About Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 