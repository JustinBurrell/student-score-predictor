#!/bin/bash

# Setup Script for Student Score Predictor
# This script sets up the development environment for new developers

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status $BLUE "🔍 Checking prerequisites..."
    
    # Check Python
    if ! command_exists python3; then
        print_status $RED "❌ Python 3 is not installed"
        print_status $YELLOW "💡 Install Python 3 from https://python.org"
        exit 1
    fi
    
    # Check Node.js (for frontend)
    if ! command_exists node; then
        print_status $YELLOW "⚠️  Node.js not found (needed for frontend)"
        print_status $YELLOW "💡 Install Node.js from https://nodejs.org"
    else
        print_status $GREEN "✅ Node.js found: $(node --version)"
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_status $YELLOW "⚠️  npm not found (needed for frontend)"
    else
        print_status $GREEN "✅ npm found: $(npm --version)"
    fi
    
    print_status $GREEN "✅ Prerequisites check complete"
}

# Function to setup backend
setup_backend() {
    print_status $BLUE "🐍 Setting up Python backend..."
    
    # Create virtual environment
    if [ -d ".venv" ]; then
        print_status $YELLOW "⚠️  Virtual environment already exists"
        read -p "Recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf .venv
        else
            print_status $YELLOW "Skipping virtual environment creation"
            return 0
        fi
    fi
    
    print_status $BLUE "🏗️  Creating virtual environment..."
    python3 -m venv .venv
    
    print_status $BLUE "📦 Installing Python dependencies..."
    source .venv/bin/activate
    pip install --upgrade pip
    pip install -r backend/requirements.txt
    
    print_status $GREEN "✅ Backend setup complete"
}

# Function to setup frontend
setup_frontend() {
    print_status $BLUE "⚛️  Setting up React frontend..."
    
    if [ ! -d "frontend" ]; then
        print_status $RED "❌ Frontend directory not found"
        return 1
    fi
    
    cd frontend
    
    if [ -d "node_modules" ]; then
        print_status $YELLOW "⚠️  node_modules already exists"
        read -p "Reinstall dependencies? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf node_modules package-lock.json
        else
            print_status $YELLOW "Skipping frontend dependency installation"
            cd ..
            return 0
        fi
    fi
    
    print_status $BLUE "📦 Installing Node.js dependencies..."
    npm install
    
    cd ..
    print_status $GREEN "✅ Frontend setup complete"
}

# Function to run tests
run_initial_tests() {
    print_status $BLUE "🧪 Running initial tests..."
    
    # Test backend
    print_status $BLUE "🐍 Testing backend..."
    source .venv/bin/activate
    cd backend
    python -c "import flask, numpy, pandas, sklearn; print('✅ Backend imports successful')"
    cd ..
    
    # Test frontend
    if [ -d "frontend/node_modules" ]; then
        print_status $BLUE "⚛️  Testing frontend..."
        cd frontend
        npm run build --silent > /dev/null 2>&1 && print_status $GREEN "✅ Frontend build successful" || print_status $YELLOW "⚠️  Frontend build had issues"
        cd ..
    fi
    
    print_status $GREEN "✅ Initial tests complete"
}

# Function to show next steps
show_next_steps() {
    print_status $GREEN "🎉 Setup complete!"
    echo ""
    print_status $BLUE "📋 Next Steps:"
    echo "  1. Start the backend server:"
    echo "     cd backend && source ../.venv/bin/activate && python app.py"
    echo ""
    echo "  2. Start the frontend (in another terminal):"
    echo "     cd frontend && npm start"
    echo ""
    echo "  3. Run tests:"
    echo "     ./backend/test_scripts/run_tests.sh"
    echo ""
    echo "  4. Manage virtual environment:"
    echo "     ./backend/test_scripts/manage_venv.sh help"
    echo ""
    print_status $BLUE "🌐 Access the application:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:5001"
    echo "  API Health Check: http://localhost:5001/health"
}

# Main setup function
main() {
    print_status $BLUE "🚀 Student Score Predictor - Development Setup"
    echo "=================================================="
    echo ""
    
    # Check if we're in the right directory
    if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_status $RED "❌ Error: Please run this script from the project root directory"
        exit 1
    fi
    
    check_prerequisites
    echo ""
    
    setup_backend
    echo ""
    
    setup_frontend
    echo ""
    
    run_initial_tests
    echo ""
    
    show_next_steps
}

# Run main function
main "$@" 