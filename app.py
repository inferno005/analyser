from flask import Flask, render_template, request, jsonify
from transformers import pipeline
import pyttsx3
import speech_recognition as sr

app = Flask(__name__)

# Emotion analysis model
emotion_analyzer = pipeline("text-classification", model="bhadresh-savani/bert-base-uncased-emotion")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyzer')
def analyzer():
    return render_template('analyzer.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    text = request.json['text']
    result = emotion_analyzer(text)
    return jsonify(result)

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    recognizer = sr.Recognizer()
    with sr.AudioFile(request.files['audio']) as source:
        audio = recognizer.record(source)
    try:
        text = recognizer.recognize_google(audio)
        return jsonify({"text": text})
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"})
    except sr.RequestError:
        return jsonify({"error": "Could not request results from Google Speech Recognition service"})

if __name__ == '__main__':
    app.run(debug=True)
