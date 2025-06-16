# Math Score Predictor Backend

A Flask-based machine learning service that predicts student math scores based on academic and demographic features.

## Project Structure

```
backend/
├── model/
│   ├── predictor.py          # ML model training and prediction
│   └── saved_models/         # Directory for saved model files
├── utils/
│   └── data_processor.py     # Data preprocessing pipeline
├── app.py                    # Flask application and API endpoints
├── requirements.txt          # Python dependencies
└── README.md                # This file
```

## Technical Overview

### Machine Learning Pipeline

1. **Data Processing** (`data_processor.py`)
   - Feature scaling (MinMaxScaler)
   - One-hot encoding for categorical variables
   - Ordinal encoding for education levels
   - Feature engineering:
     - Average reading/writing scores
     - Test preparation & education interaction

2. **Model** (`predictor.py`)
   - Algorithm: Random Forest Regressor
   - Training/Test split: 80/20
   - Model persistence using joblib
   - Automatic model loading/saving

### API Endpoints

1. **Health Check**
   ```
   GET /health
   Response: {"status": "healthy", "message": "Service is running"}
   ```

2. **Predict Math Score**
   ```
   POST /predict
   Content-Type: application/json
   
   Request Body:
   {
       "gender": "female",
       "race/ethnicity": "group C",
       "parental level of education": "bachelor's degree",
       "lunch": "standard",
       "test preparation course": "completed",
       "reading score": 75,
       "writing score": 80
   }
   
   Response:
   {
       "success": true,
       "predicted_math_score": 64.05,
       "input_features": {...}
   }
   ```

3. **Retrain Model**
   ```
   POST /model/retrain
   Response: {"success": true, "message": "Model retrained successfully"}
   ```

## Setup Instructions

1. **Environment Setup**
   ```bash
   # Create and activate virtual environment
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

2. **Initial Model Training**
   ```bash
   # Start the Flask server
   python app.py
   
   # In a new terminal (with venv activated)
   curl -X POST http://localhost:5001/model/retrain
   ```

3. **Making Predictions**
   ```bash
   curl -X POST http://localhost:5001/predict \
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

## Implementation Details

### Data Processing Pipeline

1. **Numerical Features**
   - Reading and writing scores are scaled to 0-1 range
   - Average score is calculated and scaled separately
   - Scaling parameters are preserved for future predictions

2. **Categorical Features**
   - Gender: One-hot encoded (female/male)
   - Race/ethnicity: One-hot encoded (groups A-E)
   - Lunch type: One-hot encoded (standard/free/reduced)
   - Test preparation: One-hot encoded (none/completed)
   - Parental education: Ordinal encoded (6 levels)

3. **Feature Engineering**
   - `avg_reading_writing_scaled`: Combined academic performance metric
   - `prep_education_interaction`: Captures how test prep impact varies with education level

### Model Training Process

1. **Data Preparation**
   - Loads raw data from CSV
   - Applies full preprocessing pipeline
   - Splits into training (80%) and testing (20%) sets

2. **Model Training**
   - Uses RandomForestRegressor for robust predictions
   - Handles both numerical and categorical features
   - Automatically saves model to disk after training

3. **Model Persistence**
   - Trained model saved to `model/saved_models/`
   - Automatically loaded on service startup
   - Can be retrained via API endpoint

### Error Handling

- Input validation for all API endpoints
- Graceful handling of preprocessing errors
- Informative error messages for debugging
- Automatic model initialization if not found

## Development Notes

- Port 5001 used to avoid conflicts with macOS AirPlay
- All preprocessing parameters are fit only during training
- Model files are automatically versioned and saved
- Feature engineering matches exploration notebook analysis

## Future Improvements

1. Model enhancements:
   - Hyperparameter tuning
   - Model performance metrics API
   - Support for different ML algorithms

2. API features:
   - Batch prediction endpoint
   - Model version management
   - Performance monitoring

3. Data handling:
   - Input validation schema
   - Support for missing values
   - Feature importance analysis

## Model Information

The service uses a Random Forest Regressor to predict math scores based on:
- Student demographics (gender, race/ethnicity)
- Educational background (parental education, lunch type)
- Test preparation status
- Reading and writing scores

Features are preprocessed according to the analysis in `notebooks/01_data_exploration.ipynb`. 