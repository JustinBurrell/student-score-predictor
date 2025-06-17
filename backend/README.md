# Student Score Predictor Backend

A Flask-based machine learning service that predicts student academic scores using Random Forest models with advanced feature engineering, confidence intervals, and model interpretability features.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Machine Learning Implementation](#machine-learning-implementation)
- [Deployment Setup](#deployment-setup)
- [API Endpoints](#api-endpoints)
- [Input Features](#input-features)
- [Testing & Troubleshooting](#testing--troubleshooting)

---

## Project Overview

This backend provides a robust REST API for predicting student math, reading, and writing scores based on demographic and educational features. It is designed for integration with a modern React frontend and supports advanced ML features, model retraining, and interpretability.

---

## Technologies Used

| Layer        | Tools & Frameworks                        |
|--------------|-------------------------------------------|
| Backend      | Flask, Flask-CORS, scikit-learn, pandas   |
| ML Modeling  | Jupyter Notebook, matplotlib, seaborn     |
| Deployment   | Render                                    |
| Version Ctrl | Git, GitHub                               |

---

## Features
- REST API for predictions, model metadata, and feature importance
- Three separate Random Forest models (math, reading, writing)
- Confidence intervals for predictions
- Model retraining endpoint
- Automated test suite and troubleshooting scripts
- CORS support for secure frontend-backend integration

---

## 📦 Machine Learning Implementation

### Model Architecture
- **Algorithm**: Random Forest Regressor with optimized hyperparameters
- **Models**: Three separate models for predicting math, reading, and writing scores
- **Cross-Validation**: 5-fold CV for robust performance estimation
- **Feature Engineering**:
  - Polynomial features for score relationships
  - Score differences and ratios
  - Educational and demographic interaction terms
- **Uncertainty Quantification**: 95% confidence intervals using tree variance
- **Model Versioning**: Semantic versioning (current: 1.0.0)
- **Performance Tracking**: Automated metrics collection and storage

### Model Training
- **Script:** `train_models.py` — Run this script to retrain all models or individual models with updated data or parameters.
- **Usage:**
  ```bash
  cd backend
  source ../.venv/bin/activate
  python train_models.py
  ```
- See the script for options and documentation.

---

## 🚀 Deployment Setup

### Local Development
1. Create virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Unix
   .venv\Scripts\activate     # Windows
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python app.py
   ```
   Server will start on port 5001 (http://localhost:5001)

### Production Deployment
- Set environment variables for CORS and API base URL in your deployment platform (e.g., Render):
  - `CORS_ORIGINS` — Comma-separated list of allowed frontend origins (e.g., your Vercel frontend URL)
  - `API_BASE_URL` — The public URL of your backend API
- For troubleshooting deployment, see [backend_troubleshooting.md](test_scripts/backend_troubleshooting.md)
- For advanced testing and CI/CD, see [testingdocumentation.md](test_scripts/testingdocumentation.md)

---

## API Endpoints

### 1. Health Check
```bash
curl http://localhost:5001/health
```
Response:
```json
{
    "status": "healthy",
    "message": "Service is running",
    "model_version": "1.0.0"
}
```

### 2. Model Metadata
```bash
curl http://localhost:5001/model/metadata
```
Response includes:
- Model version
- Last training date
- Training dataset size
- Performance metrics for all models
- Feature importance rankings

### 3. Feature Importance
```bash
# Get all feature importance
curl http://localhost:5001/model/feature-importance

# Get feature importance for specific score type
curl "http://localhost:5001/model/feature-importance?score_type=math"
```

### 4. Predict Individual Score
```bash
# Predict Math Score
curl -X POST http://localhost:5001/predict/math \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female",
    "race/ethnicity": "group C",
    "parental level of education": "bachelor's degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "reading score": 75,
    "writing score": 80
  }'
```
Response includes:
```json
{
    "success": true,
    "predicted_math_score": 70.5,
    "confidence_interval": {
        "lower": 65.2,
        "upper": 75.8
    },
    "input_features": { ... }
}
```

### 5. Predict All Scores
```bash
curl -X POST http://localhost:5001/predict/all \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female",
    "race/ethnicity": "group C",
    "parental level of education": "bachelor's degree",
    "lunch": "standard",
    "test preparation course": "completed"
  }'
```
Response includes predictions and confidence intervals for all scores.

### 6. Retrain Models
```bash
# Retrain all models
curl -X POST http://localhost:5001/model/retrain

# Retrain specific model
curl -X POST "http://localhost:5001/model/retrain?score_type=math"
```

---

## Input Features

1. **Categorical Features**:
   - `gender`: "female" or "male"
   - `race/ethnicity`: "group A" through "group E"
   - `parental level of education`: ["some high school", "high school", "some college", "associate's degree", "bachelor's degree", "master's degree"]
   - `lunch`: "standard" or "free/reduced"
   - `test preparation course`: "completed" or "none"

2. **Numerical Features**:
   - `math score`: 0-100
   - `reading score`: 0-100
   - `writing score`: 0-100

---

## 🧪 Testing & Troubleshooting

- **Testing:**
  - See [testingdocumentation.md](test_scripts/testingdocumentation.md) for a full guide to running, customizing, and interpreting backend tests.
  - Use `run_tests.sh` for comprehensive test runs, including local and production API checks.
- **Troubleshooting:**
  - See [backend_troubleshooting.md](test_scripts/backend_troubleshooting.md) for virtual environment issues, deployment errors, and recovery workflows.
  - Includes quick commands, common error explanations, and advanced recovery steps.