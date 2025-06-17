import React, { useEffect, useState } from 'react';
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
  FaLinkedin,
  FaEnvelope
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure page transition animation completes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const fadeInUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.5 } }
  });
  const slideLeft = (delay = 0) => ({
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay } },
    exit: { opacity: 0, x: -60, transition: { duration: 0.5 } }
  });
  const slideRight = (delay = 0) => ({
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay } },
    exit: { opacity: 0, x: 60, transition: { duration: 0.5 } }
  });

  return (
    <div className="flex flex-col items-center pt-8 sm:pt-12 md:pt-16 px-2">
      {/* Project Motivation Title */}
      <motion.h1
        variants={fadeInUp(0)}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        exit="exit"
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 text-center"
      >
        The Story Behind the Project
      </motion.h1>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-2xl md:max-w-5xl w-full">
        <div className="space-y-8">
          {/* Project Motivation Section */}
          <section>
            <motion.h2
              variants={fadeInUp(0.2)}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit="exit"
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4 text-left"
            >
              Project Motivation
            </motion.h2>
            <div className="prose max-w-none">
              <motion.p
                variants={fadeInUp(0.4)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
                className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-6"
              >
                As someone deeply passionate about the potential of AI and machine learning, I've always been intrigued by how data can be used to drive insights and make informed predictions. I wanted to deepen my hands-on experience with real-world ML workflows while building something tangible from end to end. Although I had heard of libraries like scikit-learn and understood the general process of training a model, I wasn't sure where to start.
              </motion.p>
              <motion.p
                variants={fadeInUp(0.6)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
                className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-6"
              >
                This project gave me the perfect opportunity to bridge that gap. I discovered the Students Performance dataset on  
                <a 
                  href="https://www.kaggle.com/datasets/spscientist/students-performance-in-exams" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#0096C7', fontWeight: 'bold' }}
                > Kaggle
                </a>, which offered clean, structured data ideal for a beginner-friendly regression task. From there, I began exploring how to preprocess data with pandas, visualize trends with matplotlib, train and evaluate models with scikit-learn, and ultimately build a full-stack application using Flask and React. Beyond strengthening my technical skills, this project reinforced my interest in ML and demonstrated how accessible and powerful predictive modeling can be when paired with the right tools.
              </motion.p>
              <motion.div
                variants={fadeInUp(0.8)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
                className="text-gray-600 text-sm sm:text-base"
              >
                <br />
                To learn more about this project in detail, please refer to my{' '}
                <a 
                  href="https://github.com/JustinBurrell/student-score-predictor?tab=readme-ov-file#readme" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#0096C7', fontWeight: 'bold' }}
                >
                  project documentation
                </a>
                {' '}on Github.
              </motion.div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section>
            <motion.h2
              variants={fadeInUp(1.0)}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit="exit"
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4 text-left"
            >
              Tech Stack
            </motion.h2>
            <motion.div
              variants={fadeInUp(1.2)}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit="exit"
              className="prose max-w-none mb-4 sm:mb-6"
            >
              <p className="text-sm sm:text-base text-gray-600">
                This project is a personal passion project built to help me develop and showcase skills in full-stack development, data analysis, and machine learning. It leverages a modern tech stack that combines a dynamic frontend, scalable backend services, and robust ML libraries. The project demonstrates a practical understanding of AI/ML workflows, including data cleaning, feature engineering, model training, and API integration, while highlighting how these components come together in a real-world application.
              </p>
            </motion.div>
            <div className="space-y-8 w-full">
              <motion.div
                variants={slideLeft(1.4)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                {/* Frontend row (slide in left) */}
                <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Frontend</h3>
                <div className="flex justify-center items-center space-x-4 sm:space-x-8">
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://reactjs.org/', '_blank')}
                  >
                    <FaReact className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-blue-500" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">React</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://tailwindcss.com/', '_blank')}
                  >
                    <SiTailwindcss className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-cyan-500" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Tailwind</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/JavaScript', '_blank')}
                  >
                    <FaJs className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-yellow-500" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">JavaScript</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://www.framer.com/motion/', '_blank')}
                  >
                    <SiFramer className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-purple-500" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Framer</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://vercel.com/', '_blank')}
                  >
                    <SiVercel className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-black" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Vercel</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                variants={slideRight(1.6)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                {/* Backend row (slide in right) */}
                <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Backend</h3>
                <div className="flex justify-center items-center space-x-4 sm:space-x-8">
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://flask.palletsprojects.com/', '_blank')}
                  >
                    <SiFlask className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-green-500" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Flask</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://www.python.org/', '_blank')}
                  >
                    <FaPython className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-blue-600" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Python</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://render.com/', '_blank')}
                  >
                    <SiRender className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-orange-500" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Render</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://restfulapi.net/', '_blank')}
                  >
                    <FaServer className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-indigo-500" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">REST API</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                variants={slideLeft(1.8)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                {/* Data Analysis row (slide in left) */}
                <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Data Analysis</h3>
                <div className="flex justify-center items-center space-x-4 sm:space-x-8">
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://pandas.pydata.org/', '_blank')}
                  >
                    <SiPandas className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-blue-700" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Pandas</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://numpy.org/', '_blank')}
                  >
                    <SiNumpy className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-green-600" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">NumPy</span>
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
                      className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Matplotlib</span>
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
                      className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Seaborn</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                variants={slideRight(2.0)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
              >
                {/* ML Modeling row (slide in right) */}
                <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">ML Modeling</h3>
                <div className="flex justify-center items-center space-x-4 sm:space-x-8">
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://scikit-learn.org/', '_blank')}
                  >
                    <SiScikitlearn className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-orange-600" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Scikit-learn</span>
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
                      className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Joblib</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://www.python.org/', '_blank')}
                  >
                    <FaPython className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-blue-600" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">Python</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => window.open('https://numpy.org/', '_blank')}
                  >
                    <SiNumpy className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-green-600" />
                    <span className="text-xs sm:text-base text-gray-600 mt-2">NumPy</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* About Me Section */}
          <section>
            <motion.h2
              variants={fadeInUp(2.2)}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit="exit"
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4 text-left"
            >
              About Me
            </motion.h2>
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 sm:gap-8 md:gap-10 mb-4 sm:mb-6 px-2">
              {/* Left Side: Blurb and Links */}
              <div className="flex-1 flex flex-col items-start w-full">
                <div className="prose max-w-none mb-2 sm:mb-4 md:mb-6">
                  <motion.p
                    variants={fadeInUp(2.4)}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    exit="exit"
                    className="text-xs sm:text-sm md:text-base text-gray-600 mb-1 sm:mb-2 md:mb-6"
                  >
                    Hey! I'm Justin Burrell, a rising senior majoring in Computer Science and Engineering student at Lehigh University, with a passion for building equitable, scalable solutions that help people and create meaningful impact. My experience spans tech consulting, full stack engineering, and business strategy, allowing me to approach problems from both a technical and strategic lens. I've also held multiple leadership roles in student organizations, where I've focused on advocacy, inclusion, and empowering underrepresented communities in tech.
                  </motion.p>
                  <motion.p
                    variants={fadeInUp(2.6)}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    exit="exit"
                    className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2 md:mt-6"
                  >
                    If you'd like to connect or learn more about my passions, feel free to reach out via LinkedIn, Email, or through my personal website!
                  </motion.p>
                </div>
                <motion.div
                  variants={fadeInUp(2.8)}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  exit="exit"
                  className="mt-2 flex justify-center w-full space-x-2 sm:space-x-4 md:space-x-6"
                >
                  <motion.a
                    href="https://thejustinburrell.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center text-sm sm:text-base md:text-xl"
                  >
                    Portfolio
                  </motion.a>
                  <motion.a
                    href="https://github.com/JustinBurrell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center"
                  >
                    <FaGithub className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com/in/thejustinburrell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center"
                  >
                    <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </motion.a>
                  <motion.a
                    href="mailto:justinburrell715@gmail.com"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center"
                  >
                    <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </motion.a>
                </motion.div>
              </div>
              {/* Right Side: Image */}
              <motion.div
                variants={fadeInUp(2.7)}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                exit="exit"
                className="flex-shrink-0 mt-2 sm:mt-4 md:mt-0"
              >
                <img 
                  src="/images/Justin Burrell.JPG" 
                  alt="Justin Burrell" 
                  className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-56 lg:w-48 lg:h-64 object-cover rounded-2xl shadow-lg border border-gray-200" 
                />
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About; 