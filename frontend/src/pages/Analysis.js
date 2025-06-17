import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchPlots, getModelMetrics } from '../services/api';

const Analysis = () => {
  const [plots, setPlots] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [plotUrls, metricsData] = await Promise.all([
          fetchPlots(),
          getModelMetrics()
        ]);
        setPlots(plotUrls);
        setMetrics(metricsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load analysis data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  // Group plots by category based on filename
  const groupPlots = () => {
    const groups = {
      'Score Analysis': plots.filter(plot => plot.includes('score_')),
      'Outlier Analysis': plots.filter(plot => plot.includes('outlier_')),
      'Feature Analysis': plots.filter(plot => plot.includes('feature_')),
      'Encoding Analysis': plots.filter(plot => plot.includes('encoding_')),
      'Scaling Analysis': plots.filter(plot => plot.includes('scaling_')),
      'Other Analysis': plots.filter(plot => 
        !plot.includes('score_') && 
        !plot.includes('outlier_') && 
        !plot.includes('feature_') && 
        !plot.includes('encoding_') && 
        !plot.includes('scaling_')
      )
    };

    // Remove empty categories
    return Object.fromEntries(
      Object.entries(groups).filter(([_, plots]) => plots.length > 0)
    );
  };

  const groupedPlots = groupPlots();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-white mb-8"
      >
        Data Analysis & Insights
      </motion.h1>

      {/* Model Metrics Section */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Model Performance Metrics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(metrics.metrics).map(([scoreType, scoreMetrics]) => (
              <div key={scoreType} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 capitalize">
                  {scoreType} Score Model
                </h3>
                
                {/* Full Model Metrics */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Full Model (with score features)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>R² Score:</span>
                      <span className="font-medium text-green-600">{(scoreMetrics.full_model.r2_score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MAE:</span>
                      <span className="font-medium">{scoreMetrics.full_model.mae}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RMSE:</span>
                      <span className="font-medium">{scoreMetrics.full_model.rmse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CV Score:</span>
                      <span className="font-medium text-blue-600">{(scoreMetrics.full_model.cv_score_mean * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Initial Model Metrics */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Initial Model (without score features)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>R² Score:</span>
                      <span className="font-medium text-green-600">{(scoreMetrics.initial_model.r2_score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MAE:</span>
                      <span className="font-medium">{scoreMetrics.initial_model.mae}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RMSE:</span>
                      <span className="font-medium">{scoreMetrics.initial_model.rmse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CV Score:</span>
                      <span className="font-medium text-blue-600">{(scoreMetrics.initial_model.cv_score_mean * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Training Data Size:</strong> {metrics.training_size} samples</p>
            <p><strong>Last Updated:</strong> {new Date(metrics.last_updated).toLocaleDateString()}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {Object.entries(groupedPlots).map(([category, categoryPlots]) => (
          <motion.div
            key={category}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPlots.map((plot, index) => (
                <motion.div
                  key={plot}
                  variants={itemVariants}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <img
                    src={plot}
                    alt={`Analysis plot ${index + 1}`}
                    className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    loading="lazy"
                  />
                  <p className="mt-2 text-sm text-gray-600 text-center">
                    {plot.split('/').pop().replace(/\.(png|jpg|jpeg|svg)$/, '').split('_').join(' ')}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Analysis; 