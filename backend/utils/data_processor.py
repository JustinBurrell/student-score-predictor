import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from pathlib import Path

class DataProcessor:
    def __init__(self):
        self.scalers = {
            'math': MinMaxScaler(),
            'reading': MinMaxScaler(),
            'writing': MinMaxScaler()
        }
        self.onehot = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
        self.education_order = [
            'some high school',
            'high school',
            'some college',
            "associate's degree",
            "bachelor's degree",
            "master's degree"
        ]
        
        # Load and fit preprocessors with training data
        self._fit_preprocessors()
    
    def _fit_preprocessors(self, data_path="../data/StudentsPerformance.csv"):
        """Fit the preprocessors with training data"""
        try:
            df = pd.read_csv(data_path)
            
            # Fit OneHotEncoder
            nominal_columns = ['gender', 'race/ethnicity', 'lunch', 'test preparation course']
            self.onehot.fit(df[nominal_columns])
            
            # Fit scalers for each score type
            for score_type in ['math', 'reading', 'writing']:
                other_scores = [s for s in ['math', 'reading', 'writing'] if s != score_type]
                self.scalers[score_type].fit(df[[f'{s} score' for s in other_scores]])
            
        except Exception as e:
            print(f"Warning: Could not fit preprocessors with training data: {e}")
    
    def preprocess(self, input_data, exclude_score='math'):
        """
        Preprocess input data for prediction
        exclude_score: The score type being predicted (to exclude from features)
        """
        try:
            # Convert input to DataFrame if it's a dict
            if isinstance(input_data, dict):
                input_data = pd.DataFrame([input_data])
            
            # Create copy to avoid modifying original data
            df = input_data.copy()
            
            # One-hot encoding
            nominal_columns = ['gender', 'race/ethnicity', 'lunch', 'test preparation course']
            onehot_encoded = self.onehot.transform(df[nominal_columns])
            onehot_columns = []
            for i, col in enumerate(nominal_columns):
                feature_names = [f"{col}_{val}" for val in self.onehot.categories_[i]]
                onehot_columns.extend(feature_names)
            
            # Create DataFrame for processed features
            processed_df = pd.DataFrame(index=df.index)
            
            # Add one-hot encoded features
            for i, col in enumerate(onehot_columns):
                processed_df[col] = onehot_encoded[:, i]
            
            # Ordinal encoding for education
            processed_df['parental_education_level'] = pd.Categorical(
                df['parental level of education'],
                categories=self.education_order,
                ordered=True
            ).codes
            
            # Scale other scores (excluding the prediction target)
            other_scores = [s for s in ['math', 'reading', 'writing'] if s != exclude_score]
            if all(f'{s} score' in df.columns for s in other_scores):
                scaled_scores = self.scalers[exclude_score].transform(df[[f'{s} score' for s in other_scores]])
                for i, score_type in enumerate(other_scores):
                    processed_df[f'{score_type}_score_scaled'] = scaled_scores[:, i]
                
                # Calculate and scale average of other scores
                processed_df['avg_other_scores'] = df[[f'{s} score' for s in other_scores]].mean(axis=1)
                
                # Add score difference feature
                if len(other_scores) > 1:
                    processed_df['score_difference'] = df[f'{other_scores[0]} score'] - df[f'{other_scores[1]} score']
                
                # Add score ratio feature
                processed_df['score_ratio'] = df[f'{other_scores[0]} score'] / df[f'{other_scores[1]} score']
            
            # Create advanced interaction features
            processed_df['prep_education_interaction'] = \
                (df['test preparation course'] == 'completed').astype(int) * processed_df['parental_education_level']
                
            # Add lunch-education interaction
            processed_df['lunch_education_interaction'] = \
                (df['lunch'] == 'standard').astype(int) * processed_df['parental_education_level']
            
            # Add gender-preparation interaction
            processed_df['gender_prep_interaction'] = \
                (df['gender'] == 'female').astype(int) * (df['test preparation course'] == 'completed').astype(int)
            
            # Select and order features correctly
            feature_columns = [
                *[f'{s}_score_scaled' for s in other_scores],
                'parental_education_level',
                'avg_other_scores',
                'prep_education_interaction',
                'lunch_education_interaction',
                'gender_prep_interaction'
            ]
            
            if len(other_scores) > 1:
                feature_columns.extend(['score_difference', 'score_ratio'])
            
            feature_columns.extend(onehot_columns)
            
            return processed_df[feature_columns]
            
        except Exception as e:
            raise Exception(f"Error preprocessing data: {e}")
    
    def get_feature_names(self, exclude_score='math'):
        """Return list of expected feature names in correct order"""
        other_scores = [s for s in ['math', 'reading', 'writing'] if s != exclude_score]
        base_features = [
            *[f'{s}_score_scaled' for s in other_scores],
            'parental_education_level',
            'avg_other_scores',
            'prep_education_interaction',
            'lunch_education_interaction',
            'gender_prep_interaction'
        ]
        
        nominal_columns = ['gender', 'race/ethnicity', 'lunch', 'test preparation course']
        onehot_columns = []
        for i, col in enumerate(nominal_columns):
            feature_names = [f"{col}_{val}" for val in self.onehot.categories_[i]]
            onehot_columns.extend(feature_names)
        
        return base_features + onehot_columns 