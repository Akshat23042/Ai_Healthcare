import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Gemini API key and endpoint
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCz8QXrxp--GZKr6F3q1g6HZESdutBre0o")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

@app.route("/")
def home():
    return "AI Health Risk Assessment Backend is Running"

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        # Extract user inputs from frontend
        age = data.get("age")
        gender = data.get("gender")
        heart_rate = data.get("heartRate", "Not Provided")
        height = data.get("height", "Not Provided")
        weight = data.get("weight", "Not Provided")
        history = data.get("history", "None")
        symptoms = data.get("symptoms")

        # Prompt for Gemini
        prompt = f"""
        You are a healthcare AI. Analyze the following patient data and provide:
        1. Estimated health risk level (Low / Moderate / High)
        2. Likely conditions or health concerns
        3. Personalized advice (tests to consider, when to see a doctor, home remedies, etc.)

        Patient Data:
        - Age: {age}
        - Gender: {gender}
        - Resting Heart Rate: {heart_rate}
        - Height: {height} cm
        - Weight: {weight} kg
        - Medical History: {history}
        - Symptoms: {symptoms}

        Respond in easy-to-understand terms. Do not use * or ** in paragraph for generating text.
        """

        # Gemini API request
        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ]
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()

        gemini_response = response.json()
        message = gemini_response["candidates"][0]["content"]["parts"][0]["text"]

        return jsonify({"analysis": message})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
