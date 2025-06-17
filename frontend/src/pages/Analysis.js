import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPlots, getModelMetrics } from '../services/api';

const Analysis = () => {
  const [plots, setPlots] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure page transition animation completes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Animation variants
  const fadeInUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.5 } }
  });

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

  // Analysis descriptions
  const analysisDescriptions = {
    'Score Analysis': 'Score analysis reveals the fundamental relationships between math, reading, and writing scores. Our analysis shows strong correlations between these subjects, with correlation coefficients ranging from 0.8 to 0.9. This insight was crucial for our feature engineering strategy - we created polynomial features from these correlated scores, which dramatically improved model performance. The analysis also revealed that students who perform well in one subject tend to perform well in others, suggesting that academic ability is transferable across subjects. This understanding guided our decision to include score interactions as features in our full model.',
    'Outlier Analysis': 'Outlier detection is essential for understanding data quality and identifying unusual patterns that could skew our model. Our analysis revealed that while most scores fall within expected ranges (35-100), there are some extreme values that could represent either genuine high performers or potential data entry errors. We carefully examined these outliers to determine whether they should be included in training. The analysis showed that outliers were mostly legitimate high scores from students with strong academic backgrounds and test preparation, so we retained them. This decision was validated by our model\'s ability to handle these cases without overfitting.',
    'Feature Analysis': 'Feature analysis examines how demographic and educational factors influence test performance. Our analysis revealed significant patterns: students with higher parental education levels tend to perform better, those who completed test preparation courses show marked improvements, and there are notable differences between gender groups and racial/ethnic groups. However, the most important insight was that these demographic features alone provide limited predictive power (36.8% accuracy). This finding motivated our feature engineering approach - we needed to create more sophisticated features that capture the complex interactions between these variables and existing test scores.',
    'Encoding Analysis': 'Categorical variable encoding analysis demonstrates how different encoding strategies affect model performance. We compared one-hot encoding, label encoding, and target encoding approaches. The analysis revealed that one-hot encoding works best for our categorical variables (gender, race/ethnicity, parental education, lunch type, test preparation) because it preserves the categorical nature without imposing ordinal relationships. This encoding strategy, combined with proper scaling, ensures that our model can learn meaningful patterns from categorical data without bias. The analysis also showed that encoding choice can impact model interpretability and feature importance rankings.',
    'Scaling Analysis': 'Scaling analysis demonstrates the critical impact of normalization techniques on model performance. We compared MinMax scaling, Standard scaling, and Robust scaling approaches. The analysis revealed that MinMax scaling works best for our score features because it preserves the bounded nature of test scores (0-100 range) while ensuring all features contribute equally to the model. This scaling approach, combined with polynomial feature creation, was key to achieving our 95.4% accuracy. The analysis also showed that proper scaling is essential for gradient-based algorithms and helps prevent features with larger scales from dominating the learning process.',
    'Other Analysis': 'Additional exploratory analysis provides comprehensive insights into data patterns, distributions, and relationships that inform our overall modeling strategy. This includes distribution analysis showing that scores follow approximately normal distributions with slight skews, correlation analysis revealing the strength of relationships between variables, and interaction analysis identifying which feature combinations provide the most predictive power. These insights guided our feature engineering decisions, helped us choose appropriate algorithms, and validated our modeling approach. The analysis also revealed important demographic patterns that could inform educational policy and intervention strategies.'
  };

  if (loading) {
    return (
      <motion.div
        variants={fadeInUp(0.1)}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex justify-center items-center min-h-screen"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={fadeInUp(0.1)}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex justify-center items-center min-h-screen text-red-500"
      >
        {error}
      </motion.div>
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
    <div className="flex flex-col items-center pt-8 sm:pt-12 md:pt-16 px-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.h1
          variants={fadeInUp(0.1)}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          exit="exit"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 text-center"
        >
          Data Analysis & Model Performance Dashboard
        </motion.h1>
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-2xl md:max-w-5xl w-full">
        <div className="space-y-8">
          {/* Model Metrics Section */}
          {metrics && (
            <motion.section
              variants={fadeInUp(0.2)}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit="exit"
            >
              <motion.h2
                variants={fadeInUp(0.3)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
                className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4"
              >
                Model Performance Metrics
              </motion.h2>
              
              {/* Performance Metrics Explanation */}
              <motion.p
                variants={fadeInUp(0.4)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
                className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
              >
                Performance metrics are the foundation of evaluating machine learning models. They tell us not just how well our model performs, but why it performs that way. The dramatic improvement from 36.8% to 95.4% accuracy demonstrates the critical importance of data preprocessing and feature engineering. This 58.6 percentage point improvement shows how thoughtful feature creation, proper scaling, and domain knowledge can transform a mediocre model into an excellent one. These metrics validate our approach and demonstrate the value of systematic data science methodology.
              </motion.p>

              <motion.div
                variants={fadeInUp(0.5)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {Object.entries(metrics.metrics).map(([scoreType, scoreMetrics], index) => (
                  <motion.div
                    key={scoreType}
                    variants={fadeInUp(0.6 + index * 0.1)}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    exit="exit"
                    className="bg-gray-50 rounded-lg p-4"
                  >
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
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div
                variants={fadeInUp(1.0)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
                className="mt-4 text-sm text-gray-600"
              >
                <p><strong>Training Data Size:</strong> {metrics.training_size} samples</p>
                <p><strong>Last Updated:</strong> {new Date(metrics.last_updated).toLocaleDateString()}</p>
              </motion.div>
            </motion.section>
          )}

          {/* Data Processing & Feature Engineering Section */}
          <motion.section
            variants={fadeInUp(1.1)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
            className="bg-green-50 rounded-lg p-4 sm:p-6 border-l-4 border-green-500"
          >
            <motion.h2
              variants={fadeInUp(1.15)}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit="exit"
              className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4 text-gray-800"
            >
              Data Processing & Feature Engineering
            </motion.h2>
            <motion.div
              variants={fadeInUp(1.2)}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit="exit"
              className="space-y-4 text-sm sm:text-base text-gray-700"
            >
              <motion.div
                variants={fadeInUp(1.25)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                <h3 className="font-semibold text-gray-800 mb-2">Data Cleaning Process:</h3>
                <p className="text-gray-600">
                  Our data cleaning process began with a comprehensive analysis of the Students Performance dataset. We identified and handled missing values, checked for data consistency, and validated the integrity of test scores. The dataset contained 1,000 student records with demographic information and test scores across three subjects. We ensured all categorical variables were properly encoded and numerical values fell within expected ranges (0-100 for test scores). This thorough cleaning process established a solid foundation for our feature engineering efforts.
                </p>
              </motion.div>
              
              <motion.div
                variants={fadeInUp(1.3)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                <h3 className="font-semibold text-gray-800 mb-2">Feature Engineering Strategy:</h3>
                <p className="text-gray-600">
                  The key insight that drove our feature engineering was recognizing the inherent correlations between math, reading, and writing scores. We created polynomial features from these correlated scores, including squared terms and interaction terms. This approach captured the non-linear relationships that simple linear models would miss. We also implemented proper scaling techniques, comparing MinMax, Standard, and Robust scaling to ensure all features contributed equally to the model. The combination of polynomial features and appropriate scaling was instrumental in achieving our 95.4% accuracy.
                </p>
              </motion.div>
              
              <motion.div
                variants={fadeInUp(1.35)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                <h3 className="font-semibold text-gray-800 mb-2">Model Development Approach:</h3>
                <p className="text-gray-600">
                  We adopted an iterative approach, starting with basic models using only demographic features (achieving 36.8% accuracy), then progressively adding engineered features and testing different algorithms. This systematic methodology allowed us to measure the impact of each improvement and validate our feature engineering decisions. The dramatic performance improvement demonstrates how thoughtful data preprocessing and feature creation can transform model outcomes.
                </p>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Analysis Plots Section */}
          <motion.section
            variants={fadeInUp(1.4)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="space-y-8"
            >
              {Object.entries(groupedPlots).map(([category, categoryPlots], categoryIndex) => (
                <motion.div
                  key={category}
                  variants={fadeInUp(1.6 + categoryIndex * 0.2)}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  exit="exit"
                  className="bg-gray-50 rounded-lg p-4 sm:p-6"
                >
                  <motion.h2
                    variants={fadeInUp(1.7 + categoryIndex * 0.2)}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    exit="exit"
                    className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4 text-gray-800"
                  >
                    {category}
                  </motion.h2>
                  
                  {/* Analysis Description */}
                  <motion.p
                    variants={fadeInUp(1.8 + categoryIndex * 0.2)}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    exit="exit"
                    className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
                  >
                    {analysisDescriptions[category]}
                  </motion.p>

                  <motion.div
                    variants={fadeInUp(1.9 + categoryIndex * 0.2)}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    exit="exit"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  >
                    {categoryPlots.map((plot, index) => (
                      <motion.div
                        key={plot}
                        variants={fadeInUp(2.0 + categoryIndex * 0.2 + index * 0.1)}
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                        exit="exit"
                        className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-xl transition-shadow duration-300"
                      >
                        <motion.img
                          src={plot}
                          alt={`Analysis plot ${index + 1}`}
                          className="w-full h-auto rounded-lg cursor-pointer"
                          loading="lazy"
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                          onClick={() => setSelectedImage(plot)}
                        />
                        <motion.p
                          variants={fadeInUp(2.1 + categoryIndex * 0.2 + index * 0.1)}
                          initial="hidden"
                          animate={isLoaded ? "visible" : "hidden"}
                          exit="exit"
                          className="mt-2 text-sm text-gray-600 text-center"
                        >
                          {plot.split('/').pop().replace(/\.(png|jpg|jpeg|svg)$/, '').split('_').join(' ')}
                        </motion.p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Conclusion Section */}
          <motion.section
            variants={fadeInUp(3.7)}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
            className="bg-blue-50 rounded-lg p-4 sm:p-6 border-l-4 border-blue-500"
          >
            <motion.h2
              variants={fadeInUp(3.8)}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit="exit"
              className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4 text-gray-800"
            >
              Key Findings & Implications
            </motion.h2>
            <motion.div
              variants={fadeInUp(3.9)}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit="exit"
              className="space-y-3 text-sm sm:text-base text-gray-700"
            >
              <motion.p
                variants={fadeInUp(4.0)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                <strong>Feature Engineering is Critical:</strong> The dramatic performance improvement from 36.8% to 95.4% accuracy demonstrates that thoughtful feature engineering can more than double model performance. Creating polynomial features from correlated test scores and implementing proper scaling techniques were key to this success.
              </motion.p>
              <motion.p
                variants={fadeInUp(4.1)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                <strong>Domain Knowledge Matters:</strong> Understanding that test scores are inherently correlated allowed us to create meaningful features that significantly improved predictions. This highlights the importance of subject matter expertise in data science.
              </motion.p>
              <motion.p
                variants={fadeInUp(4.2)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                <strong>Systematic Approach Yields Results:</strong> The iterative process of starting with basic models, analyzing performance, engineering features, and retraining demonstrates how systematic methodology leads to superior outcomes. This approach is replicable across different domains and datasets.
              </motion.p>
              <motion.p
                variants={fadeInUp(4.3)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                <strong>Validation Strategy is Essential:</strong> Using cross-validation and multiple metrics (R², MAE, RMSE) ensures our performance estimates are reliable and not due to overfitting. This comprehensive evaluation approach builds confidence in model deployment.
              </motion.p>
            </motion.div>
          </motion.section>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setSelectedImage(null);
              setImageZoom(1);
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setImageZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
              }}
            >
              <img
                src={selectedImage}
                alt="Analysis plot"
                className="w-full h-auto rounded-lg shadow-2xl transition-transform duration-200"
                style={{ transform: `scale(${imageZoom})` }}
              />
              
              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.2))}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  title="Zoom Out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button
                  onClick={() => setImageZoom(1)}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  title="Reset Zoom"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <button
                  onClick={() => setImageZoom(prev => Math.min(3, prev + 0.2))}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  title="Zoom In"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImageZoom(1);
                }}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Zoom Level Indicator */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-1 shadow-lg text-sm font-medium">
                {Math.round(imageZoom * 100)}%
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analysis; 