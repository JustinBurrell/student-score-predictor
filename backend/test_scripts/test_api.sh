#!/bin/bash

# Student Score Predictor API Test Script
# API Base URL
BASE_URL="https://student-score-predictor-api.onrender.com"

echo "🧪 Testing Student Score Predictor API"
echo "======================================"

# Test 1: Health Check
echo -e "\n1️⃣ Testing Health Check..."
curl -s -X GET "$BASE_URL/health" | jq '.'

# Test 2: Model Metadata
echo -e "\n2️⃣ Testing Model Metadata..."
curl -s -X GET "$BASE_URL/model/metadata" | jq '.'

# Test 3: Feature Importance
echo -e "\n3️⃣ Testing Feature Importance..."
curl -s -X GET "$BASE_URL/model/feature-importance" | jq '.'

# Test 4: Predict Math Score
echo -e "\n4️⃣ Testing Math Score Prediction..."
curl -s -X POST "$BASE_URL/predict/math" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female",
    "race_ethnicity": "group B",
    "parental_level_of_education": "bachelor degree",
    "lunch": "standard",
    "test_preparation_course": "completed",
    "reading_score": 85,
    "writing_score": 90
  }' | jq '.'

# Test 5: Predict Reading Score
echo -e "\n5️⃣ Testing Reading Score Prediction..."
curl -s -X POST "$BASE_URL/predict/reading" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "male",
    "race_ethnicity": "group A",
    "parental_level_of_education": "some college",
    "lunch": "free/reduced",
    "test_preparation_course": "none",
    "math_score": 75,
    "writing_score": 80
  }' | jq '.'

# Test 6: Predict Writing Score
echo -e "\n6️⃣ Testing Writing Score Prediction..."
curl -s -X POST "$BASE_URL/predict/writing" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female",
    "race_ethnicity": "group C",
    "parental_level_of_education": "high school",
    "lunch": "standard",
    "test_preparation_course": "completed",
    "math_score": 88,
    "reading_score": 92
  }' | jq '.'

# Test 7: Predict All Scores
echo -e "\n7️⃣ Testing All Scores Prediction..."
curl -s -X POST "$BASE_URL/predict/all" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "male",
    "race_ethnicity": "group B",
    "parental_level_of_education": "associate degree",
    "lunch": "standard",
    "test_preparation_course": "none"
  }' | jq '.'

# Test 8: Error Case - Invalid Score Type
echo -e "\n8️⃣ Testing Error Case - Invalid Score Type..."
curl -s -X POST "$BASE_URL/predict/invalid" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "male",
    "race_ethnicity": "group A"
  }' | jq '.'

echo -e "\n✅ API Testing Complete!" 