# 🗓️ 4-Week Project Plan: Student Math Score Predictor

This document outlines a structured 4-week development plan for the full-stack machine learning web application that predicts student math scores using a regression model.

---

## 📅 Week 1: Data Exploration & Model Prototyping

- [ ] Pick a dataset (e.g., housing prices, NBA stats, or Spotify tracks) — selected **Kaggle Student Performance Dataset**
- [ ] Load dataset in a Jupyter notebook
- [ ] Clean using `pandas`: handle null values, encode categorical variables, normalize if needed
- [ ] Perform train-test split
- [ ] Build a regression model using `scikit-learn`
- [ ] Use `.fit()` and `.predict()` to evaluate accuracy or error
- [ ] Save final model as `model.pkl` using `joblib`

---

## 📅 Week 2: Flask/FastAPI Backend

- [ ] Set up Flask (or FastAPI) application with `app.py`
- [ ] Create route: `POST /predict` to receive JSON input and return predictions
- [ ] Load the saved `model.pkl` inside the backend
- [ ] Add CORS support (`Flask-CORS`) to allow access from the frontend
- [ ] Test API locally using Postman or `curl`

---

## 📅 Week 3: React Frontend

- [ ] Initialize frontend with **Vite** or **Create React App**
- [ ] Build user interface:
  - Form with dropdowns and number inputs for user data
  - Button to submit and get prediction
  - Display prediction result
  - Show visualizations (bar chart, pie chart, etc.) using Chart.js or Recharts
- [ ] Connect to backend using `fetch()` or `axios`
- [ ] Style with Tailwind CSS (optional)

---

## 📅 Week 4: Integration, Metrics & Deployment

- [ ] Finalize model evaluation in the backend (e.g., R², RMSE, MAE)
- [ ] Create `/metrics` and `/plots` routes to expose evaluation and visual assets
- [ ] Display these metrics and visuals in the frontend
- [ ] Deploy backend to **Render.com**
- [ ] Deploy frontend to **Vercel**
- [ ] Add README.md file
- [ ] Record and upload demo walkthrough (video or screenshots)

---

This plan assumes ~5–10 hours of work per week and can be adjusted for a faster or slower pace depending on availability and project complexity.
