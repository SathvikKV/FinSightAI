import os
import json
from tqdm import tqdm
from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
import tiktoken

# --- Load environment variables ---
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path, override=True)

with open(".env", "r") as f:
    print("[DEBUG] .env contents:")
    print(f.read())

# --- Config ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")
INDEX_NAME = "finsight-index"
MAX_TOKENS = 8000

# --- Debugging: print partial keys to verify ---
print(f"[DEBUG] OPENAI_API_KEY starts with: {OPENAI_API_KEY[:15]}")
print(f"[DEBUG] Pinecone ENV: {PINECONE_ENV}")

# --- Init OpenAI + Tokenizer ---
client = OpenAI(api_key=OPENAI_API_KEY)
tokenizer = tiktoken.encoding_for_model("text-embedding-ada-002")

def truncate_to_max_tokens(text, max_tokens):
    tokens = tokenizer.encode(text)
    if len(tokens) > max_tokens:
        print(f"[WARN] Truncating from {len(tokens)} to {max_tokens} tokens")
        tokens = tokens[:max_tokens]
    return tokenizer.decode(tokens)

# --- Init Pinecone client ---
pc = Pinecone(api_key=PINECONE_API_KEY)

if INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=INDEX_NAME,
        dimension=1536,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=PINECONE_ENV)
    )

index = pc.Index(INDEX_NAME)

# --- Load chunks ---
chunks_path = "data/chunks/chunks.jsonl"
print(f"[INFO] Loading chunks from {chunks_path}")

with open(chunks_path, "r", encoding="utf-8") as f:
    chunks = [json.loads(line) for line in f if json.loads(line).get("text")]

print(f"[INFO] Loaded {len(chunks)} chunks")

# --- Embedding helper ---
def get_embedding(text):
    print(f"[DEBUG] Getting embedding for text of length {len(text)}")
    response = client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

def sanitize_id(text):
    return ''.join(c if c.isalnum() or c in ['-', '_'] else '_' for c in text)
# --- Index in Pinecone ---
batch_size = 50
to_upsert = []

print(f"[INFO] Indexing {len(chunks)} chunks...")

for i, chunk in enumerate(tqdm(chunks)):
    try:
        print(f"[DEBUG] Processing chunk {i} — {chunk['company']} | {chunk['item_number']}")
        text = chunk["text"]
        truncated_text = truncate_to_max_tokens(text, MAX_TOKENS)

        metadata = {
    "company": chunk["company"],
    "form_type": chunk["form_type"],
    "filing_date": chunk["filing_date"],
    "item_number": chunk["item_number"],
    "text": chunk["text"][:1000]  # truncate long texts to avoid Pinecone 40KB metadata limit
}

        embedding = get_embedding(truncated_text)
        uid = sanitize_id(f"{chunk['company']}_{chunk['filing_date']}_{chunk['item_number']}_{chunk['chunk_id']}")
        to_upsert.append((uid, embedding, metadata))

        if len(to_upsert) >= batch_size:
            print(f"[DEBUG] Upserting batch of size {len(to_upsert)}")
            index.upsert(vectors=to_upsert)
            to_upsert = []

    except Exception as e:
        print(f"[ERROR] Chunk {i} failed: {e}")

if to_upsert:
    print(f"[DEBUG] Upserting final batch of size {len(to_upsert)}")
    index.upsert(vectors=to_upsert)

print("[INFO] Done embedding + indexing.")
