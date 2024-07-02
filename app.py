from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app) 

# Load the JSON data from the file
with open('data.json', 'r') as json_file:
    data = json.load(json_file)

@app.route('/data')
def get_data():
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
