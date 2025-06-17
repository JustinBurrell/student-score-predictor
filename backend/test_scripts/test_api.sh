#!/bin/bash

# Student Score Predictor API Test Script
# API Base URL - Production server on Render
BASE_URL="https://student-score-predictor-api.onrender.com"

echo "🧪 Testing Student Score Predictor API (Production)"
echo "=================================================="
echo "📍 Testing against: $BASE_URL"
echo ""

# Function to test endpoint with error handling
test_endpoint() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    
    echo -e "\n$test_name..."
    echo "----------------------------------------"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all but last line)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "200" ]; then
        echo "✅ Success (HTTP $status_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo "❌ Failed (HTTP $status_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
}

# Test 1: Health Check
test_endpoint "1️⃣ Testing Health Check" "GET" "/health" ""

# Test 2: Model Metadata
test_endpoint "2️⃣ Testing Model Metadata" "GET" "/model/metadata" ""

# Test 3: Feature Importance (Math)
test_endpoint "3️⃣ Testing Feature Importance (Math)" "GET" "/model/feature-importance?score_type=math" ""

# Test 4: Predict Math Score
test_endpoint "4️⃣ Testing Math Score Prediction" "POST" "/predict/math" '{
    "gender": "female",
    "race/ethnicity": "group A",
    "parental level of education": "bachelors degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "reading score": 70,
    "writing score": 75
}'

# Test 5: Predict Reading Score
test_endpoint "5️⃣ Testing Reading Score Prediction" "POST" "/predict/reading" '{
    "gender": "female",
    "race/ethnicity": "group A",
    "parental level of education": "bachelors degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "math score": 65,
    "writing score": 75
}'

# Test 6: Predict Writing Score
test_endpoint "6️⃣ Testing Writing Score Prediction" "POST" "/predict/writing" '{
    "gender": "female",
    "race/ethnicity": "group A",
    "parental level of education": "bachelors degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "math score": 65,
    "reading score": 70
}'

# Test 7: Predict All Scores (without existing scores)
test_endpoint "7️⃣ Testing All Scores Prediction (Initial)" "POST" "/predict/all" '{
    "gender": "female",
    "race/ethnicity": "group A",
    "parental level of education": "bachelors degree",
    "lunch": "standard",
    "test preparation course": "completed"
}'

# Test 8: Predict All Scores (with existing scores)
test_endpoint "8️⃣ Testing All Scores Prediction (With Scores)" "POST" "/predict/all" '{
    "gender": "male",
    "race/ethnicity": "group B",
    "parental level of education": "associates degree",
    "lunch": "free/reduced",
    "test preparation course": "none",
    "math score": 75,
    "reading score": 80,
    "writing score": 78
}'

# Test 9: Error Case - Invalid Score Type
test_endpoint "9️⃣ Testing Error Case - Invalid Score Type" "POST" "/predict/invalid" '{
    "gender": "male",
    "race/ethnicity": "group A",
    "parental level of education": "high school",
    "lunch": "standard",
    "test preparation course": "none"
}'

# Test 10: List Available Plots
test_endpoint "🔟 Testing List Available Plots" "GET" "/api/plots" ""

echo -e "\n" 
echo "=================================================="
echo "✅ Production API Testing Complete!" 