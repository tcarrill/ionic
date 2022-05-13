import logging
import jwt
from datetime import datetime, timedelta
from functools import wraps
from locale import str
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .models import UserSchema, RoomSchema, User, Room, Message, MessageSchema, db

app = Flask(__name__)
db.init_app(app)
CORS(app)
app.url_map.strict_slashes = False
logging.getLogger('flask_cors').level = logging.DEBUG

user_schema = UserSchema()
users_schema = UserSchema(many=True)
room_schema = RoomSchema()
rooms_schema = RoomSchema(many=True)
message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

USERNAME_MAX = 25
ROOMNAME_MAX = 25

# To handle logouts in a scalable manner this should be some caching server like REDIS or memcached with TTL
invalid_tokens = []


@app.errorhandler(404)
def resource_not_found(err):
    return jsonify(error=str(err)), 404


@app.errorhandler(400)
def bad_request(err):
    return jsonify(error=str(err)), 400


@app.errorhandler(500)
def server_error(err):
    return jsonify(error=str(err)), 500


@app.route('/ping', methods=['GET', 'POST'])
def ping():
    return "pong", 200


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split("Bearer ")[1]
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        if token in invalid_tokens:
            return jsonify({'message': 'Token is not valid, you have logged out'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], "HS256")
            current_user = User.query.filter_by(id=data['id']).first()
        except:
            return jsonify({
                'message': 'Token is invalid'
            }), 401

        return f(current_user, *args, **kwargs)

    return decorated


@app.route('/login', methods=['POST'])
def login():
    content = request.json
    user = User.query.filter_by(username=content['username']).first()

    if not user:
        return make_response(
            'User does not exist',
            401,
            {'WWW-Authenticate': 'Basic realm ="User does not exist"'}
        )

    token = jwt.encode({
        'id': user.id,
        'exp': datetime.utcnow() + timedelta(minutes=30)
    }, app.config['SECRET_KEY'], "HS256")

    return make_response(jsonify({'token': token}), 201)


@app.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    token = request.headers['x-access-token']
    invalid_tokens.append(token)

    return make_response(jsonify({'message': f'{current_user.username} logged out'}), 200)


@app.route('/users', methods=['POST'])
def create_user():
    content = request.json
    if len(content["username"]) > USERNAME_MAX:
        return jsonify({
            "message": f'Username exceeds max length of {USERNAME_MAX}',
        }), 400

    user = User(content["username"])
    db.session.add(user)

    try:
        db.session.commit()
        db.session.refresh(user)
    except IntegrityError:
        return jsonify({
            "message": f'Username {user.username} is taken already',
        }), 400
    except SQLAlchemyError as e:
        return jsonify({
            "message": f'An Error occurred: {e}',
        }), 500

    return jsonify({
            "message": f'Created {user.username}',
        }), 200, 200


@app.route('/users', methods=['GET'])
@token_required
def users(current_user):
    all_users = User.query.all()
    return jsonify(users_schema.dump(all_users)), 200


@app.route('/rooms', methods=['POST'])
@token_required
def create_room(current_user):
    content = request.json
    room = Room(content["name"])
    db.session.add(room)
    try:
        db.session.commit()
        db.session.refresh(room)
    except IntegrityError:
        return jsonify({
            "message": f'Room {room.name} already exists',
        }), 400

    return jsonify({
            "message": f'Created {room.name}',
        }), 200


@app.route('/rooms', methods=['GET'])
@token_required
def rooms(current_user):
    all_rooms = Room.query.all()
    return jsonify(rooms_schema.dump(all_rooms)), 200


@app.route('/rooms/<int:id>', methods=['GET'])
@token_required
def get_room(current_user, id):
    room = Room.query.get(id)
    return jsonify(room_schema.dump(room)), 200


@app.route('/messages', methods=['POST'])
@token_required
def create_message(current_user):
    content = request.json
    message = Message(content['content'], current_user.id, content['room_id'])
    db.session.add(message)
    db.session.commit()
    db.session.refresh(message)
    return jsonify(message_schema.dump(message)), 200


@app.route('/rooms/<int:room_id>/messages', methods=['GET'])
@token_required
def room_messages(current_user, room_id):
    messages = Message.query.filter_by(room_id=room_id).order_by(Message.created.desc()).limit(50)
    return jsonify(messages_schema.dump(messages)), 200
