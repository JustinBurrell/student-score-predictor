import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import PolynomialFeatures
from pathlib import Path

class ScorePredictor:
    VALID_SCORE_TYPES = ['math', 'reading', 'writing']
    
    def __init__(self):
        self.models = {}
        self.model_dir = Path(__file__).parent / "saved_models"
        self.poly = PolynomialFeatures(degree=2, include_bias=False)
        self.load_models()
    
    def load_models(self):
        """Load all trained models if they exist, otherwise create new ones"""
        self.model_dir.mkdir(parents=True, exist_ok=True)
        
        for score_type in self.VALID_SCORE_TYPES:
            model_path = self.model_dir / f"{score_type}_score_model.joblib"
            if model_path.exists():
                try:
                    self.models[score_type] = joblib.load(model_path)
                except Exception as e:
                    print(f"Error loading {score_type} model: {e}")
                    self.models[score_type] = RandomForestRegressor()
            else:
                self.models[score_type] = RandomForestRegressor()
    
    def train(self, score_type, data_path="../data/StudentsPerformance.csv"):
        """Train a specific score prediction model with hyperparameter tuning"""
        if score_type not in self.VALID_SCORE_TYPES:
            raise ValueError(f"Invalid score type. Must be one of {self.VALID_SCORE_TYPES}")
            
        try:
            from utils.data_processor import DataProcessor
            
            # Load and prepare data
            df = pd.read_csv(data_path)
            
            # Preprocess features
            processor = DataProcessor()
            X = processor.preprocess(df, exclude_score=score_type)
            y = df[f'{score_type} score']
            
            # Add polynomial features for score columns
            score_columns = [col for col in X.columns if 'score' in col]
            if score_columns:
                score_features = X[score_columns]
                poly_features = self.poly.fit_transform(score_features)
                poly_feature_names = [f'poly_{i}' for i in range(poly_features.shape[1])]
                X = pd.concat([
                    X,
                    pd.DataFrame(poly_features[:, len(score_columns):], 
                               columns=poly_feature_names[len(score_columns):],
                               index=X.index)
                ], axis=1)
            
            # Define hyperparameter grid
            param_grid = {
                'n_estimators': [100, 200, 300],
                'max_depth': [10, 20, None],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4],
                'max_features': ['sqrt', 'log2', None]
            }
            
            # Perform grid search with cross-validation
            grid_search = GridSearchCV(
                RandomForestRegressor(random_state=42),
                param_grid,
                cv=5,
                scoring='r2',
                n_jobs=-1
            )
            
            # Fit the grid search
            grid_search.fit(X, y)
            
            # Get best model
            self.models[score_type] = grid_search.best_estimator_
            
            # Save model
            model_path = self.model_dir / f"{score_type}_score_model.joblib"
            joblib.dump(self.models[score_type], model_path)
            
            # Perform cross-validation with best model
            cv_scores = cross_val_score(
                self.models[score_type], 
                X, y, 
                cv=5, 
                scoring='r2'
            )
            
            # Get feature importance
            feature_importance = dict(zip(X.columns, 
                                       self.models[score_type].feature_importances_))
            
            return {
                "best_params": grid_search.best_params_,
                "best_score": grid_search.best_score_,
                "cv_scores": {
                    "mean": cv_scores.mean(),
                    "std": cv_scores.std(),
                    "scores": cv_scores.tolist()
                },
                "feature_importance": dict(sorted(
                    feature_importance.items(),
                    key=lambda x: x[1],
                    reverse=True
                ))
            }
            
        except Exception as e:
            raise Exception(f"Error training {score_type} model: {e}")
    
    def train_all(self, data_path="../data/StudentsPerformance.csv"):
        """Train all score prediction models"""
        results = {}
        for score_type in self.VALID_SCORE_TYPES:
            results[score_type] = self.train(score_type, data_path)
        return results
    
    def predict(self, features, score_type):
        """Make predictions using the trained model for a specific score type"""
        if score_type not in self.VALID_SCORE_TYPES:
            raise ValueError(f"Invalid score type. Must be one of {self.VALID_SCORE_TYPES}")
            
        if self.models[score_type] is None:
            raise Exception(f"{score_type} model not trained. Please train the model first.")
        
        try:
            # Add polynomial features if needed
            score_columns = [col for col in features.columns if 'score' in col]
            if score_columns:
                score_features = features[score_columns]
                poly_features = self.poly.transform(score_features)
                poly_feature_names = [f'poly_{i}' for i in range(poly_features.shape[1])]
                features = pd.concat([
                    features,
                    pd.DataFrame(poly_features[:, len(score_columns):], 
                               columns=poly_feature_names[len(score_columns):],
                               index=features.index)
                ], axis=1)
            
            # Make prediction
            prediction = self.models[score_type].predict(features)
            return float(prediction[0])  # Return single prediction value
            
        except Exception as e:
            raise Exception(f"Error making {score_type} score prediction: {e}")
    
    def predict_all(self, features):
        """Make predictions for all score types"""
        predictions = {}
        for score_type in self.VALID_SCORE_TYPES:
            predictions[score_type] = self.predict(features, score_type)
        return predictions 