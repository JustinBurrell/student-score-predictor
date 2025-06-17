import React from 'react';

const Analysis = () => {
  return (
    <div className="flex flex-col items-center pt-10 sm:pt-16 px-2">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 text-center">
        Data Analysis
      </h1>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-2xl md:max-w-5xl w-full">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4 text-center">Data Exploration</h2>
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-40 sm:h-56 md:h-64 flex items-center justify-center">
              <p className="text-sm sm:text-base md:text-lg text-gray-500 text-center">Data exploration charts will be displayed here</p>
            </div>
          </section>
          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4 text-center">Model Performance</h2>
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-40 sm:h-56 md:h-64 flex items-center justify-center">
              <p className="text-sm sm:text-base md:text-lg text-gray-500 text-center">Model performance metrics will be displayed here</p>
            </div>
          </section>
          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4 text-center">Feature Importance</h2>
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-40 sm:h-56 md:h-64 flex items-center justify-center">
              <p className="text-sm sm:text-base md:text-lg text-gray-500 text-center">Feature importance charts will be displayed here</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Analysis; 