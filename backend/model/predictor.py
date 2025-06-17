import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import PolynomialFeatures, MinMaxScaler
from pathlib import Path
import datetime
import json

class ScorePredictor:
    VALID_SCORE_TYPES = ['math', 'reading', 'writing']
    VERSION = "1.0.0"  # Semantic versioning
    
    def __init__(self, data_path="../data/StudentsPerformance.csv"):
        self.models = {}
        self.initial_models = {}  # Models for initial predictions without scores
        self.model_dir = Path(__file__).parent / "saved_models"
        self.poly = PolynomialFeatures(degree=2, include_bias=False)
        self.score_scaler = MinMaxScaler()
        self.metadata = {
            'version': self.VERSION,
            'last_training_date': None,
            'model_metrics': {},
            'feature_importance': {},
            'training_size': None
        }
        self.metadata_file = self.model_dir / "model_metadata.json"
        
        # Initialize with reasonable score ranges based on data analysis
        self.score_ranges = {
            'math': {'min': 35, 'max': 100},
            'reading': {'min': 35, 'max': 100},
            'writing': {'min': 35, 'max': 100}
        }
        
        # Score correlation constraints (based on data analysis)
        self.max_score_diff = 30  # Maximum allowed difference between scores
        
        # Load metadata if exists
        self._load_metadata()
        
        # Fit score scaler and polynomial features with sample data
        try:
            df = pd.read_csv(data_path)
            score_values = df[['math score', 'reading score', 'writing score']].values
            self.score_scaler.fit(score_values)
            
            # Fit polynomial features with sample data
            sample_scores = score_values[:, :2]  # Use first two scores as sample
            self.poly.fit(sample_scores)
        except Exception as e:
            print(f"Warning: Could not fit preprocessors with training data: {e}")
            # Use dummy data as fallback
            dummy_scores = np.array([[0, 0, 0], [100, 100, 100]])
            self.score_scaler.fit(dummy_scores)
            self.poly.fit(dummy_scores[:, :2])
        
        self.load_models()
    
    def _load_metadata(self):
        """Load model metadata from file"""
        if self.metadata_file.exists():
            try:
                with open(self.metadata_file, 'r') as f:
                    self.metadata = json.load(f)
            except Exception as e:
                print(f"Warning: Could not load metadata: {e}")

    def _save_metadata(self):
        """Save model metadata to file"""
        self.model_dir.mkdir(parents=True, exist_ok=True)
        try:
            with open(self.metadata_file, 'w') as f:
                json.dump(self.metadata, f, indent=2, default=str)
        except Exception as e:
            print(f"Warning: Could not save metadata: {e}")

    def get_metadata(self):
        """Return current model metadata"""
        return self.metadata

    def get_feature_importance(self, score_type=None):
        """Return feature importance for specified score type or all"""
        if score_type:
            if score_type not in self.VALID_SCORE_TYPES:
                raise ValueError(f"Invalid score type. Must be one of {self.VALID_SCORE_TYPES}")
            return self.metadata['feature_importance'].get(score_type, {})
        return self.metadata['feature_importance']

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
            
            # Update training metadata
            self.metadata['last_training_date'] = datetime.datetime.now().isoformat()
            self.metadata['training_size'] = len(df)
            
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
            
            # Get and scale other scores for polynomial features
            other_scores = [s for s in self.VALID_SCORE_TYPES if s != score_type]
            score_values = df[[f'{s} score' for s in other_scores]].values
            
            # Fit and transform score scaler
            self.score_scaler.fit(score_values)
            scaled_scores = self.score_scaler.transform(score_values)
            
            # Create polynomial features from scaled scores
            poly_features = self.poly.fit_transform(scaled_scores)
            
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
            
            # Update metadata with model metrics and feature importance
            self.metadata['model_metrics'][score_type] = {
                'initial_model': {
                    'r2_score': grid_search_initial.best_score_,
                    'cv_scores': {
                        'mean': cv_scores_initial.mean(),
                        'std': cv_scores_initial.std()
                    }
                },
                'full_model': {
                    'r2_score': grid_search.best_score_,
                    'cv_scores': {
                        'mean': cv_scores.mean(),
                        'std': cv_scores.std()
                    }
                }
            }
            
            self.metadata['feature_importance'][score_type] = {
                'initial_model': dict(sorted(feature_importance_initial.items(), key=lambda x: x[1], reverse=True)),
                'full_model': dict(sorted(feature_importance.items(), key=lambda x: x[1], reverse=True))
            }
            
            # Save metadata
            self._save_metadata()
            
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
    
    def _adjust_prediction(self, prediction, score_type, other_scores=None):
        """Adjust prediction based on score constraints and relationships"""
        # Ensure prediction is within valid range
        prediction = np.clip(prediction, 
                           self.score_ranges[score_type]['min'],
                           self.score_ranges[score_type]['max'])
        
        # If we have other scores, apply correlation constraints
        if other_scores:
            other_scores_mean = np.mean(list(other_scores.values()))
            # Limit maximum deviation from other scores
            max_deviation = min(self.max_score_diff, abs(other_scores_mean - prediction))
            if prediction < other_scores_mean - max_deviation:
                prediction = other_scores_mean - max_deviation
            elif prediction > other_scores_mean + max_deviation:
                prediction = other_scores_mean + max_deviation
        
        return prediction
    
    def predict(self, features, score_type):
        """Make predictions using the trained model for a specific score type"""
        if score_type not in self.VALID_SCORE_TYPES:
            raise ValueError(f"Invalid score type. Must be one of {self.VALID_SCORE_TYPES}")
            
        if self.models[score_type] is None or self.initial_models[score_type] is None:
            raise Exception(f"{score_type} models not trained. Please train the models first.")
        
        try:
            # For the initial prediction without scores, use the initial model
            if not any('score' in col for col in features.columns):
                predictions = self.initial_models[score_type].predict(features)
                # Get confidence intervals using tree variance
                trees_predictions = np.array([tree.predict(features) 
                                           for tree in self.initial_models[score_type].estimators_])
                confidence_interval = np.percentile(trees_predictions, [2.5, 97.5], axis=0)
                
                prediction = self._adjust_prediction(predictions[0], score_type)
                ci_lower = self._adjust_prediction(confidence_interval[0][0], score_type)
                ci_upper = self._adjust_prediction(confidence_interval[1][0], score_type)
                
                return {
                    'prediction': prediction,
                    'confidence_interval': {
                        'lower': ci_lower,
                        'upper': ci_upper
                    }
                }
            
            # Get and scale other scores for polynomial features
            other_scores = [s for s in self.VALID_SCORE_TYPES if s != score_type]
            score_values = np.array([[features[f'{s}_score_scaled'].iloc[0] for s in other_scores]])
            
            # Create polynomial features from scaled scores
            poly_features = self.poly.transform(score_values)
            
            # Add polynomial features to the feature set
            features_copy = features.copy()
            for i in range(poly_features.shape[1]):
                features_copy[f'poly_{i}'] = poly_features[0, i]
            
            predictions = self.models[score_type].predict(features_copy)
            
            # Get confidence intervals using tree variance
            trees_predictions = np.array([tree.predict(features_copy) 
                                       for tree in self.models[score_type].estimators_])
            confidence_interval = np.percentile(trees_predictions, [2.5, 97.5], axis=0)
            
            # Get original scores for adjustment
            other_scores_dict = {}
            for s in other_scores:
                score_scaled = features[f'{s}_score_scaled'].iloc[0]
                # Inverse transform to get original score
                original_score = score_scaled * (self.score_ranges[s]['max'] - self.score_ranges[s]['min']) + self.score_ranges[s]['min']
                other_scores_dict[s] = original_score
            
            prediction = self._adjust_prediction(predictions[0], score_type, other_scores_dict)
            ci_lower = self._adjust_prediction(confidence_interval[0][0], score_type, other_scores_dict)
            ci_upper = self._adjust_prediction(confidence_interval[1][0], score_type, other_scores_dict)
            
            return {
                'prediction': prediction,
                'confidence_interval': {
                    'lower': ci_lower,
                    'upper': ci_upper
                }
            }
            
        except Exception as e:
            raise Exception(f"Error making prediction: {e}")
    
    def predict_all(self, features):
        """Make predictions for all score types"""
        predictions = {}
        for score_type in self.VALID_SCORE_TYPES:
            predictions[score_type] = self.predict(features, score_type)
        return predictions 