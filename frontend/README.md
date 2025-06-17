# Student Score Predictor Frontend

This is the React frontend for the Student Score Predictor project. It connects to a Flask backend API to provide interactive predictions and data analysis visualizations.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)
- [Additional Documentation](#additional-documentation)
- [Useful Scripts](#useful-scripts)
- [Notes](#notes)

---

## Project Overview

This frontend provides a modern, interactive user interface for the Student Score Predictor application. Users can input student data, receive real-time predictions, and explore data analysis visualizations. The app is designed for seamless integration with the Flask backend and supports both local and production deployments.

---

## Technologies Used

| Layer     | Tools & Frameworks                        |
|-----------|-------------------------------------------|
| Frontend  | React.js, Framer Motion, Tailwind CSS, Chart.js/Recharts |
| Styling   | Tailwind CSS, custom CSS                  |
| Animation | Framer Motion                             |
| Charts    | Recharts                                  |
| Deployment| Vercel                                    |
| Version Ctrl | Git, GitHub                            |

---

## Features
- Responsive, single-page React application
- Interactive prediction form for student scores
- Dynamic data visualizations and analysis plots
- API health check and error handling
- Environment variable support for API URL configuration
- Modern UI/UX with Tailwind CSS and Framer Motion

---

## 🚀 Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API URL:**
   - Create a file called `.env` in the `frontend/` directory (do not commit this file).
   - Add this line:
     ```
     REACT_APP_API_URL=http://localhost:5001
     ```
   - This tells the frontend to use your local backend during development.

3. **Start the development server:**
   ```bash
   npm start
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment

- The API URL is set using the `REACT_APP_API_URL` environment variable in your deployment platform (e.g., Vercel, Netlify).
- Example for Vercel:
  - Key: `REACT_APP_API_URL`
  - Value: `https://student-score-predictor-api.onrender.com`
- The frontend will automatically use this value in production.

---

## 🛠️ Troubleshooting

- **API errors or CORS issues:**
  - Make sure your `.env` is set correctly for local dev.
  - For production, ensure the backend allows your frontend domain in its CORS settings.
- **Plots not loading:**
  - Check the browser console and network tab for failed requests.
  - Make sure the backend `/api/plots` endpoint is working and returns valid URLs.
- **Environment variable changes not taking effect:**
  - Restart the dev server after editing `.env`.
- **Testing against production backend:**
  - Temporarily set `REACT_APP_API_URL` in `.env` to the production backend URL.

---

## 🧪 Testing

- **Run React tests:**
  ```bash
  npm test
  ```
- **Manual testing:**
  - Use the UI to submit predictions and view analysis plots.
  - Check the browser console for errors.
- **API health check:**
  - The frontend checks backend health on startup. If the backend is down, you'll see an error message.

---

## 📚 Additional Documentation

- For backend troubleshooting, deployment, and advanced testing, see the backend documentation and supplemental markdown files in the `backend/` directory.
- For full-stack setup, see the project root `README.md`.

---

## ⚡ Useful Scripts

- `npm start` — Start the dev server
- `npm run build` — Build for production
- `npm test` — Run tests

---

## 📝 Notes

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- For advanced configuration, see the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
