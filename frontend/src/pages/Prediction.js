import React from 'react';

const Prediction = () => {
  return (
    <div className="flex flex-col items-center pt-10 sm:pt-16 px-2">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 text-center">
        Score Prediction
      </h1>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-2xl md:max-w-5xl w-full">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-48 sm:h-72 md:h-96 flex items-center justify-center">
          <p className="text-sm sm:text-base md:text-lg text-gray-500 text-center">Prediction form will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default Prediction; 