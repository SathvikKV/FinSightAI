import os
import re

# Directories
RAW_DIR = "data/filings_txt"
CLEAN_DIR = "data/filings_cleaned"
os.makedirs(CLEAN_DIR, exist_ok=True)

def clean_filing(text):
    # Step 1: Normalize line breaks
    text = text.replace('\r', '').replace('\n\n', '\n')

    # Step 2: Try known anchors
    anchors = [
        "UNITED STATES SECURITIES AND EXCHANGE COMMISSION",
        "FORM 10-K",
        "FORM 10-Q",
        "Table of Contents",
        "SPECIAL NOTE REGARDING FORWARD-LOOKING STATEMENTS"
    ]

    for anchor in anchors:
        idx = text.find(anchor)
        if idx != -1:
            return text[idx:].strip()

    # Step 3: Regex fallback: look for "FORM 10-K" or "FORM 10-Q"
    match = re.search(r"FORM\s+(10[-\s]?K|10[-\s]?Q)", text, re.IGNORECASE)
    if match:
        return text[match.start():].strip()

    # Step 4: Nothing found — return empty (we log this)
    return ""

# 🔁 Process all files
for filename in os.listdir(RAW_DIR):
    if not filename.endswith(".txt"):
        continue

    filepath = os.path.join(RAW_DIR, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    cleaned = clean_filing(content)

    if cleaned:
        output_path = os.path.join(CLEAN_DIR, filename)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(cleaned)
        print(f"✅ Cleaned and saved: {filename}")
    else:
        print(f"⚠️ Anchor not found in: {filename}")
