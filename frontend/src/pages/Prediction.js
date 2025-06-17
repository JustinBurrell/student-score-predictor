import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GENDER_OPTIONS,
  RACE_ETHNICITY_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  LUNCH_OPTIONS,
  TEST_PREP_OPTIONS,
  SCORE_RANGES
} from '../constants/formOptions';
import { predictScore, predictAllScores } from '../services/api';

const MODEL_OPTIONS = [
  { value: 'all', label: 'Predict All Scores' },
  { value: 'math', label: 'Predict Math Score' },
  { value: 'reading', label: 'Predict Reading Score' },
  { value: 'writing', label: 'Predict Writing Score' },
];

const fadeInUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
  exit: { opacity: 0, y: -40, transition: { duration: 0.5 } }
});

const initialForm = {
  gender: '',
  race_ethnicity: '',
  parental_level_of_education: '',
  lunch: '',
  test_preparation_course: '',
  math_score: '',
  reading_score: '',
  writing_score: '',
};

const getRequiredScores = (modelType) => {
  if (modelType === 'all') return [];
  if (modelType === 'math') return ['reading_score', 'writing_score'];
  if (modelType === 'reading') return ['math_score', 'writing_score'];
  if (modelType === 'writing') return ['math_score', 'reading_score'];
  return [];
};

