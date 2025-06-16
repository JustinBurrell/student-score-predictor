import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from pathlib import Path

class MathScorePredictor:
    def __init__(self):
        self.model = None
        self.model_path = Path(__file__).parent / "saved_models" / "math_score_model.joblib"
        self.load_model()
    
    def load_model(self):
        """Load the trained model if it exists, otherwise create a new one"""
        if self.model_path.exists():
            try:
                self.model = joblib.load(self.model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = RandomForestRegressor()
        else:
            self.model = RandomForestRegressor()
    
    def train(self, data_path="../data/StudentsPerformance_cleaned.csv"):
        """Train the model using the cleaned dataset"""
        try:
            # Load and prepare data
            df = pd.read_csv(data_path)
            
            # Separate features and target
            X = df.drop(['math score', 'math_score_scaled'], axis=1)
            y = df['math score']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train model
            self.model.fit(X_train, y_train)
            
            # Save model
            self.model_path.parent.mkdir(parents=True, exist_ok=True)
            joblib.dump(self.model, self.model_path)
            
            # Calculate and return metrics
            train_score = self.model.score(X_train, y_train)
            test_score = self.model.score(X_test, y_test)
            
            return {
                "train_score": train_score,
                "test_score": test_score
            }
            
        except Exception as e:
            raise Exception(f"Error training model: {e}")
    
    def predict(self, features):
        """Make predictions using the trained model"""
        if self.model is None:
            raise Exception("Model not trained. Please train the model first.")
        
        try:
            # Convert features to DataFrame if needed
            if isinstance(features, dict):
                features = pd.DataFrame([features])
            
            # Make prediction
            prediction = self.model.predict(features)
            
            return prediction[0]  # Return single prediction value
            
        except Exception as e:
            raise Exception(f"Error making prediction: {e}") 