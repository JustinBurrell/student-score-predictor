import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaReact, 
  FaPython, 
  FaJs, 
  FaGithub,
  FaDatabase,
  FaServer,
  FaChartBar,
  FaBrain,
  FaCogs,
  FaCode,
  FaChartLine,
  FaChartPie,
  FaCog,
  FaLinkedin
} from 'react-icons/fa';
import { 
  SiTailwindcss, 
  SiFramer, 
  SiVercel, 
  SiFlask, 
  SiRender, 
  SiPandas, 
  SiNumpy, 
  SiScikitlearn
} from 'react-icons/si';
import { 
  MdDataUsage,
  MdStorage,
  MdAnalytics,
  MdScience
} from 'react-icons/md';

const About = () => {
  return (
    <div className="flex flex-col items-center pt-16">
      <h1 className="text-5xl font-bold text-white mb-8">
        The Story Behind the Project
      </h1>
      <div className="bg-white shadow rounded-lg p-6 max-w-5xl w-full">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Project Motivation
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                As someone deeply passionate about the potential of AI and machine learning, I've always been intrigued by how data can be used to drive insights and make informed predictions. I wanted to deepen my hands-on experience with real-world ML workflows while building something tangible from end to end. Although I had heard of libraries like scikit-learn and understood the general process of training a model, I wasn't sure where to start.
              </p>
              <p className="text-gray-600 mt-6">
                This project gave me the perfect opportunity to bridge that gap. I discovered the Students Performance dataset on  
                <a 
                  href="https://www.kaggle.com/datasets/spscientist/students-performance-in-exams" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#0096C7', fontWeight: 'bold' }}
                > Kaggle
                </a>, which offered clean, structured data ideal for a beginner-friendly regression task. From there, I began exploring how to preprocess data with pandas, visualize trends with matplotlib, train and evaluate models with scikit-learn, and ultimately build a full-stack application using Flask and React. Beyond strengthening my technical skills, this project reinforced my interest in ML and demonstrated how accessible and powerful predictive modeling can be when paired with the right tools.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Tech Stack
            </h2>
            <div className="prose max-w-none mb-6">
              <p className="text-gray-600">
              This project is a personal passion project built to help me develop and showcase skills in full-stack development, data analysis, and machine learning. It leverages a modern tech stack that combines a dynamic frontend, scalable backend services, and robust ML libraries. The project demonstrates a practical understanding of AI/ML workflows, including data cleaning, feature engineering, model training, and API integration, while highlighting how these components come together in a real-world application.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Frontend</h3>
                  <div className="flex justify-center items-center space-x-8">
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://reactjs.org/', '_blank')}
                    >
                      <FaReact className="w-16 h-16 text-blue-500" />
                      <span className="text-base text-gray-600 mt-2">React</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://tailwindcss.com/', '_blank')}
                    >
                      <SiTailwindcss className="w-16 h-16 text-cyan-500" />
                      <span className="text-base text-gray-600 mt-2">Tailwind</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/JavaScript', '_blank')}
                    >
                      <FaJs className="w-16 h-16 text-yellow-500" />
                      <span className="text-base text-gray-600 mt-2">JavaScript</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://www.framer.com/motion/', '_blank')}
                    >
                      <SiFramer className="w-16 h-16 text-purple-500" />
                      <span className="text-base text-gray-600 mt-2">Framer</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://vercel.com/', '_blank')}
                    >
                      <SiVercel className="w-16 h-16 text-black" />
                      <span className="text-base text-gray-600 mt-2">Vercel</span>
                    </motion.div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Backend</h3>
                  <div className="flex justify-center items-center space-x-8">
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://flask.palletsprojects.com/', '_blank')}
                    >
                      <SiFlask className="w-16 h-16 text-green-500" />
                      <span className="text-base text-gray-600 mt-2">Flask</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://www.python.org/', '_blank')}
                    >
                      <FaPython className="w-16 h-16 text-blue-600" />
                      <span className="text-base text-gray-600 mt-2">Python</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://render.com/', '_blank')}
                    >
                      <SiRender className="w-16 h-16 text-orange-500" />
                      <span className="text-base text-gray-600 mt-2">Render</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://restfulapi.net/', '_blank')}
                    >
                      <FaServer className="w-16 h-16 text-indigo-500" />
                      <span className="text-base text-gray-600 mt-2">REST API</span>
                    </motion.div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Data Analysis</h3>
                  <div className="flex justify-center items-center space-x-8">
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://pandas.pydata.org/', '_blank')}
                    >
                      <SiPandas className="w-16 h-16 text-blue-700" />
                      <span className="text-base text-gray-600 mt-2">Pandas</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://numpy.org/', '_blank')}
                    >
                      <SiNumpy className="w-16 h-16 text-green-600" />
                      <span className="text-base text-gray-600 mt-2">NumPy</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://matplotlib.org/', '_blank')}
                    >
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Created_with_Matplotlib-logo.svg/2048px-Created_with_Matplotlib-logo.svg.png" 
                        alt="Matplotlib" 
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-base text-gray-600 mt-2">Matplotlib</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://seaborn.pydata.org/', '_blank')}
                    >
                      <img 
                        src="https://cdn.worldvectorlogo.com/logos/seaborn-1.svg" 
                        alt="Seaborn" 
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-base text-gray-600 mt-2">Seaborn</span>
                    </motion.div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">ML Modeling</h3>
                  <div className="flex justify-center items-center space-x-8">
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://scikit-learn.org/', '_blank')}
                    >
                      <SiScikitlearn className="w-16 h-16 text-orange-600" />
                      <span className="text-base text-gray-600 mt-2">Scikit-learn</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://joblib.readthedocs.io/', '_blank')}
                    >
                      <img 
                        src="https://joblib.readthedocs.io/en/stable/_static/favicon.ico" 
                        alt="Joblib" 
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-base text-gray-600 mt-2">Joblib</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://www.python.org/', '_blank')}
                    >
                      <FaPython className="w-16 h-16 text-blue-600" />
                      <span className="text-base text-gray-600 mt-2">Python</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center cursor-pointer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => window.open('https://numpy.org/', '_blank')}
                    >
                      <SiNumpy className="w-16 h-16 text-green-600" />
                      <span className="text-base text-gray-600 mt-2">NumPy</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About Me
            </h2>
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-6">
              {/* Left Side: Blurb and Links */}
              <div className="flex-1 flex flex-col items-start">
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-600 mb-6">
                    Hey! I'm Justin Burrell, a rising senior majoring in Computer Science and Engineering student at Lehigh University, with a passion for building equitable, scalable solutions that help people and create meaningful impact. My experience spans tech consulting, full stack engineering, and business strategy, allowing me to approach problems from both a technical and strategic lens. I've also held multiple leadership roles in student organizations, where I've focused on advocacy, inclusion, and empowering underrepresented communities in tech.
                  </p>
                  <p className="text-gray-600 mt-6">
                    If you'd like to connect or learn more about my passions, feel free to reach out via LinkedIn, Email, or through my personal website!
                  </p>
                </div>
                <div className="mt-2 flex justify-center w-full space-x-6">
                  <a
                    href="https://thejustinburrell.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center text-xl"
                  >
                    Portfolio
                  </a>
                  <a
                    href="https://github.com/JustinBurrell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center"
                  >
                    <FaGithub className="w-7 h-7" />
                  </a>
                  <a
                    href="https://linkedin.com/in/thejustinburrell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center"
                  >
                    <FaLinkedin className="w-7 h-7" />
                  </a>
                </div>
              </div>
              {/* Right Side: Image */}
              <div className="flex-shrink-0">
                <img 
                  src="/images/Justin Burrell.JPG" 
                  alt="Justin Burrell" 
                  className="w-48 h-64 object-cover rounded-2xl shadow-lg border border-gray-200" 
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About; 