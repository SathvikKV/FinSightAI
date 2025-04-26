# app/filing_links.py
from fastapi import APIRouter, Query
import requests

router = APIRouter()

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

HEADERS = {
    "User-Agent": "Sathvik Vadavatha, Northeastern University, sathvik@example.com"
}

@router.get("/filing_links")
def get_filing_links(
    ticker: str = Query(...),
    form_type: str = Query("10-K"),
    count: int = Query(3)
):
    cik = TICKER_CIKS.get(ticker.upper())
    if not cik:
        return {"error": "CIK not found for ticker"}

    url = f"https://data.sec.gov/submissions/CIK{cik.zfill(10)}.json"
    r = requests.get(url, headers=HEADERS)

    if r.status_code != 200:
        return {"error": f"Failed to retrieve filings for {ticker}"}

    filings = r.json()["filings"]["recent"]
    results = []

    for i in range(len(filings["accessionNumber"])):
        if filings["form"][i] == form_type:
            accession = filings["accessionNumber"][i].replace("-", "")
            doc_name = filings["primaryDocument"][i]
            filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/{doc_name}"
            results.append({
                "date": filings["filingDate"][i],
                "url": filing_url,
                "title": f"{form_type} Filing ({filings['filingDate'][i]})"
            })
            if len(results) >= count:
                break

    return results
