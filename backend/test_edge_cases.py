import pandas as pd
import numpy as np
from model.predictor import ScorePredictor
from utils.data_processor import DataProcessor
import time
import concurrent.futures
import json

def test_edge_cases():
    predictor = ScorePredictor()
    processor = DataProcessor()
    
    print("\nEdge Case Testing Suite")
    print("=" * 50)
    
    # Test Case 1: Extreme Values
    print("\n1. Testing Extreme Values")
    print("-" * 30)
    
    extreme_cases = [
        {
            'gender': 'female',
            'race/ethnicity': 'group A',
            'parental level of education': 'master\'s degree',
            'lunch': 'standard',
            'test preparation course': 'completed',
            'reading score': 100,  # Maximum possible
            'writing score': 100   # Maximum possible
        },
        {
            'gender': 'male',
            'race/ethnicity': 'group E',
            'parental level of education': 'some high school',
            'lunch': 'free/reduced',
            'test preparation course': 'none',
            'reading score': 35,   # Minimum possible
            'writing score': 35    # Minimum possible
        }
    ]
    
    for i, case in enumerate(extreme_cases, 1):
        print(f"\nExtreme Case {i}:")
        print(json.dumps(case, indent=2))
        try:
            features = processor.preprocess(pd.DataFrame([case]), exclude_score='math', include_scores=True)
            result = predictor.predict(features, 'math')
            print(f"Prediction: {result['prediction']:.1f}")
            print(f"Confidence Interval: {result['confidence_interval']['lower']:.1f} - {result['confidence_interval']['upper']:.1f}")
        except Exception as e:
            print(f"Error: {str(e)}")
    
    # Test Case 2: Unusual Combinations
    print("\n2. Testing Unusual Feature Combinations")
    print("-" * 30)
    
    unusual_cases = [
        {
            'gender': 'female',
            'race/ethnicity': 'group C',
            'parental level of education': 'master\'s degree',
            'lunch': 'free/reduced',  # Unusual: High education but free lunch
            'test preparation course': 'completed',
            'reading score': 95,
            'writing score': 65      # Unusual: Large gap between reading and writing
        },
        {
            'gender': 'male',
            'race/ethnicity': 'group A',
            'parental level of education': 'some high school',
            'lunch': 'standard',     # Unusual: Low education but standard lunch
            'test preparation course': 'none',
            'math score': 98,        # Unusual: High math despite no prep
            'writing score': 45
        }
    ]
    
    for i, case in enumerate(unusual_cases, 1):
        print(f"\nUnusual Case {i}:")
        print(json.dumps(case, indent=2))
        try:
            exclude_score = 'reading' if 'reading score' not in case else 'math'
            features = processor.preprocess(pd.DataFrame([case]), exclude_score=exclude_score, include_scores=True)
            result = predictor.predict(features, exclude_score)
            print(f"Predicting {exclude_score} score:")
            print(f"Prediction: {result['prediction']:.1f}")
            print(f"Confidence Interval: {result['confidence_interval']['lower']:.1f} - {result['confidence_interval']['upper']:.1f}")
        except Exception as e:
            print(f"Error: {str(e)}")
    
    # Test Case 3: Score Correlation Tests
    print("\n3. Testing Score Correlation Constraints")
    print("-" * 30)
    
    correlation_cases = [
        {
            'gender': 'female',
            'race/ethnicity': 'group B',
            'parental level of education': 'bachelor\'s degree',
            'lunch': 'standard',
            'test preparation course': 'completed',
            'math score': 95,
            'writing score': 45     # Large gap between math and writing
        },
        {
            'gender': 'male',
            'race/ethnicity': 'group D',
            'parental level of education': 'associate\'s degree',
            'lunch': 'standard',
            'test preparation course': 'none',
            'math score': 40,
            'writing score': 90     # Inverse large gap
        }
    ]
    
    for i, case in enumerate(correlation_cases, 1):
        print(f"\nCorrelation Case {i}:")
        print(json.dumps(case, indent=2))
        try:
            features = processor.preprocess(pd.DataFrame([case]), exclude_score='reading', include_scores=True)
            result = predictor.predict(features, 'reading')
            print(f"Prediction: {result['prediction']:.1f}")
            print(f"Confidence Interval: {result['confidence_interval']['lower']:.1f} - {result['confidence_interval']['upper']:.1f}")
        except Exception as e:
            print(f"Error: {str(e)}")
    
    # Test Case 4: Concurrent Prediction Load Test
    print("\n4. Testing Concurrent Predictions")
    print("-" * 30)
    
    base_case = {
        'gender': 'female',
        'race/ethnicity': 'group C',
        'parental level of education': 'bachelor\'s degree',
        'lunch': 'standard',
        'test preparation course': 'completed'
    }
    
    def make_prediction(i):
        try:
            features = processor.preprocess(pd.DataFrame([base_case]), exclude_score='math', include_scores=False)
            start_time = time.time()
            result = predictor.predict(features, 'math')
            end_time = time.time()
            return end_time - start_time
        except Exception as e:
            return str(e)
    
    n_concurrent = 50
    print(f"Making {n_concurrent} concurrent predictions...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        response_times = list(executor.map(make_prediction, range(n_concurrent)))
    
    successful_times = [t for t in response_times if isinstance(t, float)]
    if successful_times:
        avg_time = sum(successful_times) / len(successful_times)
        print(f"Average response time: {avg_time:.3f} seconds")
        print(f"Max response time: {max(successful_times):.3f} seconds")
        print(f"Min response time: {min(successful_times):.3f} seconds")
    
    errors = [t for t in response_times if isinstance(t, str)]
    if errors:
        print(f"Number of errors: {len(errors)}")
        print("Sample error:", errors[0])

if __name__ == '__main__':
    test_edge_cases() 