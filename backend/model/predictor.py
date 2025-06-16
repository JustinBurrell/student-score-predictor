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
        self.initial_models = {}  # Models for initial predictions without scores
        self.model_dir = Path(__file__).parent / "saved_models"
        self.poly = PolynomialFeatures(degree=2, include_bias=False)
        
        # Fit polynomial features with dummy data for two scores
        dummy_data = np.array([[0.5, 0.5]])  # Two score features
        self.poly.fit(dummy_data)
        
        self.load_models()
    
    def load_models(self):
        """Load all trained models if they exist, otherwise create new ones"""
        self.model_dir.mkdir(parents=True, exist_ok=True)
        
        for score_type in self.VALID_SCORE_TYPES:
            model_path = self.model_dir / f"{score_type}_score_model.joblib"
            initial_model_path = self.model_dir / f"{score_type}_score_initial_model.joblib"
            
            if model_path.exists():
                try:
                    self.models[score_type] = joblib.load(model_path)
                except Exception as e:
                    print(f"Error loading {score_type} model: {e}")
                    self.models[score_type] = RandomForestRegressor()
            else:
                self.models[score_type] = RandomForestRegressor()
                
            if initial_model_path.exists():
                try:
                    self.initial_models[score_type] = joblib.load(initial_model_path)
                except Exception as e:
                    print(f"Error loading {score_type} initial model: {e}")
                    self.initial_models[score_type] = RandomForestRegressor()
            else:
                self.initial_models[score_type] = RandomForestRegressor()
    
    def train(self, score_type, data_path="../data/StudentsPerformance.csv"):
        """Train a specific score prediction model with hyperparameter tuning"""
        if score_type not in self.VALID_SCORE_TYPES:
            raise ValueError(f"Invalid score type. Must be one of {self.VALID_SCORE_TYPES}")
            
        try:
            from utils.data_processor import DataProcessor
            
            # Load and prepare data
            df = pd.read_csv(data_path)
            
            # Train initial model without score features
            processor = DataProcessor()
            X_initial = processor.preprocess(df, exclude_score=score_type, include_scores=False)
            y = df[f'{score_type} score']
            
            # Define hyperparameter grid for initial model
            param_grid = {
                'n_estimators': [100, 200],
                'max_depth': [10, None],
                'min_samples_split': [2, 5],
                'min_samples_leaf': [1, 2],
                'max_features': ['sqrt', None]
            }
            
            # Train initial model
            grid_search_initial = GridSearchCV(
                RandomForestRegressor(random_state=42),
                param_grid,
                cv=5,
                scoring='r2',
                n_jobs=-1
            )
            grid_search_initial.fit(X_initial, y)
            self.initial_models[score_type] = grid_search_initial.best_estimator_
            
            # Save initial model
            initial_model_path = self.model_dir / f"{score_type}_score_initial_model.joblib"
            joblib.dump(self.initial_models[score_type], initial_model_path)
            
            # Train full model with score features
            X = processor.preprocess(df, exclude_score=score_type, include_scores=True)
            
            # Add polynomial features for score columns
            other_scores = [s for s in self.VALID_SCORE_TYPES if s != score_type]
            score_values = df[[f'{s} score' for s in other_scores]].values
            poly_features = self.poly.transform(score_values)
            
            # Add polynomial features to the feature set
            for i in range(poly_features.shape[1]):
                X[f'poly_{i}'] = poly_features[:, i]
            
            # Define hyperparameter grid for full model
            param_grid = {
                'n_estimators': [100, 200, 300],
                'max_depth': [10, 20, None],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4],
                'max_features': ['sqrt', 'log2', None]
            }
            
            # Train full model
            grid_search = GridSearchCV(
                RandomForestRegressor(random_state=42),
                param_grid,
                cv=5,
                scoring='r2',
                n_jobs=-1
            )
            grid_search.fit(X, y)
            self.models[score_type] = grid_search.best_estimator_
            
            # Save full model
            model_path = self.model_dir / f"{score_type}_score_model.joblib"
            joblib.dump(self.models[score_type], model_path)
            
            # Get cross-validation scores for both models
            cv_scores_initial = cross_val_score(
                self.initial_models[score_type], 
                X_initial, y, 
                cv=5, 
                scoring='r2'
            )
            
            cv_scores = cross_val_score(
                self.models[score_type], 
                X, y, 
                cv=5, 
                scoring='r2'
            )
            
            # Get feature importance for both models
            feature_importance_initial = dict(zip(X_initial.columns, 
                                               self.initial_models[score_type].feature_importances_))
            
            feature_importance = dict(zip(X.columns, 
                                       self.models[score_type].feature_importances_))
            
            return {
                "initial_model": {
                    "best_params": grid_search_initial.best_params_,
                    "best_score": grid_search_initial.best_score_,
                    "cv_scores": {
                        "mean": cv_scores_initial.mean(),
                        "std": cv_scores_initial.std(),
                        "scores": cv_scores_initial.tolist()
                    },
                    "feature_importance": dict(sorted(
                        feature_importance_initial.items(),
                        key=lambda x: x[1],
                        reverse=True
                    ))
                },
                "full_model": {
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
            
        if self.models[score_type] is None or self.initial_models[score_type] is None:
            raise Exception(f"{score_type} models not trained. Please train the models first.")
        
        try:
            # For the initial prediction without scores, use the initial model
            if not any('score' in col for col in features.columns):
                prediction = self.initial_models[score_type].predict(features)
                return float(prediction[0])
            
            # For predictions with scores, use the full model with polynomial features
            score_columns = [col for col in features.columns if 'score' in col]
            features_with_poly = features.copy()
            
            if score_columns:
                # Get the two other score types
                other_scores = [s for s in self.VALID_SCORE_TYPES if s != score_type]
                score_values = np.zeros((features.shape[0], 2))  # Always use 2 scores
                
                # Fill in available score values
                for i, score in enumerate(other_scores):
                    col_name = f"{score} score"
                    if col_name in features.columns:
                        score_values[:, i] = features[col_name].values
                
                # Generate polynomial features
                poly_features = self.poly.transform(score_values)
                
                # Add polynomial features to the feature set
                for i in range(poly_features.shape[1]):
                    features_with_poly[f'poly_{i}'] = poly_features[:, i]
            
            prediction = self.models[score_type].predict(features_with_poly)
            return float(prediction[0])
            
        except Exception as e:
            raise Exception(f"Error making {score_type} score prediction: {e}")
    
    def predict_all(self, features):
        """Make predictions for all score types"""
        predictions = {}
        for score_type in self.VALID_SCORE_TYPES:
            predictions[score_type] = self.predict(features, score_type)
        return predictions 