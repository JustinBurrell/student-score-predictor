from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from model.predictor import ScorePredictor
from utils.data_processor import DataProcessor
from functools import lru_cache
import hashlib
import json
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for all routes
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, resources={
    r"/*": {
        "origins": CORS_ORIGINS,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize ML components
data_processor = DataProcessor()
predictor = ScorePredictor()

def get_cache_key(data):
    """Generate a cache key from input data"""
    # Sort the dictionary to ensure consistent keys for same data
    sorted_data = json.dumps(data, sort_keys=True)
    return hashlib.md5(sorted_data.encode()).hexdigest()

@lru_cache(maxsize=1000)
def cached_predict(cache_key, score_type=None):
    """Cached prediction function"""
    # Reconstruct input data from cache key
    try:
        input_data = json.loads(cache_key)
        if score_type:
            processed_data = data_processor.preprocess(input_data, exclude_score=score_type, include_scores='score' in str(input_data))
            return predictor.predict(processed_data, score_type)
        else:
            processed_data = data_processor.preprocess(input_data, exclude_score='math', include_scores=False)
            return predictor.predict_all(processed_data)
    except Exception as e:
        raise Exception(f"Error in cached prediction: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Service is running",
        "model_version": predictor.VERSION
    })

@app.route('/model/metadata', methods=['GET'])
def get_model_metadata():
    """Get model metadata including version, training date, and performance metrics"""
    try:
        metadata = predictor.get_metadata()
        return jsonify({
            "success": True,
            "metadata": metadata
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/model/feature-importance', methods=['GET'])
def get_feature_importance():
    """Get feature importance for all or specific score type"""
    try:
        score_type = request.args.get('score_type')
        importance = predictor.get_feature_importance(score_type)
        return jsonify({
            "success": True,
            "feature_importance": importance
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

@app.route('/predict/<score_type>', methods=['POST'])
def predict_score(score_type):
    if score_type not in ScorePredictor.VALID_SCORE_TYPES:
        return jsonify({
            "success": False,
            "error": f"Invalid score type. Must be one of {ScorePredictor.VALID_SCORE_TYPES}"
        }), 400
    
    try:
        # Get input data from request
        input_data = request.get_json()
        
        # Generate cache key and try to get cached result
        cache_key = json.dumps(input_data, sort_keys=True)
        try:
            result = cached_predict(cache_key, score_type)
        except Exception as e:
            # If cache fails, proceed with normal prediction
            has_scores = any('score' in key for key in input_data.keys())
            processed_data = data_processor.preprocess(input_data, exclude_score=score_type, include_scores=has_scores)
            result = predictor.predict(processed_data, score_type)
        
        return jsonify({
            "success": True,
            f"predicted_{score_type}_score": result['prediction'],
            "confidence_interval": result['confidence_interval'],
            "input_features": input_data
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

@app.route('/predict/all', methods=['POST'])
def predict_all_scores():
    try:
        # Get input data from request
        input_data = request.get_json()
        
        # Generate cache key and try to get cached result
        cache_key = json.dumps(input_data, sort_keys=True)
        try:
            predictions = cached_predict(cache_key)
        except Exception as e:
            # If cache fails, proceed with normal prediction
            processed_data = data_processor.preprocess(input_data, exclude_score='math', include_scores=False)
            predictions = {}
            for score_type in ScorePredictor.VALID_SCORE_TYPES:
                result = predictor.predict(processed_data, score_type)
                predictions[f"{score_type}_score"] = {
                    'prediction': result['prediction'],
                    'confidence_interval': result['confidence_interval']
                }
        
        return jsonify({
            "success": True,
            "predictions": predictions,
            "input_features": input_data
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

@app.route('/model/retrain', methods=['POST'])
def retrain_model():
    try:
        score_type = request.args.get('score_type')
        
        if score_type is None:
            # Retrain all models
            results = predictor.train_all()
            message = "All models retrained successfully"
        elif score_type in ScorePredictor.VALID_SCORE_TYPES:
            # Retrain specific model
            results = {score_type: predictor.train(score_type)}
            message = f"{score_type} model retrained successfully"
        else:
            return jsonify({
                "success": False,
                "error": f"Invalid score type. Must be one of {ScorePredictor.VALID_SCORE_TYPES}"
            }), 400
        
        # Clear prediction cache after retraining
        cached_predict.cache_clear()
        
        return jsonify({
            "success": True,
            "message": message,
            "results": results
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/plots', methods=['GET'])
def list_plots():
    """List all available plot images in static/plots/ as URLs"""
    plots_dir = os.path.join(app.root_path, 'static', 'plots')
    if not os.path.exists(plots_dir):
        return jsonify({"success": True, "plots": []})
    files = [f for f in os.listdir(plots_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.svg'))]
    # Return URLs relative to /static/plots/
    plot_urls = [f"/static/plots/{fname}" for fname in files]
    return jsonify({"success": True, "plots": plot_urls})

@app.route('/debug/files', methods=['GET'])
def debug_files():
    """Debug endpoint to check file system and model loading status"""
    debug_info = {
        "current_working_directory": os.getcwd(),
        "model_dir_exists": False,
        "model_dir_path": "",
        "model_files": [],
        "model_loading_status": {},
        "data_file_exists": False,
        "data_file_path": ""
    }
    
    try:
        # Check model directory
        model_dir = Path(__file__).parent / "model" / "saved_models"
        debug_info["model_dir_path"] = str(model_dir)
        debug_info["model_dir_exists"] = model_dir.exists()
        
        if model_dir.exists():
            debug_info["model_files"] = [f.name for f in model_dir.iterdir() if f.is_file()]
        
        # Check data file
        current_file = Path(__file__).resolve()
        project_root = current_file.parent.parent
        data_path = project_root / "data" / "StudentsPerformance.csv"
        debug_info["data_file_path"] = str(data_path)
        debug_info["data_file_exists"] = data_path.exists()
        
        # Check model loading status
        for score_type in ['math', 'reading', 'writing']:
            model = predictor.models.get(score_type)
            initial_model = predictor.initial_models.get(score_type)
            
            debug_info["model_loading_status"][score_type] = {
                "full_model_fitted": hasattr(model, 'estimators_') and model.estimators_ is not None if model else False,
                "initial_model_fitted": hasattr(initial_model, 'estimators_') and initial_model.estimators_ is not None if initial_model else False,
                "full_model_type": type(model).__name__ if model else None,
                "initial_model_type": type(initial_model).__name__ if initial_model else None,
                "full_model_has_estimators": hasattr(model, 'estimators_') if model else False,
                "initial_model_has_estimators": hasattr(initial_model, 'estimators_') if initial_model else False
            }
        
    except Exception as e:
        debug_info["error"] = str(e)
    
    return jsonify(debug_info)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
