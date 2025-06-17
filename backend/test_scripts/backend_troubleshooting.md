# Virtual Environment Troubleshooting Guide

## 🚀 Quick Start - Usage Examples

### **Basic Commands**
```bash
# Check if your virtual environment is healthy
./backend/test_scripts/manage_venv.sh check

# Get detailed information about your virtual environment
./backend/test_scripts/manage_venv.sh info

# Recreate virtual environment (fixes most issues)
./backend/test_scripts/manage_venv.sh recreate

# Remove virtual environment completely
./backend/test_scripts/manage_venv.sh clean

# Show help and all available commands
./backend/test_scripts/manage_venv.sh help
```

### **Common Workflows**

#### **Daily Development**
```bash
# Quick health check before starting work
./backend/test_scripts/manage_venv.sh check

# If issues found, fix them
./backend/test_scripts/manage_venv.sh recreate
```

#### **When Tests Fail**
```bash
# Run tests with automatic health check
./backend/test_scripts/run_tests.sh

# If tests fail due to venv issues, force recreation
./backend/test_scripts/run_tests.sh --recreate
```

#### **New Developer Setup**
```bash
# Complete setup for new team members
./setup.sh

# Or manual setup
./backend/test_scripts/manage_venv.sh recreate
cd frontend && npm install
```

#### **Debugging Environment Issues**
```bash
# Get detailed environment information
./backend/test_scripts/manage_venv.sh info

# Check specific package installations
source .venv/bin/activate && pip list | grep flask

# Test core functionality
source .venv/bin/activate && python -c "import flask, numpy, pandas, sklearn"
```

### **Emergency Recovery**
```bash
# Nuclear option - complete reset
./backend/test_scripts/manage_venv.sh clean
./backend/test_scripts/manage_venv.sh recreate

# Or use the setup script
./setup.sh
```

### **Integration with Development Workflow**
```bash
# Start backend server (with proper venv activation)
cd backend && source ../.venv/bin/activate && python app.py

# Start frontend (in another terminal)
cd frontend && npm start

# Run comprehensive tests
./backend/test_scripts/run_tests.sh
```

---

## Why Virtual Environments Get Corrupted

Virtual environment corruption is a common issue that can occur due to several factors:

### Common Causes
1. **Incomplete Package Installations**
   - Interrupted `pip install` commands
   - Network timeouts during package downloads
   - Insufficient disk space during installation

2. **Version Conflicts**
   - Installing incompatible package versions
   - Upgrading Python after creating the venv
   - Package dependency conflicts

3. **File System Issues**
   - macOS case-sensitivity problems
   - Permission issues (especially when switching users)
   - File system corruption

4. **Python Version Mismatches**
   - Creating venv with one Python version, using another
   - System Python updates affecting venv

5. **Permission Issues**
   - Running as different users
   - File ownership problems
   - Read-only file systems

## Prevention Strategies

### 1. Use the Management Scripts
```bash
# Check venv health regularly
./backend/test_scripts/manage_venv.sh check

# Get venv information
./backend/test_scripts/manage_venv.sh info
```

### 2. Best Practices
- Always activate the virtual environment before installing packages
- Use `pip install --upgrade pip` before installing other packages
- Keep requirements.txt up to date
- Don't manually edit files in the `.venv` directory
- Use consistent Python versions across team members

### 3. Regular Maintenance
```bash
# Weekly health check
./backend/test_scripts/manage_venv.sh check

# Update pip regularly
source .venv/bin/activate && pip install --upgrade pip

# Check for outdated packages
source .venv/bin/activate && pip list --outdated
```

## Quick Fixes

### 1. Automatic Recreation
```bash
# Recreate venv automatically
./backend/test_scripts/run_tests.sh --recreate

# Or use the management script
./backend/test_scripts/manage_venv.sh recreate
```

