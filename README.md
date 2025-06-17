# Student Score Predictor

This project is a full-stack machine learning web application that predicts a student's **test scores** based on demographic and educational information. It combines a **Flask backend** serving a trained regression model, a **React frontend** for interaction and visualization, and a modular project structure that integrates Jupyter notebooks and data files for development and reproducibility.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Data](#data)
- [Dataset and Model](#dataset-and-model)
- [Backend](#backend)
- [Frontend](#frontend)
- [Data Analysis](#data-analysis)
- [How the App Works](#how-the-app-works)
- [Demo](#demo)
- [Contact](#contact)

---

## Project Overview

Built using the **Kaggle "Students Performance in Exams" dataset**, this app allows users to explore model performance and dataset trends, and interactively test the trained machine learning model by inputting their own data. The goal is to demonstrate a complete machine learning pipeline — from data cleaning and modeling to API serving and frontend deployment.

---

## Technologies Used

| Layer        | Tools & Frameworks                        |
|--------------|-------------------------------------------|
| Frontend     | React.js, Framer Motion, Tailwind CSS, Chart.js/Recharts |
| Backend      | Flask, Flask-CORS, scikit-learn, pandas   |
| ML Modeling  | Jupyter Notebook, matplotlib, seaborn     |
| Deployment   | Vercel (frontend), Render (backend)       |
| Version Ctrl | Git, GitHub                               |

---

## Data

- [StudentsPerformance.csv](data/StudentsPerformance.csv) — Raw dataset
- [StudentsPerformance_cleaned.csv](data/StudentsPerformance_cleaned.csv) — Cleaned and preprocessed dataset

_Data source: [Kaggle - Students Performance in Exams](https://www.kaggle.com/datasets/spscientist/students-performance-in-exams)_

---

## Dataset and Model

**Features:**
- `gender`
- `race/ethnicity`
- `parental level of education`
- `lunch` (standard or free/reduced)
- `test preparation course`
- `math score`
- `reading score`
- `writing score`

**Data Cleaning & Preprocessing:**
- Loaded the raw dataset and inspected for missing or inconsistent values.
- Cleaned the data by:
  - Handling missing values (if any) and correcting data types.
  - Encoding categorical variables (e.g., gender, race/ethnicity) for use in ML models.
  - Engineering new features (e.g., score differences, polynomial features, interaction terms) to improve model performance.
- Split the data into training and testing sets (typically 80/20 split) to evaluate model generalization.

**Modeling Process:**
- Trained regression models (e.g., RandomForestRegressor from scikit-learn) to predict math, reading, and writing scores.
- Used `pandas` for data manipulation and `matplotlib`/`seaborn` for exploratory data analysis and visualization.
- Evaluated model performance using the R² (coefficient of determination) metric, which measures the proportion of variance in the target explained by the model.
- Performed cross-validation (e.g., 5-fold CV) to ensure robust performance estimates and avoid overfitting.
- Saved the trained model for serving via the Flask API.

**Model Performance Results:**

The project demonstrates the significant impact of feature engineering and data modeling through two model variants:

### **Full Models (with score features and advanced engineering):**
- **Math Score Model**: 93.7% R² accuracy
- **Reading Score Model**: 95.2% R² accuracy  
- **Writing Score Model**: 97.4% R² accuracy
- **Average Performance**: 95.4% R² accuracy

### **Initial Models (without score features):**
- **Math Score Model**: 35.6% R² accuracy
- **Reading Score Model**: 33.2% R² accuracy
- **Writing Score Model**: 41.7% R² accuracy
- **Average Performance**: 36.8% R² accuracy

### **Performance Improvement:**
- **Average improvement**: +58.6 percentage points
- **Best performing model**: Writing scores (97.4% accuracy)
- **Most improved**: Reading scores (+62.0 percentage points)

**How the Performance Was Achieved:**
- **Feature Engineering**: Created polynomial features from other test scores, interaction terms, and derived features
- **Advanced Preprocessing**: Implemented MinMax scaling for score features and polynomial transformations
- **Hyperparameter Tuning**: Used GridSearchCV to optimize RandomForest parameters
- **Cross-Validation**: 5-fold CV ensures robust performance estimates
- **Model Ensemble**: Leveraged RandomForest's ensemble nature for better generalization

**Value of Data Modeling Process:**
This dramatic performance improvement (36.8% → 95.4%) demonstrates several key principles of effective machine learning:

1. **Feature Engineering is Critical**: The addition of engineered features (polynomial terms, score interactions) more than doubled model performance
2. **Domain Knowledge Matters**: Understanding that test scores are correlated allowed us to create meaningful features
3. **Iterative Improvement**: Starting with basic models and systematically improving through feature engineering and hyperparameter tuning
4. **Validation Strategy**: Cross-validation ensures performance estimates are reliable and not due to overfitting
5. **Model Interpretability**: RandomForest provides feature importance, making the model explainable

**How the 95.4% "Accuracy" Was Determined:**
- After training, the model was evaluated on a held-out test set (data not seen during training).
- The R² score was calculated using scikit-learn's `r2_score` function:
  ```python
  from sklearn.metrics import r2_score
  r2 = r2_score(y_test, y_pred)
  print(f'R² (test set): {r2:.2f}')  # e.g., 0.954
  ```
- An R² of 0.954 means the model explains 95.4% of the variance in the test scores.
- Cross-validation was also used to average R² across multiple splits for a more reliable estimate.

**Model Pipeline:**
- Data preprocessing with `pandas`
- Exploratory analysis and visualization with `matplotlib`/`seaborn`
- Model training and validation with `scikit-learn` (RandomForestRegressor, etc.)
- Model evaluation (R², RMSE, MAE, etc.)
- Model serialization and serving via Flask API

---

## Backend

- [Backend README](backend/README.md)
- Flask REST API for predictions, model metadata, feature importance, and more
- Machine learning models with advanced feature engineering and confidence intervals
- Automated test suite and troubleshooting scripts

---

## Frontend

- [Frontend README](frontend/README.md)
- React single-page app for predictions and analysis
- Interactive forms, data visualizations, and error handling
- Environment variable support for local and production API URLs

---

## Data Analysis

- [Data Analysis Notebook](notebooks/dataanalysis.ipynb)
- Exploratory data analysis (EDA), feature engineering, and insights
- Visualizations and statistical summaries

---

## How the App Works

Once deployed, the app allows users to:

1. **Understand the Dataset**
   - View visual summaries of score distributions and key relationships
   - Read explanations of how each feature contributes to prediction

2. **See the Model in Action**
   - **View detailed model performance metrics** in the Analysis page, including:
     - R² scores, MAE, RMSE, and cross-validation scores for each model
     - Comparison between full models (with score features) vs initial models (without score features)
     - Performance improvement statistics showing the value of feature engineering
   - Explore evaluation metrics like R², RMSE, and MAE
   - View regression plots such as actual vs. predicted scores or residuals

3. **Test the Model with New Data**
   - Fill out a form with student demographic and preparation details
   - Submit the form to generate a real-time prediction
   - Display the predicted math, reading, or writing score and compare it against averages

All data visualizations and metrics are displayed dynamically from the model training process and are accessible via backend API routes. The **Analysis page** provides a comprehensive view of both model performance metrics and data analysis visualizations, allowing users to understand both the technical performance and the underlying data patterns.

---

## Demo

### Screenshots

#### Home Page
![Home Page](docs/demo/Home%20Page.png)

#### Prediction Form & Result
![Prediction Visual](docs/demo/Prediction%20Visual.png)

#### Data Analysis
![Data Analysis](docs/demo/Data%20Analysis.png)

#### Model Performance Metrics
![Performance Metrics](docs/demo/Performance%20Metrics.png)

#### Detailed About Page
![About Page](docs/demo/About%20Page.png)

### Video Demo

[![Watch the demo](docs/demo/Home%20Page.png)]()

_See the video above for a full walkthrough of the app's features and user experience._

---

## Contact

- **Email:** justinburrell715@gmail.com
- **LinkedIn:** [linkedin.com/in/thejustinburrell](https://linkedin.com/in/thejustinburrell)

---