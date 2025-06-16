# Math Score Predictor Backend

This is the backend service for the Math Score Predictor application. It provides a Flask API for making predictions and managing the ML model.

## Project Structure

```
backend/
├── model/
│   ├── predictor.py        # ML model class
│   └── saved_models/       # Directory for saved model files
├── utils/
│   └── data_processor.py   # Data preprocessing utilities
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns service status

### Predict Math Score
- **POST** `/predict`
- Input: JSON with student features
- Returns predicted math score

Example input:
```json
{
    "gender": "female",
    "race/ethnicity": "group C",
    "parental level of education": "bachelor's degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "reading score": 75,
    "writing score": 80
}
```

### Retrain Model
- **POST** `/model/retrain`
- Retrains the model using latest data
- Returns training metrics

## Model Information

The service uses a Random Forest Regressor to predict math scores based on:
- Student demographics (gender, race/ethnicity)
- Educational background (parental education, lunch type)
- Test preparation status
- Reading and writing scores

Features are preprocessed according to the analysis in `notebooks/01_data_exploration.ipynb`. 