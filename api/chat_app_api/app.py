from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False


@app.errorhandler(404)
def resource_not_found(err):
    return jsonify(error=str(err)), 404


@app.route('/ping', methods=['GET', 'POST'])
def ping():
    return "pong", 200
