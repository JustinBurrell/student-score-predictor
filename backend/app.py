from flask import Flask, request, jsonify
from model.predictor import ScorePredictor
from utils.data_processor import DataProcessor

app = Flask(__name__)

# Initialize ML components
data_processor = DataProcessor()
predictor = ScorePredictor()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Service is running"})

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
        
        # Preprocess input data
        processed_data = data_processor.preprocess(input_data, exclude_score=score_type)
        
        # Get prediction
        prediction = predictor.predict(processed_data, score_type)
        
        return jsonify({
            "success": True,
            f"predicted_{score_type}_score": prediction,
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
        
        # Get predictions for all score types
        predictions = {}
        for score_type in ScorePredictor.VALID_SCORE_TYPES:
            processed_data = data_processor.preprocess(input_data, exclude_score=score_type)
            predictions[f"{score_type}_score"] = predictor.predict(processed_data, score_type)
        
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

if __name__ == '__main__':
    app.run(debug=True, port=5001)
