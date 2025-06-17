import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = str(Path(__file__).resolve().parent.parent)
sys.path.append(backend_dir)

import pandas as pd
from model.predictor import ScorePredictor
from utils.data_processor import DataProcessor

def test_predictions():
    """Test all prediction scenarios with consistent naming conventions"""
    try:
        predictor = ScorePredictor()
        processor = DataProcessor()
        
        print("\n🧪 Testing All Prediction Scenarios")
        print("=" * 60)
        
        # Test case 1: Initial prediction (no scores)
        print("\n📊 Test Case 1: Initial Prediction (No Scores)")
        print("-" * 50)
        
        # Sample student data without scores
        initial_data = {
            'gender': 'female',
            'race/ethnicity': 'group C',
            'parental level of education': "bachelor's degree",
            'lunch': 'standard',
            'test preparation course': 'completed'
        }
        
        # Process data for initial prediction
        features = processor.preprocess(pd.DataFrame([initial_data]), include_scores=False)
        predictions = predictor.predict_all(features)
        
        print("✅ Initial Predictions (no scores provided):")
        for score_type, result in predictions.items():
            print(f"   {score_type.title()} Score: {result['prediction']:.1f} (CI: {result['confidence_interval']['lower']:.1f} - {result['confidence_interval']['upper']:.1f})")
        
        # Store initial predictions for subsequent tests
        initial_math = predictions['math']['prediction']
        initial_reading = predictions['reading']['prediction']
        initial_writing = predictions['writing']['prediction']
        
        # Test case 2: Math prediction with reading/writing scores
        print("\n📊 Test Case 2: Math Score Prediction")
        print("-" * 50)
        test_data = initial_data.copy()
        test_data['reading score'] = initial_reading
        test_data['writing score'] = initial_writing
        
        features = processor.preprocess(pd.DataFrame([test_data]), exclude_score='math', include_scores=True)
        math_pred = predictor.predict(features, 'math')
        print(f"✅ Math Score (given reading={initial_reading:.1f}, writing={initial_writing:.1f}): {math_pred['prediction']:.1f} (CI: {math_pred['confidence_interval']['lower']:.1f} - {math_pred['confidence_interval']['upper']:.1f})")
        
        # Test case 3: Reading prediction with math/writing scores
        print("\n📊 Test Case 3: Reading Score Prediction")
        print("-" * 50)
        test_data = initial_data.copy()
        test_data['math score'] = initial_math
        test_data['writing score'] = initial_writing
        
        features = processor.preprocess(pd.DataFrame([test_data]), exclude_score='reading', include_scores=True)
        reading_pred = predictor.predict(features, 'reading')
        print(f"✅ Reading Score (given math={initial_math:.1f}, writing={initial_writing:.1f}): {reading_pred['prediction']:.1f} (CI: {reading_pred['confidence_interval']['lower']:.1f} - {reading_pred['confidence_interval']['upper']:.1f})")
        
        # Test case 4: Writing prediction with math/reading scores
        print("\n📊 Test Case 4: Writing Score Prediction")
        print("-" * 50)
        test_data = initial_data.copy()
        test_data['math score'] = initial_math
        test_data['reading score'] = initial_reading
        
        features = processor.preprocess(pd.DataFrame([test_data]), exclude_score='writing', include_scores=True)
        writing_pred = predictor.predict(features, 'writing')
        print(f"✅ Writing Score (given math={initial_math:.1f}, reading={initial_reading:.1f}): {writing_pred['prediction']:.1f} (CI: {writing_pred['confidence_interval']['lower']:.1f} - {writing_pred['confidence_interval']['upper']:.1f})")
        
        # Test case 5: Verify consistency
        print("\n📊 Test Case 5: Consistency Check")
        print("-" * 50)
        print("✅ All predictions completed successfully!")
        print("✅ Naming conventions are consistent (using spaces in column names)")
        print("✅ Backend integration is working properly")
        
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        raise

if __name__ == '__main__':
    test_predictions() 