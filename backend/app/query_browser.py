# app/query_browser.py
from fastapi import APIRouter, Query
from app.pinecone_utils import index

router = APIRouter()

@router.get("/filings")
def list_filings(
    company: str = Query(None),
    form_type: str = Query(None),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    # Build metadata filter
    filter_dict = {}
    if company:
        filter_dict["company"] = {"$eq": company.upper()}
    if form_type:
        filter_dict["form_type"] = {"$eq": form_type}
    if start_date or end_date:
        filter_dict["filing_date"] = {}
        if start_date:
            filter_dict["filing_date"]["$gte"] = start_date
        if end_date:
            filter_dict["filing_date"]["$lte"] = end_date

    results = index.query(
        vector=[0.0] * 1536,  # dummy query to retrieve metadata
        top_k=100,
        include_metadata=True,
        filter=filter_dict or None
    )

    return [
        {
            "id": match["id"],
            "metadata": match["metadata"]
        } for match in results["matches"]
    ]