### 2. Manual Recreation
```bash
# Remove old venv
rm -rf .venv

# Create new venv
python3 -m venv .venv

# Activate and install dependencies
source .venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 3. Partial Fixes
```bash
# Reinstall specific problematic packages
source .venv/bin/activate
pip uninstall flask numpy pandas scikit-learn
pip install -r backend/requirements.txt
```

## Detection Methods

### 1. Health Check Script
```bash
./backend/test_scripts/manage_venv.sh check
```

### 2. Manual Checks
```bash
# Check if venv exists
ls -la .venv/

# Check if activation script exists
ls -la .venv/bin/activate

# Test pip functionality
source .venv/bin/activate && pip --version

# Test key package imports
source .venv/bin/activate && python -c "import flask, numpy, pandas, sklearn"
```

### 3. Common Error Signs
- `ModuleNotFoundError` for installed packages
- `pip: command not found` in activated venv
- Import errors for core packages
- Permission denied errors
- Python version mismatches

## Advanced Troubleshooting

### 1. Debug Virtual Environment
```bash
# Check Python path
source .venv/bin/activate && which python

# Check pip path
source .venv/bin/activate && which pip

# Check installed packages
source .venv/bin/activate && pip list

# Check package locations
source .venv/bin/activate && python -c "import sys; print(sys.path)"
```

### 2. Fix Specific Issues

#### Pip Corruption
```bash
# Reinstall pip
source .venv/bin/activate
python -m ensurepip --upgrade
```

#### Package Import Issues
```bash
# Reinstall specific package
source .venv/bin/activate
pip uninstall package_name
pip install package_name
```

#### Permission Issues
```bash
# Fix ownership (replace username)
sudo chown -R username:username .venv/
chmod -R 755 .venv/
```

### 3. Environment Variables
```bash
# Check environment variables
source .venv/bin/activate && env | grep -i python

# Reset environment
deactivate
source .venv/bin/activate
```

## Automation and CI/CD

### 1. Automated Health Checks
Add to your CI/CD pipeline:
```bash
# Pre-test health check
./backend/test_scripts/manage_venv.sh check || ./backend/test_scripts/manage_venv.sh recreate
```

### 2. Setup Scripts
Use the provided setup script for new environments:
```bash
./setup.sh
```

### 3. Test Runner Integration
The test runner now includes automatic venv health checks:
```bash
./backend/test_scripts/run_tests.sh
```

## Recovery Procedures

### 1. Emergency Recovery
```bash
# Quick fix for immediate issues
./backend/test_scripts/manage_venv.sh recreate
```

### 2. Data Preservation
Before recreating venv, backup any custom configurations:
```bash
# Backup custom pip configurations
cp .venv/pip.conf ~/venv_backup/ 2>/dev/null || true

# Backup any custom scripts
cp -r .venv/bin/custom_scripts ~/venv_backup/ 2>/dev/null || true
```

### 3. Complete Reset
```bash
# Nuclear option - complete reset
./backend/test_scripts/manage_venv.sh clean
./setup.sh
```

## Monitoring and Alerts

### 1. Regular Health Monitoring
Create a cron job for regular checks:
```bash
# Add to crontab
0 9 * * * cd /path/to/project && ./backend/test_scripts/manage_venv.sh check
```

### 2. Pre-commit Hooks
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
./backend/test_scripts/manage_venv.sh check || {
    echo "Virtual environment health check failed"
    exit 1
}
```

## Team Collaboration

### 1. Consistent Environments
- Use the same Python version across team
- Share requirements.txt updates
- Document any custom configurations

### 2. Onboarding
- New team members should run `./setup.sh`
- Include venv management in onboarding docs
- Provide troubleshooting resources

### 3. Communication
- Report venv issues in team chat
- Document solutions for common problems
- Share successful recovery procedures

## Resources

- [Python venv documentation](https://docs.python.org/3/library/venv.html)
- [pip troubleshooting](https://pip.pypa.io/en/stable/user_guide/#troubleshooting)
- [Virtual environment best practices](https://realpython.com/python-virtual-environments-a-primer/)

## Support

If you encounter persistent issues:
1. Check this troubleshooting guide
2. Try the automated recovery scripts
3. Consult team documentation
4. Report issues with detailed error messages 