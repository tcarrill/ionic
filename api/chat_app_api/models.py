from datetime import datetime

from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, BigInteger, Column, String, DateTime
from sqlalchemy.orm import relationship

db = SQLAlchemy()
ma = Marshmallow()


class Message(db.Model):
    __tablename__ = 'messages'

    id = Column(BigInteger, primary_key=True)
    content = Column(String)
    created = Column(DateTime)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    room_id = Column(BigInteger, ForeignKey("rooms.id"))

    def __init__(self, content, user_id, room_id):
        self.content = content
        self.user_id = user_id
        self.room_id = room_id
        self.created = datetime.now()

    def __repr__(self):
        return '<Message {}>'.format(self.content)


class MessageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Message
        include_relationships = True
        load_instance = True


class User(db.Model):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True)
    username = Column(String(25), index=True, unique=True)

    def __init__(self, username):
        self.username = username

    def __repr__(self):
        return '<User {}>'.format(self.username)


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User


class Room(db.Model):
    __tablename__ = 'rooms'

    id = Column(BigInteger, primary_key=True)
    name = Column(String(25), unique=True)

    messages = relationship('Message', lazy="joined", order_by="Message.created.desc()")

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Room {}>'.format(self.name)


class RoomSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Room
        include_relationships = True
        load_instance = True