const Prediction = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [modelType, setModelType] = useState('');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.gender) newErrors.gender = 'Required';
    if (!form.race_ethnicity) newErrors.race_ethnicity = 'Required';
    if (!form.parental_level_of_education) newErrors.parental_level_of_education = 'Required';
    if (!form.lunch) newErrors.lunch = 'Required';
    if (!form.test_preparation_course) newErrors.test_preparation_course = 'Required';
    // Only require the correct scores for the selected prediction type
    const requiredScores = getRequiredScores(modelType);
    requiredScores.forEach(score => {
      const scoreType = score.replace('_score', '');
      if (!form[score] || isNaN(form[score]) || form[score] < SCORE_RANGES[scoreType].min || form[score] > SCORE_RANGES[scoreType].max) {
        newErrors[score] = `Enter a value between ${SCORE_RANGES[scoreType].min} and ${SCORE_RANGES[scoreType].max}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModelChange = (e) => {
    setModelType(e.target.value);
    setForm(initialForm);
    setErrors({});
    setResult(null);
    setShowResult(false);
    setTimeout(() => setShowForm(true), 100); // Animate in form fields
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setShowResult(false);
    setResult(null);
    try {
      let res;
      const payload = mapPayload(form, modelType);
      if (modelType === 'all') {
        res = await predictAllScores(payload);
      } else {
        res = await predictScore(modelType, payload);
      }
      setResult(res);
      setShowResult(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Prediction failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setForm(initialForm);
    setErrors({});
    setResult(null);
    setShowResult(false);
    setShowForm(false);
    setModelType('');
  };

  const renderOptions = (options) => options.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ));

  const renderInputSummary = () => (
    <div className="mb-6 flex justify-center">
      <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center w-fit mx-auto">
        <h3 className="font-semibold text-gray-700 mb-4 text-lg text-center">Your Input:</h3>
        <div className="flex flex-row justify-center gap-4 flex-wrap w-fit">
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-3 py-2 w-fit h-fit">
            <div className="text-sm font-bold text-gray-700 mb-1 text-center">Gender:</div>
            <div className="text-sm font-semibold text-gray-600 text-center">{GENDER_OPTIONS.find(opt => opt.value === form.gender)?.label || form.gender}</div>
          </div>
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-3 py-2 w-fit h-fit">
            <div className="text-sm font-bold text-gray-700 mb-1 text-center">Race/Ethnicity:</div>
            <div className="text-sm font-semibold text-gray-600 text-center">{RACE_ETHNICITY_OPTIONS.find(opt => opt.value === form.race_ethnicity)?.label || form.race_ethnicity}</div>
          </div>
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-3 py-2 w-fit h-fit">
            <div className="text-sm font-bold text-gray-700 mb-1 text-center">Parental Education:</div>
            <div className="text-sm font-semibold text-gray-600 text-center">{EDUCATION_LEVEL_OPTIONS.find(opt => opt.value === form.parental_level_of_education)?.label || form.parental_level_of_education}</div>
          </div>
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-3 py-2 w-fit h-fit">
            <div className="text-sm font-bold text-gray-700 mb-1 text-center">Lunch:</div>
            <div className="text-sm font-semibold text-gray-600 text-center">{LUNCH_OPTIONS.find(opt => opt.value === form.lunch)?.label || form.lunch}</div>
          </div>
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-3 py-2 w-fit h-fit">
            <div className="text-sm font-bold text-gray-700 mb-1 text-center">Test Prep:</div>
            <div className="text-sm font-semibold text-gray-600 text-center">{TEST_PREP_OPTIONS.find(opt => opt.value === form.test_preparation_course)?.label || form.test_preparation_course}</div>
          </div>
          {modelType !== 'all' && getRequiredScores(modelType).map(score => (
            <div key={score} className="flex flex-col items-center bg-white rounded-2xl shadow-md px-3 py-2 w-fit h-fit">
              <div className="text-sm font-bold text-gray-700 mb-1 text-center">{score.replace('_', ' ').replace('score', 'Score').replace(/\b\w/g, l => l.toUpperCase())}:</div>
              <div className="text-sm font-semibold text-gray-600 text-center">{form[score]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    if (modelType === 'all' && result.predictions) {
      return (
        <div className="mb-4 flex justify-center">
          <div className="bg-blue-50 rounded-lg shadow p-4 w-fit mx-auto">
            <h3 className="font-semibold text-gray-700 mb-4 text-lg text-center">Predicted Scores:</h3>
            <div className="flex flex-row justify-center gap-4 flex-wrap w-fit">
              {Object.entries(result.predictions).map(([key, val]) => {
                const label = key.replace('_score', '').toUpperCase();
                return (
                  <div key={key} className="flex flex-col items-center bg-white rounded-2xl shadow-md px-3 py-2 w-fit h-fit">
                    <div className="text-sm font-bold text-gray-700 mb-1 text-center">{label.charAt(0) + label.slice(1).toLowerCase()}:</div>
                    <div className="text-xl font-extrabold text-center" style={{ color: '#0096C7' }}>{Number(val.prediction).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    } else {
      const key = `predicted_${modelType}_score`;
      return (
        <div className="mb-4 flex justify-center">
          <div className="bg-blue-50 rounded-lg shadow p-4 flex flex-col items-center w-fit mx-auto">
            <h3 className="font-semibold text-gray-700 mb-4 text-lg text-center">Predicted Scores:</h3>
            <div className="flex flex-row justify-center gap-4 w-fit">
              <div className="flex flex-col items-center bg-white rounded-2xl shadow-md px-3 py-2 w-fit h-fit">
                <div className="text-sm font-bold text-gray-700 mb-1 text-center">{modelType.charAt(0).toUpperCase() + modelType.slice(1)}:</div>
                <div className="text-xl font-extrabold text-center" style={{ color: '#0096C7' }}>{Number(result[key]).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  // Attribute bullets for explanation
  const attributeBullets = [
    <li key="gender">Gender: {GENDER_OPTIONS.map(o => o.label).join(', ')}</li>,
    <li key="race">Race/Ethnicity: {RACE_ETHNICITY_OPTIONS.map(o => o.label).join(', ')}</li>,
    <li key="parental">Parental Education: {EDUCATION_LEVEL_OPTIONS.map(o => o.label).join(', ')}</li>,
    <li key="lunch">Lunch: {LUNCH_OPTIONS.map(o => o.label).join(', ')}</li>,
    <li key="prep">Test Prep: {TEST_PREP_OPTIONS.map(o => o.label).join(', ')}</li>,
    <li key="scores">Math/Reading/Writing Score: 35-100</li>,
  ];

  return (
    <div className="flex flex-col items-center pt-10 sm:pt-16 px-2">
      <motion.h1
        variants={fadeInUp(0)}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
        exit="exit"
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8 text-center"
      >
        Prediction Simulation
      </motion.h1>
      <motion.div
        variants={fadeInUp(0.2)}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
        exit="exit"
        className="bg-white shadow rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-2xl md:max-w-5xl w-full"
      >
        <motion.h2
          variants={fadeInUp(0.3)}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          exit="exit"
          className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2"
        >
          Test out my Regression Model
        </motion.h2>
        <motion.div
          variants={fadeInUp(0.4)}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          exit="exit"
        >
          <p className="text-sm sm:text-base text-gray-600 mb-3">
            This page allows you to interactively test the machine learning model trained on student performance data. You can choose to predict all three test scores, or just one, using the same features the model was trained on.
          </p>
          <p className="text-sm sm:text-base text-gray-600 mb-3">
            The model uses demographic and educational attributes to make predictions. For single-score predictions, you must provide the other two scores as input, just as the model was trained. For all-score prediction, only demographic and educational features are required.
          </p>
          <div className="mb-1 text-gray-600">Attributes:</div>
          <ul className="list-disc pl-6 text-sm sm:text-base text-gray-600 mb-3">
            <li key="gender"><span className="font-bold">Gender:</span> {GENDER_OPTIONS.map(o => o.label).join(', ')}</li>
            <li key="race"><span className="font-bold">Race/Ethnicity:</span> {RACE_ETHNICITY_OPTIONS.map(o => o.label).join(', ')}</li>
            <li key="parental"><span className="font-bold">Parental Education:</span> {EDUCATION_LEVEL_OPTIONS.map(o => o.label).join(', ')}</li>
            <li key="lunch"><span className="font-bold">Lunch:</span> {LUNCH_OPTIONS.map(o => o.label).join(', ')}</li>
            <li key="prep"><span className="font-bold">Test Prep:</span> {TEST_PREP_OPTIONS.map(o => o.label).join(', ')}</li>
            <li key="scores"><span className="font-bold">Math/Reading/Writing Score:</span> 35-100</li>
          </ul>
          <p className="text-sm sm:text-base text-gray-600 mb-3">
            The model is <span className="font-bold" style={{ color: '#0096C7' }}>95.4% accurate</span> on held-out test data, but predictions may not always be perfect.
          </p>
        </motion.div>
        <motion.form
          variants={fadeInUp(0.5)}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          exit="exit"
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">Which model do you want to use?</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={modelType}
              onChange={handleModelChange}
            >
              <option value="">Select...</option>
              {MODEL_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </motion.form>
        <AnimatePresence>
          {modelType && showForm && !showResult && (
            <motion.form
              key="dynamic-form"
              variants={fadeInUp(0.6)}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4 mt-4"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Gender</label>
                  <select
                    name="gender"
                    className="w-full border rounded px-2 py-1"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {renderOptions(GENDER_OPTIONS)}
                  </select>
                  {errors.gender && <span className="text-red-500 text-xs">{errors.gender}</span>}
                </div>
                <div>
                  <label className="block text-gray-700">Race/Ethnicity</label>
                  <select
                    name="race_ethnicity"
                    className="w-full border rounded px-2 py-1"
                    value={form.race_ethnicity}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {renderOptions(RACE_ETHNICITY_OPTIONS)}
                  </select>
                  {errors.race_ethnicity && <span className="text-red-500 text-xs">{errors.race_ethnicity}</span>}
                </div>
                <div>
                  <label className="block text-gray-700">Parental Level of Education</label>
                  <select
                    name="parental_level_of_education"
                    className="w-full border rounded px-2 py-1"
                    value={form.parental_level_of_education}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {renderOptions(EDUCATION_LEVEL_OPTIONS)}
                  </select>
                  {errors.parental_level_of_education && <span className="text-red-500 text-xs">{errors.parental_level_of_education}</span>}
                </div>
                <div>
                  <label className="block text-gray-700">Lunch</label>
                  <select
                    name="lunch"
                    className="w-full border rounded px-2 py-1"
                    value={form.lunch}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {renderOptions(LUNCH_OPTIONS)}
                  </select>
                  {errors.lunch && <span className="text-red-500 text-xs">{errors.lunch}</span>}
                </div>
                <div>
                  <label className="block text-gray-700">Test Preparation Course</label>
                  <select
                    name="test_preparation_course"
                    className="w-full border rounded px-2 py-1"
                    value={form.test_preparation_course}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {renderOptions(TEST_PREP_OPTIONS)}
                  </select>
                  {errors.test_preparation_course && <span className="text-red-500 text-xs">{errors.test_preparation_course}</span>}
                </div>
                {getRequiredScores(modelType).includes('math_score') && (
                  <div>
                    <label className="block text-gray-700">Math Score</label>
                    <input
                      type="number"
                      name="math_score"
                      className="w-full border rounded px-2 py-1"
                      value={form.math_score}
                      onChange={handleChange}
                      min={SCORE_RANGES.math.min}
                      max={SCORE_RANGES.math.max}
                      placeholder="35-100"
                    />
                    {errors.math_score && <span className="text-red-500 text-xs">{errors.math_score}</span>}
                  </div>
                )}
                {getRequiredScores(modelType).includes('reading_score') && (
                  <div>
                    <label className="block text-gray-700">Reading Score</label>
                    <input
                      type="number"
                      name="reading_score"
                      className="w-full border rounded px-2 py-1"
                      value={form.reading_score}
                      onChange={handleChange}
                      min={SCORE_RANGES.reading.min}
                      max={SCORE_RANGES.reading.max}
                      placeholder="35-100"
                    />
                    {errors.reading_score && <span className="text-red-500 text-xs">{errors.reading_score}</span>}
                  </div>
                )}
                {getRequiredScores(modelType).includes('writing_score') && (
                  <div>
                    <label className="block text-gray-700">Writing Score</label>
                    <input
                      type="number"
                      name="writing_score"
                      className="w-full border rounded px-2 py-1"
                      value={form.writing_score}
                      onChange={handleChange}
                      min={SCORE_RANGES.writing.min}
                      max={SCORE_RANGES.writing.max}
                      placeholder="35-100"
                    />
                    {errors.writing_score && <span className="text-red-500 text-xs">{errors.writing_score}</span>}
                  </div>
                )}
              </div>
              {errors.submit && <div className="text-red-500 text-sm mt-2">{errors.submit}</div>}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded mt-2 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Algorithm is in the works...' : 'Predict'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        {loading && !showResult && (
          <motion.div
            variants={fadeInUp(0.7)}
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
            exit="exit"
            className="flex justify-center items-center py-8"
          >
            <span className="text-blue-600 font-semibold text-lg">Algorithm is in the works...</span>
          </motion.div>
        )}
        <AnimatePresence>
          {showResult && (
            <motion.div
              key="result-section"
              variants={fadeInUp(0.8)}
              initial="visible"
              animate={isLoaded ? 'visible' : 'hidden'}
              exit="exit"
              className="pt-4"
            >
              {renderInputSummary()}
              {renderResult()}
              <div className="flex justify-center">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-8 rounded mt-2 transition-colors"
                  onClick={handleTryAgain}
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Fix payload mapping for all prediction types
const mapPayload = (form, modelType) => {
  // Helper to get numeric or undefined
  const num = (v) => v !== '' && v !== undefined ? Number(v) : undefined;

  if (modelType === 'math') {
    return {
      gender: form.gender,
      'race/ethnicity': form.race_ethnicity,
      'parental level of education': form.parental_level_of_education,
      lunch: form.lunch,
      'test preparation course': form.test_preparation_course,
      'reading score': num(form.reading_score),
      'writing score': num(form.writing_score),
    };
  } else if (modelType === 'reading') {
    return {
      gender: form.gender,
      'race/ethnicity': form.race_ethnicity,
      'parental level of education': form.parental_level_of_education,
      lunch: form.lunch,
      'test preparation course': form.test_preparation_course,
      'math score': num(form.math_score),
      'writing score': num(form.writing_score),
    };
  } else if (modelType === 'writing') {
    return {
      gender: form.gender,
      'race/ethnicity': form.race_ethnicity,
      'parental level of education': form.parental_level_of_education,
      lunch: form.lunch,
      'test preparation course': form.test_preparation_course,
      'math score': num(form.math_score),
      'reading score': num(form.reading_score),
    };
  } else {
    // For 'all' prediction, just send the basic features
    return {
      gender: form.gender,
      'race/ethnicity': form.race_ethnicity,
      'parental level of education': form.parental_level_of_education,
      lunch: form.lunch,
      'test preparation course': form.test_preparation_course,
    };
  }
};

export default Prediction; 