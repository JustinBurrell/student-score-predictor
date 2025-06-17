#!/usr/bin/env python3
"""
Comprehensive Test Suite for Student Score Predictor Backend
Combines edge cases, predictions, and API testing
"""

import sys
import os
import requests
import json
import time
import concurrent.futures
import pandas as pd
import numpy as np
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = str(Path(__file__).resolve().parent.parent)
sys.path.append(backend_dir)

from model.predictor import ScorePredictor
from utils.data_processor import DataProcessor

class ComprehensiveTester:
    def __init__(self, base_url="http://localhost:5001"):
        self.base_url = base_url
        self.predictor = ScorePredictor()
        self.processor = DataProcessor()
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
    
    def log_result(self, test_name, success, error=None):
        """Log test results"""
        if success:
            self.test_results['passed'] += 1
            print(f"✅ {test_name}")
        else:
            self.test_results['failed'] += 1
            self.test_results['errors'].append(f"{test_name}: {error}")
            print(f"❌ {test_name}: {error}")
    
    def test_api_endpoints(self):
        """Test API endpoints via HTTP requests"""
        print("\n🌐 API Endpoint Testing")
        print("=" * 50)
        
        # Test 1: Health Check
        try:
            response = requests.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                self.log_result("Health Check", True)
                print(f"   Status: {data['status']}, Version: {data['model_version']}")
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Health Check", False, str(e))
        
        # Test 2: Model Metadata
        try:
            response = requests.get(f"{self.base_url}/model/metadata")
            if response.status_code == 200:
                data = response.json()
                if data['success']:
                    self.log_result("Model Metadata", True)
                    print(f"   Version: {data['metadata']['version']}")
                else:
                    self.log_result("Model Metadata", False, data.get('error', 'Unknown error'))
            else:
                self.log_result("Model Metadata", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Model Metadata", False, str(e))
        
        # Test 3: Feature Importance
        try:
            response = requests.get(f"{self.base_url}/model/feature-importance?score_type=math")
            if response.status_code == 200:
                data = response.json()
                if data['success']:
                    self.log_result("Feature Importance", True)
                else:
                    self.log_result("Feature Importance", False, data.get('error', 'Unknown error'))
            else:
                self.log_result("Feature Importance", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Feature Importance", False, str(e))
        
        # Test 4: Math Prediction via API
        try:
            payload = {
                "gender": "female",
                "race/ethnicity": "group A",
                "parental level of education": "bachelors degree",
                "lunch": "standard",
                "test preparation course": "completed",
                "reading score": 70,
                "writing score": 75
            }
            response = requests.post(f"{self.base_url}/predict/math", json=payload)
            if response.status_code == 200:
                data = response.json()
                if data['success']:
                    self.log_result("Math Prediction API", True)
                    print(f"   Prediction: {data['predicted_math_score']:.1f}")
                else:
                    self.log_result("Math Prediction API", False, data.get('error', 'Unknown error'))
            else:
                self.log_result("Math Prediction API", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_result("Math Prediction API", False, str(e))
    
    def test_prediction_logic(self):
        """Test prediction logic directly"""
        print("\n🧠 Prediction Logic Testing")
        print("=" * 50)
        
        # Test 1: Initial prediction (no scores)
        try:
            initial_data = {
                'gender': 'female',
                'race/ethnicity': 'group C',
                'parental level of education': "bachelor's degree",
                'lunch': 'standard',
                'test preparation course': 'completed'
            }
            
            features = self.processor.preprocess(pd.DataFrame([initial_data]), exclude_score='math', include_scores=False)
            predictions = self.predictor.predict_all(features)
            
            self.log_result("Initial Predictions (No Scores)", True)
            for score_type, result in predictions.items():
                print(f"   {score_type.title()}: {result['prediction']:.1f}")
        except Exception as e:
            self.log_result("Initial Predictions (No Scores)", False, str(e))
        
        # Test 2: Prediction with scores
        try:
            test_data = initial_data.copy()
            test_data['reading score'] = 75
            test_data['writing score'] = 80
            
            features = self.processor.preprocess(pd.DataFrame([test_data]), exclude_score='math', include_scores=True)
            result = self.predictor.predict(features, 'math')
            
            self.log_result("Prediction with Scores", True)
            print(f"   Math Score: {result['prediction']:.1f}")
        except Exception as e:
            self.log_result("Prediction with Scores", False, str(e))
    
    def test_edge_cases(self):
        """Test edge cases and extreme values"""
        print("\n⚠️  Edge Case Testing")
        print("=" * 50)
        
        # Test 1: Extreme values
        try:
            extreme_case = {
                'gender': 'female',
                'race/ethnicity': 'group A',
                'parental level of education': 'master\'s degree',
                'lunch': 'standard',
                'test preparation course': 'completed',
                'reading score': 100,  # Maximum
                'writing score': 100   # Maximum
            }
            
            features = self.processor.preprocess(pd.DataFrame([extreme_case]), exclude_score='math', include_scores=True)
            result = self.predictor.predict(features, 'math')
            
            self.log_result("Extreme Values (100/100)", True)
            print(f"   Prediction: {result['prediction']:.1f}")
        except Exception as e:
            self.log_result("Extreme Values (100/100)", False, str(e))
        
        # Test 2: Minimum values
        try:
            min_case = {
                'gender': 'male',
                'race/ethnicity': 'group E',
                'parental level of education': 'some high school',
                'lunch': 'free/reduced',
                'test preparation course': 'none',
                'reading score': 35,   # Minimum
                'writing score': 35    # Minimum
            }
            
            features = self.processor.preprocess(pd.DataFrame([min_case]), exclude_score='math', include_scores=True)
            result = self.predictor.predict(features, 'math')
            
            self.log_result("Minimum Values (35/35)", True)
            print(f"   Prediction: {result['prediction']:.1f}")
        except Exception as e:
            self.log_result("Minimum Values (35/35)", False, str(e))
        
        # Test 3: Unusual combinations
        try:
            unusual_case = {
                'gender': 'female',
                'race/ethnicity': 'group C',
                'parental level of education': 'master\'s degree',
                'lunch': 'free/reduced',  # High education but free lunch
                'test preparation course': 'completed',
                'reading score': 95,
                'writing score': 65      # Large gap
            }
            
            features = self.processor.preprocess(pd.DataFrame([unusual_case]), exclude_score='math', include_scores=True)
            result = self.predictor.predict(features, 'math')
            
            self.log_result("Unusual Combinations", True)
            print(f"   Prediction: {result['prediction']:.1f}")
        except Exception as e:
            self.log_result("Unusual Combinations", False, str(e))
    
    def test_concurrent_load(self):
        """Test concurrent prediction load"""
        print("\n⚡ Concurrent Load Testing")
        print("=" * 50)
        
        base_case = {
            'gender': 'female',
            'race/ethnicity': 'group C',
            'parental level of education': 'bachelor\'s degree',
            'lunch': 'standard',
            'test preparation course': 'completed'
        }
        
        def make_prediction(i):
            try:
                features = self.processor.preprocess(pd.DataFrame([base_case]), exclude_score='math', include_scores=False)
                start_time = time.time()
                result = self.predictor.predict(features, 'math')
                end_time = time.time()
                return end_time - start_time
            except Exception as e:
                return str(e)
        
        n_concurrent = 20
        print(f"🔄 Making {n_concurrent} concurrent predictions...")
        
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                response_times = list(executor.map(make_prediction, range(n_concurrent)))
            
            successful_times = [t for t in response_times if isinstance(t, float)]
            if successful_times:
                avg_time = sum(successful_times) / len(successful_times)
                self.log_result("Concurrent Load Test", True)
                print(f"   Average time: {avg_time:.3f}s, Max: {max(successful_times):.3f}s")
            else:
                self.log_result("Concurrent Load Test", False, "No successful predictions")
        except Exception as e:
            self.log_result("Concurrent Load Test", False, str(e))
    
    def test_data_processing(self):
        """Test data processing edge cases"""
        print("\n🔧 Data Processing Testing")
        print("=" * 50)
        
        # Test 1: Missing optional fields
        try:
            minimal_data = {
                'gender': 'female',
                'race/ethnicity': 'group A',
                'parental level of education': 'bachelor\'s degree',
                'lunch': 'standard',
                'test preparation course': 'completed'
            }
            
            features = self.processor.preprocess(pd.DataFrame([minimal_data]), exclude_score='math', include_scores=False)
            self.log_result("Minimal Data Processing", True)
        except Exception as e:
            self.log_result("Minimal Data Processing", False, str(e))
        
        # Test 2: All fields with scores
        try:
            complete_data = {
                'gender': 'male',
                'race/ethnicity': 'group B',
                'parental level of education': 'associate\'s degree',
                'lunch': 'free/reduced',
                'test preparation course': 'none',
                'math score': 75,
                'reading score': 80,
                'writing score': 78
            }
            
            features = self.processor.preprocess(pd.DataFrame([complete_data]), exclude_score='math', include_scores=True)
            self.log_result("Complete Data Processing", True)
        except Exception as e:
            self.log_result("Complete Data Processing", False, str(e))
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🧪 Comprehensive Test Suite for Student Score Predictor")
        print("=" * 70)
        print(f"📍 Testing against: {self.base_url}")
        print(f"🕐 Started at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Run all test suites
        self.test_api_endpoints()
        self.test_prediction_logic()
        self.test_edge_cases()
        self.test_concurrent_load()
        self.test_data_processing()
        
        # Print summary
        print("\n" + "=" * 70)
        print("📊 Test Summary")
        print("=" * 70)
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        print(f"📈 Success Rate: {self.test_results['passed']/(self.test_results['passed']+self.test_results['failed'])*100:.1f}%")
        
        if self.test_results['errors']:
            print("\n❌ Errors:")
            for error in self.test_results['errors']:
                print(f"   - {error}")
        
        print(f"\n🕐 Completed at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        return self.test_results['failed'] == 0

def main():
    """Main function to run tests"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Comprehensive test suite for Student Score Predictor')
    parser.add_argument('--url', default='http://localhost:5001', 
                       help='Base URL for API testing (default: http://localhost:5001)')
    
    args = parser.parse_args()
    
    tester = ComprehensiveTester(args.url)
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed!")
        sys.exit(1)

if __name__ == '__main__':
    main() 