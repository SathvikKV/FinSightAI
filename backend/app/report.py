from fastapi import APIRouter, Query, HTTPException
from typing import Optional, Dict
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional, List
from app.openai_client import client
from app.pinecone_utils import index
from app.utils import get_query_embedding

router = APIRouter()

# Memory store for demo; replace with database later
REPORT_STORE: Dict[str, dict] = {}


class ReportSection(BaseModel):
    section: str
    content: str

class ReportCreate(BaseModel):
    title: str
    company: str
    form_type: str = "10-K"
    sections: List[ReportSection]

class ReportUpdate(BaseModel):
    title: Optional[str] = None
    sections: Optional[List[ReportSection]] = None

@router.post("/report_draft")
def draft_report_section(
    company: str = Query(...),
    form_type: str = Query("10-K"),
    section: str = Query(..., description="e.g., executive_summary, risks"),
    theme: Optional[str] = Query(None)
):
    try:
        query = f"Write a {section.replace('_', ' ')} based on {company}'s {form_type} filing"
        if theme:
            query += f" focusing on the theme: {theme}"

        embedding = get_query_embedding(query)

        pinecone_filter = {
            "company": {"$eq": company.upper()},
            "form_type": {"$eq": form_type}
        }

        results = index.query(
            vector=embedding,
            top_k=10,
            include_metadata=True,
            filter=pinecone_filter
        )
        context = "\n\n".join([m["metadata"].get("text", "") for m in results["matches"]])

        prompt = f"""
You are a financial analyst writing the "{section.replace('_', ' ').title()}" section of a fintech report based on SEC filings.
Base your response on the context below. Use a professional and concise tone. Include key figures, facts, or risks where available.

### Context:
{context}
        """

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )

        return {
            "section": section,
            "content": response.choices[0].message.content.strip()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reports", summary="Save a full report")
def create_report(report: ReportCreate):
    report_id = str(uuid4())
    REPORT_STORE[report_id] = {
        "id": report_id,
        "title": report.title,
        "company": report.company,
        "form_type": report.form_type,
        "sections": report.sections,
        "created_at": datetime.utcnow().isoformat()  # <--- new
    }
    return {"id": report_id, "message": "Report saved successfully."}


@router.get("/reports/{report_id}", summary="Get a saved report")
def get_report(report_id: str):
    if report_id not in REPORT_STORE:
        raise HTTPException(status_code=404, detail="Report not found")
    return REPORT_STORE[report_id]


@router.put("/reports/{report_id}", summary="Update a report")
def update_report(report_id: str, update: ReportUpdate):
    if report_id not in REPORT_STORE:
        raise HTTPException(status_code=404, detail="Report not found")

    if update.title:
        REPORT_STORE[report_id]["title"] = update.title
    if update.sections:
        REPORT_STORE[report_id]["sections"] = update.sections

    return {"message": "Report updated successfully."}


@router.delete("/reports/{report_id}", summary="Delete a report")
def delete_report(report_id: str):
    if report_id not in REPORT_STORE:
        raise HTTPException(status_code=404, detail="Report not found")
    del REPORT_STORE[report_id]
    return {"message": "Report deleted."}


@router.get("/reports", summary="List all saved reports")
def list_reports():
    return list(REPORT_STORE.values())