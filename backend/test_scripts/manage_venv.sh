#!/bin/bash

# Virtual Environment Management Script for Student Score Predictor
# ===============================================================
# This script helps manage virtual environment health and recreation
# 
# Features:
# - Health checks for virtual environment integrity
# - Automatic recreation of corrupted environments
# - Detailed environment information display
# - Safe cleanup operations
# - Colored output for better user experience
#
# Usage Examples:
#   ./backend/test_scripts/manage_venv.sh check      # Check venv health
#   ./backend/test_scripts/manage_venv.sh recreate   # Recreate venv
#   ./backend/test_scripts/manage_venv.sh info       # Show venv details
#   ./backend/test_scripts/manage_venv.sh clean      # Remove venv
#   ./backend/test_scripts/manage_venv.sh help       # Show help

set -e  # Exit on any error - ensures script stops if any command fails

# =============================================================================
# CONFIGURATION SECTION
# =============================================================================
# Define paths and settings that can be easily modified
VENV_DIR=".venv"                                    # Virtual environment directory name
VENV_ACTIVATE="$VENV_DIR/bin/activate"              # Path to activation script
REQUIREMENTS_FILE="backend/requirements.txt"        # Python dependencies file
PYTHON_VERSION="3.12"                               # Target Python version (for reference)

# =============================================================================
# COLOR DEFINITIONS FOR OUTPUT
# =============================================================================
# ANSI color codes for better visual feedback
RED='\033[0;31m'      # Error messages
GREEN='\033[0;32m'    # Success messages
YELLOW='\033[1;33m'   # Warning messages
BLUE='\033[0;34m'     # Info messages
NC='\033[0m'          # No Color (reset)

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Function to print colored output with consistent formatting
# Parameters: $1 = color code, $2 = message
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

# Function to check if we're in the correct project directory
# Ensures the script is run from the project root where backend/ exists
check_directory() {
    if [ ! -d "backend" ]; then
        print_status $RED "❌ Error: Please run this script from the project root directory"
        print_status $YELLOW "💡 The script expects to find a 'backend' directory in the current location"
        exit 1
    fi
}

# =============================================================================
# VIRTUAL ENVIRONMENT HEALTH FUNCTIONS
# =============================================================================

# Function to perform comprehensive virtual environment health checks
# Returns 0 (success) if venv is healthy, 1 (failure) if issues found
check_venv_health() {
    print_status $BLUE "🔍 Checking virtual environment health..."
    
    # Check 1: Virtual environment directory exists
    if [ ! -d "$VENV_DIR" ]; then
        print_status $RED "❌ Virtual environment not found"
        print_status $YELLOW "💡 Run './backend/test_scripts/manage_venv.sh recreate' to create one"
        return 1
    fi
    
    # Check 2: Activation script exists and is executable
    if [ ! -f "$VENV_ACTIVATE" ]; then
        print_status $RED "❌ Virtual environment activation script missing"
        print_status $YELLOW "💡 This indicates a corrupted virtual environment"
        return 1
    fi
    
    # Check 3: Test if pip works correctly in the virtual environment
    if ! source "$VENV_ACTIVATE" && pip --version > /dev/null 2>&1; then
        print_status $RED "❌ Virtual environment pip is corrupted"
        print_status $YELLOW "💡 This usually happens due to incomplete installations or permission issues"
        return 1
    fi
    
    # Check 4: Test if key packages can be imported (core functionality test)
    if ! source "$VENV_ACTIVATE" && python -c "import flask, numpy, pandas, sklearn" > /dev/null 2>&1; then
        print_status $RED "❌ Key packages missing or corrupted in virtual environment"
        print_status $YELLOW "💡 Core packages (flask, numpy, pandas, sklearn) are required"
        return 1
    fi
    
    print_status $GREEN "✅ Virtual environment is healthy"
    print_status $BLUE "💡 All core packages are available and functional"
    return 0
}

# =============================================================================
# VIRTUAL ENVIRONMENT RECREATION FUNCTIONS
# =============================================================================

