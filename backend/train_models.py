#!/usr/bin/env python3
"""
Model Training Script for Student Score Predictor
This script trains all models and saves them for deployment
"""

import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = str(Path(__file__).resolve().parent)
sys.path.append(backend_dir)

from model.predictor import ScorePredictor
import time

def train_all_models():
    """Train all models for deployment"""
    print("🚀 Training All Models for Deployment")
    print("=" * 50)
    
    try:
        # Get the absolute path to the data file
        current_file = Path(__file__).resolve()
        project_root = current_file.parent.parent
        data_path = project_root / "data" / "StudentsPerformance.csv"
        
        print(f"📁 Using data file: {data_path}")
        
        # Initialize predictor
        predictor = ScorePredictor()
        
        # Train all models
        print("📊 Training all score prediction models...")
        start_time = time.time()
        
        results = predictor.train_all()
        
        end_time = time.time()
        training_time = end_time - start_time
        
        print(f"✅ All models trained successfully in {training_time:.2f} seconds")
        
        # Print training results
        for score_type, result in results.items():
            print(f"\n📈 {score_type.upper()} Model Results:")
            print(f"   Initial Model R²: {result['initial_model']['best_score']:.3f}")
            print(f"   Full Model R²: {result['full_model']['best_score']:.3f}")
            print(f"   Training Size: {predictor.metadata['training_size']}")
        
        # Print metadata
        print(f"\n📋 Model Metadata:")
        print(f"   Version: {predictor.metadata['version']}")
        print(f"   Last Training: {predictor.metadata['last_training_date']}")
        
        print("\n🎉 Model training completed successfully!")
        print("💡 Models are ready for deployment")
        
        return True
        
    except Exception as e:
        print(f"❌ Error training models: {str(e)}")
        return False

if __name__ == '__main__':
    success = train_all_models()
    sys.exit(0 if success else 1) 