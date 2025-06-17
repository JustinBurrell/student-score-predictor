#!/bin/bash

# Student Score Predictor Backend Local Test Script
# API Base URL - Local development server
BASE_URL="http://localhost:5001"

echo "🧪 Testing Student Score Predictor Backend (Local)"
echo "================================================="
echo "📍 Testing against: $BASE_URL"
echo ""

# Check if the server is running
echo "🔍 Checking if server is running..."
if curl -s "$BASE_URL/health" > /dev/null 2>&1; then
    echo "✅ Server is running and responding"
else
    echo "❌ Server is not running or not accessible"
    echo "   Please start the server with: cd backend && python app.py"
    exit 1
fi

# Function to test endpoint with error handling
test_endpoint() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="${5:-200}"  # Default to 200, but allow custom expected status
    
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
    
    if [ "$status_code" = "$expected_status" ]; then
        echo "✅ Success (HTTP $status_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo "❌ Failed (Expected HTTP $expected_status, got $status_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
}

# Test 1: Health Check
test_endpoint "1️⃣ Testing Health Check" "GET" "/health" ""

# Test 2: Model Metadata
test_endpoint "2️⃣ Testing Model Metadata" "GET" "/model/metadata" ""

# Test 2.5: Model Metrics (New endpoint)
test_endpoint "2️⃣5️⃣ Testing Model Metrics" "GET" "/metrics" ""

# Test 3: Feature Importance (Math)
test_endpoint "3️⃣ Testing Feature Importance (Math)" "GET" "/model/feature-importance?score_type=math" ""

# Test 4: Feature Importance (Reading)
test_endpoint "4️⃣ Testing Feature Importance (Reading)" "GET" "/model/feature-importance?score_type=reading" ""

# Test 5: Feature Importance (Writing)
test_endpoint "5️⃣ Testing Feature Importance (Writing)" "GET" "/model/feature-importance?score_type=writing" ""

# Test 6: Predict Math Score
test_endpoint "6️⃣ Testing Math Score Prediction" "POST" "/predict/math" '{
    "gender": "female",
    "race/ethnicity": "group A",
    "parental level of education": "bachelors degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "reading score": 70,
    "writing score": 75
}'

# Test 7: Predict Reading Score
test_endpoint "7️⃣ Testing Reading Score Prediction" "POST" "/predict/reading" '{
    "gender": "female",
    "race/ethnicity": "group A",
    "parental level of education": "bachelors degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "math score": 65,
    "writing score": 75
}'

# Test 8: Predict Writing Score
test_endpoint "8️⃣ Testing Writing Score Prediction" "POST" "/predict/writing" '{
    "gender": "female",
    "race/ethnicity": "group A",
    "parental level of education": "bachelors degree",
    "lunch": "standard",
    "test preparation course": "completed",
    "math score": 65,
    "reading score": 70
}'

# Test 9: Predict All Scores (without existing scores)
test_endpoint "9️⃣ Testing All Scores Prediction (Initial)" "POST" "/predict/all" '{
    "gender": "female",
    "race/ethnicity": "group A",
    "parental level of education": "bachelors degree",
    "lunch": "standard",
    "test preparation course": "completed"
}'

# Test 10: Predict All Scores (with existing scores)
test_endpoint "🔟 Testing All Scores Prediction (With Scores)" "POST" "/predict/all" '{
    "gender": "male",
    "race/ethnicity": "group B",
    "parental level of education": "associates degree",
    "lunch": "free/reduced",
    "test preparation course": "none",
    "math score": 75,
    "reading score": 80,
    "writing score": 78
}'

# Test 11: Error Case - Invalid Score Type (should return 400)
test_endpoint "1️⃣1️⃣ Testing Error Case - Invalid Score Type" "POST" "/predict/invalid" '{
    "gender": "male",
    "race/ethnicity": "group A",
    "parental level of education": "high school",
    "lunch": "standard",
    "test preparation course": "none"
}' "400"

# Note: This test should return HTTP 400, which is correct behavior for invalid score type

# Test 12: List Available Plots
test_endpoint "1️⃣2️⃣ Testing List Available Plots" "GET" "/api/plots" ""

# Test 13: Test a specific plot image
echo -e "\n1️⃣3️⃣ Testing Plot Image Access..."
echo "----------------------------------------"
plot_response=$(curl -s -I "$BASE_URL/static/plots/score_distributions.png")
if echo "$plot_response" | grep -q "200 OK"; then
    echo "✅ Plot image accessible"
    echo "$plot_response" | head -5
else
    echo "❌ Plot image not accessible"
    echo "$plot_response"
fi

# Test 14: Test model retraining (optional - commented out by default)
# echo -e "\n1️⃣4️⃣ Testing Model Retraining..."
# echo "----------------------------------------"
# retrain_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/model/retrain")
# retrain_status=$(echo "$retrain_response" | tail -n1)
# retrain_body=$(echo "$retrain_response" | head -n -1)
# if [ "$retrain_status" = "200" ]; then
#     echo "✅ Model retraining successful"
#     echo "$retrain_body" | jq '.' 2>/dev/null || echo "$retrain_body"
# else
#     echo "❌ Model retraining failed (HTTP $retrain_status)"
#     echo "$retrain_body" | jq '.' 2>/dev/null || echo "$retrain_body"
# fi

echo -e "\n" 
echo "================================================="
echo "✅ Local Backend Testing Complete!"
echo ""
echo "💡 Tips:"
echo "  - Make sure the server is running: cd backend && python app.py"
echo "  - Check the server logs for any errors"
echo "  - All endpoints should return HTTP 200 for success" 