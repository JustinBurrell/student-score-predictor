import pandas as pd
from model.predictor import ScorePredictor
from utils.data_processor import DataProcessor

def test_predictions():
    predictor = ScorePredictor()
    processor = DataProcessor()
    
    # Test case 1: Initial prediction (no scores)
    print("\nTest Case 1: Initial Prediction (No Scores)")
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
    print("Initial Predictions (no scores provided):")
    for score_type, score in predictions.items():
        print(f"{score_type.title()} Score: {score:.1f}")
    
    # Store initial predictions for subsequent tests
    initial_math = predictions['math']
    initial_reading = predictions['reading']
    initial_writing = predictions['writing']
    
    # Test case 2: Math prediction with reading/writing scores
    print("\nTest Case 2: Math Score Prediction")
    print("-" * 50)
    test_data = initial_data.copy()
    test_data['reading score'] = initial_reading
    test_data['writing score'] = initial_writing
    features = processor.preprocess(pd.DataFrame([test_data]), exclude_score='math', include_scores=True)
    math_pred = predictor.predict(features, 'math')
    print(f"Math Score (given reading={initial_reading:.1f}, writing={initial_writing:.1f}): {math_pred:.1f}")
    
    # Test case 3: Reading prediction with math/writing scores
    print("\nTest Case 3: Reading Score Prediction")
    print("-" * 50)
    test_data = initial_data.copy()
    test_data['math score'] = initial_math
    test_data['writing score'] = initial_writing
    features = processor.preprocess(pd.DataFrame([test_data]), exclude_score='reading', include_scores=True)
    reading_pred = predictor.predict(features, 'reading')
    print(f"Reading Score (given math={initial_math:.1f}, writing={initial_writing:.1f}): {reading_pred:.1f}")
    
    # Test case 4: Writing prediction with math/reading scores
    print("\nTest Case 4: Writing Score Prediction")
    print("-" * 50)
    test_data = initial_data.copy()
    test_data['math score'] = initial_math
    test_data['reading score'] = initial_reading
    features = processor.preprocess(pd.DataFrame([test_data]), exclude_score='writing', include_scores=True)
    writing_pred = predictor.predict(features, 'writing')
    print(f"Writing Score (given math={initial_math:.1f}, reading={initial_reading:.1f}): {writing_pred:.1f}")

if __name__ == '__main__':
    test_predictions() 