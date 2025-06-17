import axios from 'axios';

const API_BASE_URL = 'https://student-score-predictor-api.onrender.com';
// const API_BASE_URL = 'http://localhost:5001';

/**
 * Predicts a single score type (math, reading, or writing)
 * @param {string} scoreType - The type of score to predict ('math', 'reading', 'writing')
 * @param {Object} studentData - Student features data
 * @returns {Promise} - Prediction result
 */
export const predictScore = async (scoreType, studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/${scoreType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Prediction failed');
    }
    return data;
  } catch (error) {
    console.error('Error predicting score:', error);
    throw error;
  }
};

/**
 * Predicts all scores (math, reading, and writing)
 * @param {Object} studentData - Student features data
 * @returns {Promise} - All predictions result
 */
export const predictAllScores = async (studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Predictions failed');
    }
    return data;
  } catch (error) {
    console.error('Error predicting scores:', error);
    throw error;
  }
};

/**
 * Gets model metadata including version and performance metrics
 * @returns {Promise} - Model metadata
 */
export const getModelMetadata = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/model/metadata`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch model metadata');
    }
    return data.metadata;
  } catch (error) {
    console.error('Error fetching model metadata:', error);
    throw error;
  }
};

/**
 * Gets feature importance for a specific score type or all scores
 * @param {string} [scoreType] - Optional score type ('math', 'reading', 'writing')
 * @returns {Promise} - Feature importance data
 */
export const getFeatureImportance = async (scoreType = null) => {
  try {
    const url = scoreType 
      ? `${API_BASE_URL}/model/feature-importance?score_type=${scoreType}`
      : `${API_BASE_URL}/model/feature-importance`;
      
    const response = await fetch(url);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch feature importance');
    }
    return data.feature_importance;
  } catch (error) {
    console.error('Error fetching feature importance:', error);
    throw error;
  }
};

/**
 * Checks if the backend service is healthy
 * @returns {Promise<boolean>} - True if service is healthy
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Error checking health:', error);
    return false;
  }
};

export const fetchPlots = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/plots`);
    if (response.data.success) {
      return response.data.plots;
    }
    throw new Error('Failed to fetch plots');
  } catch (error) {
    console.error('Error fetching plots:', error);
    throw error;
  }
}; 