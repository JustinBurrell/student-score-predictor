import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkHealth, getModelMetadata } from '../services/api';

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHealthy, setIsHealthy] = useState(false);
  const [modelMetadata, setModelMetadata] = useState(null);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        // Check API health
        const healthy = await checkHealth();
        setIsHealthy(healthy);

        if (healthy) {
          // Fetch model metadata
          const metadata = await getModelMetadata();
          setModelMetadata(metadata);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApi();
  }, []);

  const value = {
    isLoading,
    error,
    isHealthy,
    modelMetadata,
    setError: (newError) => setError(newError),
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}; 