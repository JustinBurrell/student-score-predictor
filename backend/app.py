from flask import Flask, request, jsonify
from model.predictor import MathScorePredictor
from utils.data_processor import DataProcessor

app = Flask(__name__)

# Initialize ML components
data_processor = DataProcessor()
predictor = MathScorePredictor()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Service is running"})

@app.route('/predict', methods=['POST'])
def predict_math_score():
    try:
        # Get input data from request
        input_data = request.get_json()
        
        # Preprocess input data
        processed_data = data_processor.preprocess(input_data)
        
        # Get prediction
        prediction = predictor.predict(processed_data)
        
        return jsonify({
            "success": True,
            "predicted_math_score": prediction,
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
        predictor.train()
        return jsonify({
            "success": True,
            "message": "Model retrained successfully"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
