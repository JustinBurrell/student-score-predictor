import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApiProvider } from './context/ApiContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Analysis from './pages/Analysis';
import About from './pages/About';

function App() {
  return (
    <Router>
      <ApiProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </ApiProvider>
    </Router>
  );
}

export default App;