# Function to completely recreate the virtual environment
# This is the nuclear option when health checks fail
recreate_venv() {
    print_status $BLUE "🔄 Recreating virtual environment..."
    
    # Step 1: Remove old virtual environment
    if [ -d "$VENV_DIR" ]; then
        print_status $YELLOW "🗑️  Removing old virtual environment..."
        rm -rf "$VENV_DIR"
        print_status $GREEN "✅ Old virtual environment removed"
    fi
    
    # Step 2: Create new virtual environment
    print_status $BLUE "🏗️  Creating new virtual environment..."
    if ! python3 -m venv "$VENV_DIR"; then
        print_status $RED "❌ Failed to create virtual environment"
        print_status $YELLOW "💡 Check that python3 is installed and accessible"
        return 1
    fi
    print_status $GREEN "✅ New virtual environment created"
    
    # Step 3: Install dependencies
    print_status $BLUE "📦 Installing dependencies..."
    if ! source "$VENV_ACTIVATE" && pip install --upgrade pip && pip install -r "$REQUIREMENTS_FILE"; then
        print_status $RED "❌ Failed to install dependencies"
        print_status $YELLOW "💡 Check your internet connection and requirements.txt file"
        return 1
    fi
    print_status $GREEN "✅ Dependencies installed successfully"
    
    print_status $GREEN "✅ Virtual environment recreated successfully"
    print_status $BLUE "💡 You can now activate it with: source .venv/bin/activate"
    return 0
}

# =============================================================================
# INFORMATION DISPLAY FUNCTIONS
# =============================================================================

# Function to display detailed virtual environment information
# Shows Python version, pip version, and key installed packages
show_venv_info() {
    if [ -d "$VENV_DIR" ]; then
        print_status $BLUE "📊 Virtual Environment Information:"
        echo "  Directory: $(pwd)/$VENV_DIR"
        echo "  Python: $(source "$VENV_ACTIVATE" && python --version 2>&1)"
        echo "  Pip: $(source "$VENV_ACTIVATE" && pip --version 2>&1)"
        echo "  Key packages:"
        # Show only the most important packages for clarity
        source "$VENV_ACTIVATE" && pip list | grep -E "(flask|numpy|pandas|scikit-learn)" || echo "    None found"
        
        # Additional useful information
        echo "  Total packages: $(source "$VENV_ACTIVATE" && pip list | wc -l)"
        echo "  Virtual environment size: $(du -sh "$VENV_DIR" 2>/dev/null | cut -f1 || echo 'Unknown')"
    else
        print_status $RED "❌ Virtual environment not found"
        print_status $YELLOW "💡 Run './backend/test_scripts/manage_venv.sh recreate' to create one"
    fi
}

# =============================================================================
# HELP AND USAGE FUNCTIONS
# =============================================================================

# Function to display comprehensive help information
show_usage() {
    echo "Virtual Environment Management Script"
    echo "====================================="
    echo ""
    echo "Purpose: Manage and troubleshoot Python virtual environments for the Student Score Predictor project"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  check     - Check virtual environment health and report issues"
    echo "  recreate  - Remove and recreate virtual environment (nuclear option)"
    echo "  info      - Show detailed virtual environment information"
    echo "  clean     - Remove virtual environment completely"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 check      # Check if venv is healthy"
    echo "  $0 recreate   # Recreate venv if corrupted"
    echo "  $0 info       # Show venv details and package info"
    echo "  $0 clean      # Remove venv (use with caution)"
    echo ""
    echo "Common Workflows:"
    echo "  1. Regular health check: $0 check"
    echo "  2. Fix corruption issues: $0 recreate"
    echo "  3. Debug environment: $0 info"
    echo "  4. Start fresh: $0 clean && $0 recreate"
    echo ""
    echo "Integration with Test Runner:"
    echo "  ./backend/test_scripts/run_tests.sh --recreate  # Auto-recreate during tests"
    echo ""
    echo "For more detailed troubleshooting, see: backend/test_scripts/VENV_TROUBLESHOOTING.md"
}

# =============================================================================
# MAIN SCRIPT LOGIC
# =============================================================================

# Main function that handles command-line arguments and executes appropriate actions
main() {
    # Always check directory first to ensure we're in the right place
    check_directory
    
    # Parse command line arguments and execute corresponding functions
    case "${1:-help}" in
        "check")
            # Health check - most commonly used command
            if check_venv_health; then
                exit 0  # Success
            else
                exit 1  # Failure - venv has issues
            fi
            ;;
        "recreate")
            # Nuclear option - recreate everything
            recreate_venv
            ;;
        "info")
            # Display detailed information
            show_venv_info
            ;;
        "clean")
            # Remove virtual environment (use with caution)
            if [ -d "$VENV_DIR" ]; then
                print_status $YELLOW "🗑️  Removing virtual environment..."
                rm -rf "$VENV_DIR"
                print_status $GREEN "✅ Virtual environment removed"
                print_status $BLUE "💡 Run '$0 recreate' to create a new one"
            else
                print_status $YELLOW "⚠️  Virtual environment not found"
            fi
            ;;
        "help"|*)
            # Show help for unknown commands or explicit help request
            show_usage
            ;;
    esac
}

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

# Execute the main function with all command line arguments
main "$@" 