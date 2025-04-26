import os
import re
import json
from typing import List, Dict

RAW_DIR = "data/filings_cleaned"
OUTPUT_PATH = "data/chunks/chunks.jsonl"
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# Define section patterns for chunking by Items
SECTION_HEADERS = [
    r'Item\s+1[Aa]?\.',        # Business or Risk Factors
    r'Item\s+2\.',             # Properties
    r'Item\s+7[Aa]?\.',        # MD&A
    r'Item\s+8\.',             # Financial Statements
    r'Item\s+9[Aa]?\.'         # Controls and Procedures
]
section_regex = re.compile('|'.join(SECTION_HEADERS))

def split_into_chunks(text: str, max_length: int = 2000, overlap: int = 200) -> List[str]:
    paragraphs = text.split('\n\n')
    chunks = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) < max_length:
            current += para + "\n\n"
        else:
            chunks.append(current.strip())
            current = para + "\n\n"

    if current:
        chunks.append(current.strip())

    # Add overlaps
    overlapped_chunks = []
    for i in range(len(chunks)):
        overlap_text = chunks[i]
        if i > 0:
            overlap_text = chunks[i-1][-overlap:] + " " + chunks[i]
        overlapped_chunks.append(overlap_text.strip())

    return overlapped_chunks

def parse_filename(file_name: str) -> Dict:
    parts = file_name.replace(".txt", "").split("_")
    return {
        "company": parts[0],
        "form_type": parts[1],
        "filing_date": parts[2] if len(parts) > 3 else "unknown"
    }

def process_file(path: str) -> List[Dict]:
    chunks = []
    file_name = os.path.basename(path)
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()

    sections = section_regex.split(text)
    headers = section_regex.findall(text)

    metadata = parse_filename(file_name)

    for i, section in enumerate(sections[1:]):  # skip intro
        header = headers[i] if i < len(headers) else "Unknown"
        sub_chunks = split_into_chunks(section)

        for j, chunk in enumerate(sub_chunks):
            if chunk.strip():
                chunks.append({
                    "company": metadata["company"],
                    "form_type": metadata["form_type"],
                    "filing_date": metadata["filing_date"],
                    "item_number": header,
                    "chunk_id": j,
                    "text": chunk.strip()
                })


    return chunks

# Process all files and write to JSONL
all_chunks = []
for file in os.listdir(RAW_DIR):
    if file.endswith(".txt"):
        file_path = os.path.join(RAW_DIR, file)
        all_chunks.extend(process_file(file_path))

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    for chunk in all_chunks:
        f.write(json.dumps(chunk) + "\n")

print(f"✅ Done! Saved {len(all_chunks)} chunks to {OUTPUT_PATH}")
