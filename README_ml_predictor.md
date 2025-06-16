# 📈 Student Math Score Predictor – Full Stack ML Web App

This project is a full-stack machine learning web application that predicts a student’s **math score** based on demographic and educational information. It combines a **Flask backend** serving a trained regression model, a **React frontend** for interaction and visualization, and a modular project structure that integrates Jupyter notebooks and data files for development and reproducibility.

---

## 🧠 Overview

Built using the **Kaggle “Students Performance in Exams” dataset**, this app allows users to explore model performance and dataset trends, and interactively test the trained machine learning model by inputting their own data. The goal is to demonstrate a complete machine learning pipeline — from data cleaning and modeling to API serving and frontend deployment.

---

## 🧾 Dataset and Model

The dataset includes the following features:
- `gender`
- `race/ethnicity`
- `parental level of education`
- `lunch` (standard or free/reduced)
- `test preparation course`
- `math score` (target)
- `reading score`
- `writing score`

Using this data, a **regression model** is built using `scikit-learn` (e.g., `LinearRegression`, `RandomForestRegressor`) to predict the `math score`. The model is trained and evaluated in a Jupyter notebook using:
- `pandas` for data preprocessing
- `matplotlib`/`seaborn` for visualizations
- `scikit-learn` for training, validation, and saving the model as `model.pkl`

---

## ⚙️ Backend (Flask API)

The **Flask backend** is responsible for:
- Loading the trained model from disk
- Exposing a `/predict` endpoint to accept new data and return predictions
- Providing additional routes like:
  - `/metrics`: returns model evaluation metrics (R², RMSE, MAE, etc.)
  - `/plots`: serves static or generated visualizations from training

The backend also uses `Flask-CORS` to enable access from the React frontend.

---

## 🌐 Frontend (React App)

The **React frontend** allows users to:
1. **Explore model performance**:
   - View charts and graphs showing insights into the data and model (e.g., score distribution, feature correlations, residual plots)
2. **Understand how the model works**:
   - Read brief descriptions of how features relate to outcomes
   - View regression visualizations and evaluation metrics
3. **Input data to test the model**:
   - Fill out a form with student information
   - Submit to the backend to receive a predicted math score
   - View prediction results on the screen

The frontend is styled using `Tailwind CSS`, `Framer Motion`, and uses libraries like `Chart.js` or `Recharts` for dynamic, responsive data visualizations.

---

## 🗂️ Project Structure

Project folder structure:
- `backend/` – Flask backend (API logic, model, utils)
- `frontend/` – React frontend (UI components, pages)
- `notebooks/` – Jupyter notebooks for EDA and model training
- `data/` – Raw and cleaned datasets

---

## 🚀 How the App Works

Once deployed, the app allows users to:

1. **Understand the Dataset**
   - View visual summaries of score distributions and key relationships
   - Read explanations of how each feature contributes to prediction

2. **See the Model in Action**
   - Explore evaluation metrics like R², RMSE, and MAE
   - View regression plots such as actual vs. predicted scores or residuals

3. **Test the Model with New Data**
   - Fill out a form with student demographic and preparation details
   - Submit the form to generate a real-time prediction
   - Display the predicted math score and compare it against averages

All data visualizations and metrics are displayed dynamically from the model training process and are accessible via backend API routes.

---

## 🧪 Technologies Used

| Layer        | Tools & Frameworks                        |
|--------------|-------------------------------------------|
| Frontend     | React.js, Framer Motion, Tailwind CSS, Chart.js/Recharts |
| Backend      | Flask, Flask-CORS, scikit-learn, pandas   |
| ML Modeling  | Jupyter Notebook, matplotlib, seaborn     |
| Deployment   | Vercel (frontend), Render (backend)       |
| Version Ctrl | Git, GitHub                               |

---

## 📦 Deployment Plan

- Frontend: Deploy `/frontend` folder to **Vercel**
- Backend: Deploy `/backend` to **Render**
- Connect via `/predict`, `/metrics`, and `/plots` endpoints
