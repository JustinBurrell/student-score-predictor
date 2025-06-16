import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from pathlib import Path

class DataProcessor:
    def __init__(self):
        self.scaler = MinMaxScaler()
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
            
            # Fit MinMaxScaler
            score_columns = ['reading score', 'writing score']
            self.scaler.fit(df[score_columns])
            
        except Exception as e:
            print(f"Warning: Could not fit preprocessors with training data: {e}")
    
    def preprocess(self, input_data):
        """Preprocess input data for prediction"""
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
            
            # Convert one-hot encoded array to DataFrame
            onehot_df = pd.DataFrame(onehot_encoded, columns=onehot_columns, index=df.index)
            
            # Ordinal encoding for education
            df['parental_education_level'] = pd.Categorical(
                df['parental level of education'],
                categories=self.education_order,
                ordered=True
            ).codes
            
            # Scale reading and writing scores
            score_columns = ['reading score', 'writing score']
            df[['reading_score_scaled', 'writing_score_scaled']] = \
                self.scaler.transform(df[score_columns])
            
            # Calculate average reading/writing score
            df['avg_reading_writing'] = df[score_columns].mean(axis=1)
            df['avg_reading_writing_scaled'] = self.scaler.transform(df[['avg_reading_writing']])
            
            # Create prep-education interaction
            df['prep_education_interaction'] = \
                (df['test preparation course'] == 'completed').astype(int) * df['parental_education_level']
            
            # Combine all features
            final_df = pd.concat([
                df[['reading_score_scaled', 'writing_score_scaled', 
                    'parental_education_level', 'avg_reading_writing',
                    'avg_reading_writing_scaled', 'prep_education_interaction']],
                onehot_df
            ], axis=1)
            
            return final_df
            
        except Exception as e:
            raise Exception(f"Error preprocessing data: {e}")
    
    def get_feature_names(self):
        """Return list of expected feature names in correct order"""
        base_features = [
            'reading_score_scaled', 'writing_score_scaled',
            'parental_education_level', 'avg_reading_writing',
            'avg_reading_writing_scaled', 'prep_education_interaction'
        ]
        
        nominal_columns = ['gender', 'race/ethnicity', 'lunch', 'test preparation course']
        onehot_columns = []
        for i, col in enumerate(nominal_columns):
            feature_names = [f"{col}_{val}" for val in self.onehot.categories_[i]]
            onehot_columns.extend(feature_names)
        
        return base_features + onehot_columns 