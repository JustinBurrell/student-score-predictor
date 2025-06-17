# 🧪 Student Score Predictor - Testing Documentation

This document provides comprehensive information about the testing suite for the Student Score Predictor backend.

## 📁 Test Script Structure

```
backend/test_scripts/
├── run_tests.sh           # 🚀 Master test runner (runs all tests)
├── test_comprehensive.py  # 🐍 Advanced Python testing (edge cases, load testing)
├── test_api.sh           # 🌐 Production API testing (Render)
└── test_backend.sh       # 🔧 Local backend testing
```

## 🧪 Test Coverage Overview

| Script | Purpose | When to Use | Coverage |
|--------|---------|-------------|----------|
| **`run_tests.sh`** | Master runner | Run all tests at once | All endpoints + edge cases |
| **`test_comprehensive.py`** | Advanced testing | Deep testing, edge cases, performance | API + Model + Load testing |
| **`test_api.sh`** | Production testing | Test your Render deployment | Production API endpoints |
| **`test_backend.sh`** | Local testing | Test local development server | Local API endpoints |

## 🚀 Usage Examples

### 1. Run All Tests (Recommended)

```bash
# From project root directory
./backend/test_scripts/run_tests.sh
```

**What it does:**
- Checks if local server is running
- Runs comprehensive Python tests (if server running)
- Tests production API on Render
- Tests local backend (if server running)
- Provides summary of all results

### 2. Advanced Python Testing

```bash
# Test local server (default)
python backend/test_scripts/test_comprehensive.py

# Test with custom URL
python backend/test_scripts/test_comprehensive.py --url https://your-api.com

# Test production server
python backend/test_scripts/test_comprehensive.py --url https://student-score-predictor-api.onrender.com
```

**What it tests:**
- ✅ API endpoint testing (HTTP requests)
- ✅ Direct model testing (bypassing API)
- ✅ Edge cases (extreme values, unusual combinations)
- ✅ Concurrent load testing (20 concurrent requests)
- ✅ Data processing validation
- ✅ Prediction logic consistency

### 3. Production API Testing

```bash
# Test production server on Render
./backend/test_scripts/test_api.sh
```

**What it tests:**
- ✅ Health check endpoint
- ✅ Model metadata endpoint
- ✅ Feature importance endpoint
- ✅ Individual score predictions (math, reading, writing)
- ✅ Predict all scores (both scenarios)
- ✅ Error handling for invalid score types
- ✅ Plots listing endpoint

### 4. Local Backend Testing

```bash
# Test local development server
./backend/test_scripts/test_backend.sh
```

**Prerequisites:**
```bash
# Start the Flask server first
cd backend
source venv/bin/activate  # or your virtual environment
python app.py
```

**What it tests:**
- ✅ Server health check
- ✅ All API endpoints locally
- ✅ Plot image accessibility
- ✅ Error handling
- ✅ Response validation

## 📋 Detailed Test Coverage

### API Endpoint Testing
- **Health Check**: `/health` - Service status and model version
- **Model Metadata**: `/model/metadata` - Model information and metrics
- **Feature Importance**: `/model/feature-importance?score_type={type}` - Feature rankings
- **Score Predictions**: `/predict/{score_type}` - Individual score predictions
- **All Predictions**: `/predict/all` - Predict all scores at once
- **Plots**: `/api/plots` - List available visualizations

### Edge Case Testing
- **Extreme Values**: Maximum (100/100) and minimum (35/35) scores
- **Unusual Combinations**: High education with free lunch, large score gaps
- **Correlation Constraints**: Testing score relationship validation
- **Missing Data**: Handling incomplete input data

### Load Testing
- **Concurrent Requests**: 20 simultaneous predictions
- **Response Times**: Average, min, max response time measurement
- **Error Handling**: Graceful failure under load

### Data Processing Testing
- **Minimal Data**: Testing with only required fields
- **Complete Data**: Testing with all fields including scores
- **Field Validation**: Correct column name handling

## 🔧 Setup and Prerequisites

### 1. Environment Setup
```bash
# Activate virtual environment
cd backend
source venv/bin/activate  # or your virtual environment

# Install dependencies
pip install -r requirements.txt
```

### 2. Start Local Server
```bash
# Start Flask development server
cd backend
python app.py
```

### 3. Make Scripts Executable
```bash
# Make all test scripts executable
chmod +x backend/test_scripts/*.sh
chmod +x backend/test_scripts/test_comprehensive.py
```

## 🐛 Troubleshooting

### Common Issues

**1. "Server is not running"**
```bash
# Solution: Start the server
cd backend
python app.py
```

**2. "Permission denied"**
```bash
# Solution: Make scripts executable
chmod +x backend/test_scripts/*.sh
```

**3. "Module not found"**
```bash
# Solution: Activate virtual environment
cd backend
source venv/bin/activate
```

**4. "Connection refused"**
```bash
# Solution: Check if server is on correct port (5001)
# Check if firewall is blocking the connection
```

### Test Output Interpretation

**✅ Success Indicators:**
- HTTP 200 status codes
- "Success" messages in output
- Predictions within expected ranges (35-100)
- Confidence intervals properly formatted

**❌ Failure Indicators:**
- HTTP 4xx/5xx status codes
- "Error" or "Failed" messages
- Missing or malformed responses
- Timeout errors

## 📊 Expected Results

### Successful Test Run Example
```
🧪 Comprehensive Test Suite for Student Score Predictor
======================================================
📍 Testing against: http://localhost:5001
🕐 Started at: 2025-01-17 10:30:00

🌐 API Endpoint Testing
==================================================
✅ Health Check
   Status: healthy, Version: 1.0.0
✅ Model Metadata
   Version: 1.0.0
✅ Feature Importance
✅ Math Prediction API
   Prediction: 63.7

📊 Test Summary
==================================================
✅ Passed: 15
❌ Failed: 0
📈 Success Rate: 100.0%

🎉 All tests passed!
```

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Test Backend
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          python backend/test_scripts/test_comprehensive.py --url https://student-score-predictor-api.onrender.com
```

## 📝 Best Practices

1. **Run tests before deployment**: Always test locally before pushing to production
2. **Check server status**: Ensure local server is running before testing
3. **Review error messages**: Pay attention to specific error details for debugging
4. **Monitor performance**: Watch for slow response times in load tests
5. **Update test data**: Keep test cases relevant to current model expectations

## 🤝 Contributing

When adding new features:
1. Update relevant test scripts
2. Add new test cases for edge cases
3. Verify all existing tests still pass
4. Update this documentation

---

**Last Updated**: January 2025  
**Version**: 1.0.0 