from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

reservations = []  # 서버 시작 시 예약 내역 초기화

@app.route('/reserve', methods=['POST'])
def reserve():
    data = request.json
    # id 자동 생성
    data['id'] = str(uuid.uuid4())
    reservations.append(data)
    return jsonify({"result": "success", "id": data['id']})

@app.route('/reservations', methods=['GET'])
def get_reservations():
    return jsonify(reservations)

@app.route('/reserve/<id>', methods=['PUT'])
def update_reservation(id):
    data = request.json
    for r in reservations:
        if r.get('id') == id:
            r.update(data)
            return jsonify({"result": "success"})
    return jsonify({"error": "not found"}), 404

@app.route('/reserve/<id>', methods=['DELETE'])
def delete_reservation(id):
    global reservations
    before = len(reservations)
    reservations = [r for r in reservations if r.get('id') != id]
    if len(reservations) < before:
        return jsonify({"result": "success"})
    else:
        return jsonify({"error": "not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 