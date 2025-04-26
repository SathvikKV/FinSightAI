import os
from openai import OpenAI
from dotenv import load_dotenv

# Load the .env file from the project root
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path=env_path, override=True)

# Optional debug

with open(env_path, "r") as f:
     print("[DEBUG] .env contents:")
     print(f.read())

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
