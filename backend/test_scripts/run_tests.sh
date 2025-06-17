#!/bin/bash

# Master Test Runner for Student Score Predictor
# This script runs all available tests

echo "🧪 Student Score Predictor - Master Test Runner"
echo "==============================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to run Python test
run_python_test() {
    local test_file="$1"
    local test_name="$2"
    
    echo -e "\n🐍 Running $test_name..."
    echo "----------------------------------------"
    
    if [ -f "$test_file" ]; then
        cd backend
        python test_scripts/$test_file
        cd ..
    else
        echo "❌ Test file not found: $test_file"
    fi
}

# Function to run shell test
run_shell_test() {
    local test_file="$1"
    local test_name="$2"
    
    echo -e "\n🐚 Running $test_name..."
    echo "----------------------------------------"
    
    if [ -f "$test_file" ]; then
        chmod +x "$test_file"
        ./"$test_file"
    else
        echo "❌ Test file not found: $test_file"
    fi
}

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if server is running (for local tests)
echo "🔍 Checking if local server is running..."
if curl -s "http://localhost:5001/health" > /dev/null 2>&1; then
    echo "✅ Local server is running"
    LOCAL_SERVER_RUNNING=true
else
    echo "⚠️  Local server is not running (some tests will be skipped)"
    LOCAL_SERVER_RUNNING=false
fi

# Run comprehensive Python test (if server is running)
if [ "$LOCAL_SERVER_RUNNING" = true ]; then
    run_python_test "test_comprehensive.py" "Comprehensive Test Suite"
else
    echo -e "\n🐍 Skipping Comprehensive Test Suite (server not running)"
    echo "   Start server with: cd backend && python app.py"
fi

# Run shell tests
echo -e "\n" 
echo "==============================================="
echo "🐚 Shell Script Tests"
echo "==============================================="

# Test production API
run_shell_test "backend/test_scripts/test_api.sh" "Production API Test"

# Test local backend (if server is running)
if [ "$LOCAL_SERVER_RUNNING" = true ]; then
    run_shell_test "backend/test_scripts/test_backend.sh" "Local Backend Test"
else
    echo -e "\n🐚 Skipping Local Backend Test (server not running)"
fi

echo -e "\n" 
echo "==============================================="
echo "✅ All tests completed!"
echo ""
echo "📋 Test Summary:"
echo "  - test_comprehensive.py: Advanced Python testing (edge cases, load testing)"
echo "  - test_api.sh: Production API testing on Render"
echo "  - test_backend.sh: Local backend testing"
echo ""
echo "💡 Tips:"
echo "  - Start local server: cd backend && python app.py"
echo "  - Run individual tests:"
echo "    python backend/test_scripts/test_comprehensive.py"
echo "    ./backend/test_scripts/test_api.sh"
echo "    ./backend/test_scripts/test_backend.sh" 