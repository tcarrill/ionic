import os
from .app import app

DB_USER = os.environ['POSTGRES_USER']
DB_PASS = os.environ['POSTGRES_PASSWORD']
DB_HOST = os.environ['POSTGRES_HOST']

app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/chat_app"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
