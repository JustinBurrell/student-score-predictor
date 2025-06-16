# Math Score Predictor Backend

A Flask-based machine learning service that predicts student academic scores using Random Forest models with advanced feature engineering, confidence intervals, and model interpretability features.

## Machine Learning Implementation

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
    "parental level of education": "bachelor'\''s degree",
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
    "parental level of education": "bachelor'\''s degree",
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

## Performance Optimizations

1. **Prediction Caching**:
   - LRU cache for frequent prediction patterns
   - Cache size: 1000 entries
   - Automatic cache invalidation on model retraining
   - Average response time: 0.419 seconds under load

2. **Feature Importance Analysis**:
   - Separate tracking for initial and full models
   - Detailed importance rankings for all features
   - Interaction terms analysis
   - Real-time feature importance endpoint

3. **Confidence Intervals**:
   - 95% confidence bounds for all predictions
   - Based on Random Forest tree variance
   - Adjusted for score constraints and correlations

## Testing Suite

1. **Edge Case Testing**:
   - Extreme value combinations (0-100 score ranges)
   - Unusual feature combinations (e.g., high education with free lunch)
   - Score correlation constraints
   - Boundary condition handling

2. **Load Testing**:
   - Concurrent request handling (50+ simultaneous requests)
   - Response time metrics:
     - Average: 0.419 seconds
     - Maximum: 0.594 seconds
     - Minimum: 0.262 seconds
   - Memory usage monitoring
   - Cache performance tracking

3. **Integration Testing**:
   - API endpoint validation
   - Data preprocessing verification
   - Model prediction consistency
   - Error handling and recovery
   - Cross-score prediction validation 