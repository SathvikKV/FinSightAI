import os
import requests
from bs4 import BeautifulSoup
from time import sleep

# Email ID required for polite scraping
HEADERS = {
    "User-Agent": "Sathvik Vadavatha, Northeastern University, sathvik@example.com"
}

OUTPUT_DIR = "data/filings_txt"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 🔁 40 Companies with competitors
TICKER_CIKS = {
    "AAPL": "320193",      # Apple
    "MSFT": "789019",      # Microsoft
    "GOOGL": "1652044",    # Alphabet
    "META": "1326801",     # Meta
    "AMZN": "1018724",     # Amazon
    "TSLA": "1318605",     # Tesla
    "F": "37996",          # Ford (competitor to Tesla)
    "NVDA": "1045810",     # Nvidia
    "AMD": "2488",         # AMD
    "INTC": "50863",       # Intel
    "QCOM": "804328",      # Qualcomm
    "CRM": "1108524",      # Salesforce
    "ORCL": "1341439",     # Oracle
    "ADBE": "796343",      # Adobe
    "SHOP": "1594805",     # Shopify
    "PYPL": "1633917",     # PayPal
    "SQ": "1512673",       # Block (Cash App)
    "MA": "1141391",       # Mastercard
    "V": "1403161",        # Visa
    "UBER": "1543151",     # Uber
    "LYFT": "1759509",     # Lyft
    "NFLX": "1065280",     # Netflix
    "DIS": "1744489",      # Disney (streaming competitor)
    "WMT": "104169",       # Walmart (Amazon competitor)
    "COST": "909832",      # Costco
    "T": "732717",         # AT&T
    "VZ": "732712",        # Verizon
    "PLTR": "1321655",     # Palantir
    "SNOW": "1640147",     # Snowflake
    "COIN": "1679788",     # Coinbase
    "ROKU": "1428439",     # Roku
    "ZM": "1585521",       # Zoom
    "DOCU": "1261333",     # DocuSign
    "ASML": "937966",      # ASML (semiconductor supplier)
    "TXN": "97476",        # Texas Instruments
    "IBM": "51143",        # IBM
    "INTU": "896878",      # Intuit (TurboTax, QuickBooks)
    "NET": "1477333",      # Cloudflare
    "PANW": "1327567",     # Palo Alto Networks
    "ZS": "1713683"        # Zscaler (cybersecurity)
}

def get_latest_filing_urls(cik, filing_type="10-K", count=3):
    url = f"https://data.sec.gov/submissions/CIK{cik.zfill(10)}.json"
    r = requests.get(url, headers=HEADERS)
    if r.status_code != 200:
        print(f"❌ Error fetching metadata for CIK {cik}")
        return []
    
    filings = r.json()["filings"]["recent"]
    results = []

    for i in range(len(filings["accessionNumber"])):
        if filings["form"][i] == filing_type:
            accession = filings["accessionNumber"][i].replace("-", "")
            doc_name = filings["primaryDocument"][i]
            filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/{doc_name}"
            results.append((filing_url, filings["filingDate"][i]))
            if len(results) >= count:
                break
    return results

def extract_text_from_html(url):
    r = requests.get(url, headers=HEADERS)
    if r.status_code != 200:
        print(f"❌ Failed to download {url}")
        return None

    soup = BeautifulSoup(r.text, "html.parser")
    for tag in soup(["table", "style", "script"]):
        tag.decompose()

    return soup.get_text(separator="\n", strip=True)

def save_text(text, ticker, filing_type, filing_date, url):
    name = url.split("/")[-1].replace(".htm", "")
    filename = f"{ticker}_{filing_type}_{filing_date}_{name}.txt"
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"✅ Saved: {filepath}")

def fetch_filings_for_ticker(ticker, cik, types=["10-K", "10-Q"], count=3):
    for filing_type in types:
        urls = get_latest_filing_urls(cik, filing_type=filing_type, count=count)
        for url, date in urls:
            print(f"📄 Downloading {filing_type} for {ticker} ({date}) → {url}")
            text = extract_text_from_html(url)
            if text:
                save_text(text, ticker, filing_type, date, url)
            sleep(1)

if __name__ == "__main__":
    print(f"🚀 Starting SEC filing fetch for {len(TICKER_CIKS)} companies...\n")
    for ticker, cik in TICKER_CIKS.items():
        fetch_filings_for_ticker(ticker, cik, types=["10-K", "10-Q"], count=3)
        sleep(2)
    print("\n✅ Done fetching all filings.")
