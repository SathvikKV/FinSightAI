import bcrypt
from jose import jwt
import os
from dotenv import load_dotenv
from app.openai_client import client

load_dotenv()

JWT_SECRET = os.getenv("SECRET_KEY")
JWT_ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(username: str) -> str:
    payload = {"sub": username}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_query_embedding(text: str):
    """Generate an OpenAI embedding for the given text."""
    response = client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding