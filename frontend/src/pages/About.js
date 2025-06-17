import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center pt-16">
      <h1 className="text-5xl font-bold text-white mb-8">
        About the Project
      </h1>
      <div className="bg-white shadow rounded-lg p-6 max-w-5xl w-full">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Project Motivation
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-600">
                Project motivation will be added here...
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Tech Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Frontend</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>React</li>
                  <li>Tailwind CSS</li>
                  <li>React Router</li>
                </ul>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Backend</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Flask</li>
                  <li>Python</li>
                  <li>SQLite</li>
                </ul>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">ML Stack</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Scikit-learn</li>
                  <li>Pandas</li>
                  <li>NumPy</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About Me
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Your Name</h3>
                <p className="text-gray-600">
                  Your bio will be added here...
                </p>
                <div className="mt-4 flex space-x-4">
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About; 