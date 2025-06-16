# Math Score Predictor Backend

A Flask-based machine learning service that predicts student academic scores using Random Forest models with advanced feature engineering.

## Machine Learning Implementation

### Model Architecture
- **Algorithm**: Random Forest Regressor with optimized hyperparameters
- **Models**: Three separate models for predicting math, reading, and writing scores
- **Cross-Validation**: 5-fold CV for robust performance estimation
- **Feature Engineering**:
  - Polynomial features for score relationships
  - Score differences and ratios
  - Educational and demographic interaction terms

### Model Performance

1. **Writing Score Model**
   - Accuracy: 92.9% (±0.66%)
   - Key Features:
     - Reading score and polynomials (32%)
     - Math score and polynomials (20%)
     - Average scores (7.9%)
   - Best Parameters:
     ```python
     {
         'max_depth': 20,
         'max_features': 'sqrt',
         'min_samples_leaf': 2,
         'min_samples_split': 5,
         'n_estimators': 300
     }
     ```

2. **Reading Score Model**
   - Accuracy: 91.3% (±0.70%)
   - Key Features:
     - Writing score relationships (74.7%)
     - Score polynomials (21%)
   - Best Parameters:
     ```python
     {
         'max_depth': 10,
         'max_features': null,
         'min_samples_leaf': 4,
         'min_samples_split': 10,
         'n_estimators': 300
     }
     ```

3. **Math Score Model**
   - Accuracy: 84.0% (±1.96%)
   - Key Features:
     - Reading/writing polynomials (54%)
     - Gender (12%)
     - Raw scores (5%)
   - Best Parameters:
     ```python
     {
         'max_depth': 10,
         'max_features': null,
         'min_samples_leaf': 2,
         'min_samples_split': 2,
         'n_estimators': 300
     }
     ```

### Key Findings
1. Writing and reading scores show strong interdependence
2. Math scores are more influenced by demographic factors
3. Test preparation impact varies by subject
4. Polynomial features significantly improve prediction accuracy
5. Gender has more impact on math scores than other subjects

## API Endpoints

### 1. Health Check
```bash
curl http://localhost:5001/health
```
Response:
```json
{
    "status": "healthy",
    "message": "Service is running"
}
```

### 2. Predict Individual Score
```bash
# Predict Math Score
curl -X POST http://localhost:5001/predict/math \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female",
    "race/ethnicity": "group C",
    "parental level of education": "bachelor'\''s degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "reading score": 75,
    "writing score": 80
  }'

# Predict Reading Score
curl -X POST http://localhost:5001/predict/reading \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female",
    "race/ethnicity": "group C",
    "parental level of education": "bachelor'\''s degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "math score": 82,
    "writing score": 78
  }'

# Predict Writing Score
curl -X POST http://localhost:5001/predict/writing \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female",
    "race/ethnicity": "group C",
    "parental level of education": "bachelor'\''s degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "math score": 82,
    "reading score": 75
  }'
```

### 3. Predict All Scores
```bash
curl -X POST http://localhost:5001/predict/all \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female",
    "race/ethnicity": "group C",
    "parental level of education": "bachelor'\''s degree",
    "lunch": "standard",
    "test preparation course": "completed"
  }'
```

### 4. Retrain Models
```bash
# Retrain all models
curl -X POST http://localhost:5001/model/retrain

# Retrain specific model
curl -X POST "http://localhost:5001/model/retrain?score_type=math"
```

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

## Development Setup

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