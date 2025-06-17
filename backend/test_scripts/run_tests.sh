#!/bin/bash

# Master Test Runner for Student Score Predictor
# This script runs all available tests with virtual environment management

echo "🧪 Student Score Predictor - Master Test Runner"
echo "==============================================="

# Configuration
VENV_DIR=".venv"
VENV_ACTIVATE="$VENV_DIR/bin/activate"
REQUIREMENTS_FILE="backend/requirements.txt"
PYTHON_VERSION="3.12"  # Adjust as needed

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check virtual environment health
check_venv_health() {
    echo "🔍 Checking virtual environment health..."
    
    if [ ! -d "$VENV_DIR" ]; then
        echo "❌ Virtual environment not found"
        return 1
    fi
    
    if [ ! -f "$VENV_ACTIVATE" ]; then
        echo "❌ Virtual environment activation script missing"
        return 1
    fi
    
    # Test if pip works
    if ! source "$VENV_ACTIVATE" && pip --version > /dev/null 2>&1; then
        echo "❌ Virtual environment pip is corrupted"
        return 1
    fi
    
    # Test if key packages are installed
    if ! source "$VENV_ACTIVATE" && python -c "import flask, numpy, pandas, sklearn" > /dev/null 2>&1; then
        echo "❌ Key packages missing or corrupted in virtual environment"
        return 1
    fi
    
    echo "✅ Virtual environment is healthy"
    return 0
}

# Function to recreate virtual environment
recreate_venv() {
    echo "🔄 Recreating virtual environment..."
    
    # Remove old venv
    if [ -d "$VENV_DIR" ]; then
        echo "🗑️  Removing old virtual environment..."
        rm -rf "$VENV_DIR"
    fi
    
    # Create new venv
    echo "🏗️  Creating new virtual environment..."
    if ! python3 -m venv "$VENV_DIR"; then
        echo "❌ Failed to create virtual environment"
        return 1
    fi
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    if ! source "$VENV_ACTIVATE" && pip install --upgrade pip && pip install -r "$REQUIREMENTS_FILE"; then
        echo "❌ Failed to install dependencies"
        return 1
    fi
    
    echo "✅ Virtual environment recreated successfully"
    return 0
}

# Function to run Python test
run_python_test() {
    local test_file="$1"
    local test_name="$2"
    
    echo -e "\n🐍 Running $test_name..."
    echo "----------------------------------------"
    
    if [ -f "backend/test_scripts/$test_file" ]; then
        cd backend
        source "../$VENV_ACTIVATE"
        python test_scripts/$test_file
        cd ..
    else
        echo "❌ Test file not found: backend/test_scripts/$test_file"
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

# Virtual environment management
echo "🔧 Virtual Environment Management"
echo "================================="

# Check if --recreate flag is provided
if [[ "$1" == "--recreate" ]]; then
    echo "🔄 Force recreating virtual environment..."
    if ! recreate_venv; then
        echo "❌ Failed to recreate virtual environment"
        exit 1
    fi
elif ! check_venv_health; then
    echo "⚠️  Virtual environment issues detected"
    echo "💡 Options:"
    echo "  1. Run with --recreate flag to automatically fix"
    echo "  2. Manually recreate: rm -rf .venv && python3 -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt"
    echo "  3. Continue anyway (may fail)"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted"
        exit 1
    fi
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
    echo "   Start server with: cd backend && source ../.venv/bin/activate && python app.py"
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
echo "  - Start local server: cd backend && source ../.venv/bin/activate && python app.py"
echo "  - Recreate venv if issues: ./backend/test_scripts/run_tests.sh --recreate"
echo "  - Run individual tests:"
echo "    source .venv/bin/activate && python backend/test_scripts/test_comprehensive.py"
echo "    ./backend/test_scripts/test_api.sh"
echo "    ./backend/test_scripts/test_backend.sh" 