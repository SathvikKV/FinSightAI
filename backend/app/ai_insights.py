# app/ai_insights.py
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from openai import OpenAIError
from app.pinecone_utils import index
from app.openai_client import client
from app.utils import get_query_embedding

router = APIRouter()

@router.post("/compare_companies")
def compare_companies(
    company_a: str = Query(...),
    company_b: str = Query(...),
    form_type: Optional[str] = Query(None),
    top_k: int = Query(5)
):
    try:
        # Step 1: Get query embeddings
        embedding_a = get_query_embedding(company_a)
        embedding_b = get_query_embedding(company_b)

        # Step 2: Build filters
        filter_a = {"company": {"$eq": company_a.upper()}}
        filter_b = {"company": {"$eq": company_b.upper()}}
        if form_type:
            filter_a["form_type"] = {"$eq": form_type}
            filter_b["form_type"] = {"$eq": form_type}

        # Step 3: Query Pinecone
        results_a = index.query(vector=embedding_a, top_k=top_k, include_metadata=True, filter=filter_a)
        results_b = index.query(vector=embedding_b, top_k=top_k, include_metadata=True, filter=filter_b)

        # Step 4: Build context strings
        context_a = "\n\n".join([m["metadata"].get("text", "") for m in results_a["matches"]])
        context_b = "\n\n".join([m["metadata"].get("text", "") for m in results_b["matches"]])

        # Step 5: Prompt for structured output
        prompt = f"""
Using the below SEC excerpts, extract three separate sections:

### [COMPANY_A_DETAILS]
Write 3–5 bullet points summarizing the financial strategy, risks, and major investments of Company A ({company_a}).

### [COMPANY_B_DETAILS]
Write 3–5 bullet points summarizing the financial strategy, risks, and major investments of Company B ({company_b}).

### [COMPARISON_SUMMARY]
Provide a brief comparative analysis highlighting similarities or differences between the two.
        
### Company A Context:
{context_a}

### Company B Context:
{context_b}
        """

        # Step 6: Call GPT
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        full_output = response.choices[0].message.content.strip()

        # Step 7: Extract sections using anchors
        import re

        def extract_between(tag: str, text: str) -> str:
            pattern = rf"### \[{tag}\](.*?)(?=### |\Z)"
            match = re.search(pattern, text, re.DOTALL)
            return match.group(1).strip() if match else ""

        return {
            "company_a_details": extract_between("COMPANY_A_DETAILS", full_output),
            "company_b_details": extract_between("COMPANY_B_DETAILS", full_output),
            "comparison_summary": extract_between("COMPARISON_SUMMARY", full_output)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/company_financials_chart")
def company_financials_chart(
    company: str,
    metric: str = Query("revenue"),
    form_type: str = Query("10-K"),
    top_k: int = Query(5),
):
    try:
        # Step 1: Embed query (company + metric)
        query_text = f"{company} {metric} trend"
        embedding = get_query_embedding(query_text)

        # Step 2: Query Pinecone
        pinecone_filter = {
            "company": {"$eq": company.upper()},
            "form_type": {"$eq": form_type}
        }

        results = index.query(
            vector=embedding,
            top_k=top_k,
            include_metadata=True,
            filter=pinecone_filter,
        )

        context = "\n\n".join([m["metadata"].get("text", "") for m in results["matches"]])

        # Step 3: Ask GPT to extract year-value trend
        prompt = f"""
You are a financial assistant. Based on the SEC filing excerpts below, extract a year-wise trend of '{metric}' for {company}. 
Output JSON array only with this format:

[
  {{"date": "2022", "value": 123.4}},
  ...
]

If data is missing or unclear, skip that year.

SEC Filing Excerpts:
{context}
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )

        import json
        raw = response.choices[0].message.content.strip()

        # Try to parse JSON from response
        try:
            chart_data = json.loads(raw)
        except json.JSONDecodeError:
            chart_data = []

        return {"metric": metric, "data": chart_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/insight_spotlight")
def get_insight_spotlight(
    company: str = Query(..., description="Ticker of the company, e.g., AAPL"),
    form_type: str = Query("10-K"),
    top_k: int = Query(10)
):
    try:
        # Step 1: Define query and get its embedding
        generic_query = f"Recent strategic insights, risks, and innovations from {company}'s {form_type} filings"
        embedding = get_query_embedding(generic_query)

        # Step 2: Filter Pinecone by company
        pinecone_filter = {
            "company": {"$eq": company.upper()},
            "form_type": {"$eq": form_type}
        }

        results = index.query(
            vector=embedding,
            top_k=top_k,
            include_metadata=True,
            filter=pinecone_filter,
        )

        # Step 3: Build context
        context = "\n\n".join([m["metadata"].get("text", "") for m in results["matches"]])

        if not context.strip():
            return {"insights": [f"No insights found for {company} in recent {form_type} filings."]}

        # Step 4: Prompt GPT
        prompt = f"""
You are an expert SEC analyst.

From the following excerpts of {company}'s {form_type} filings, extract 5 SPECIFIC and QUANTITATIVE insights. 
Each insight should include:

- A specific business initiative or strategic focus
- Specific financial figures or metrics (e.g., revenue growth %, R&D spend, cost optimization savings)
- Clear mention of expansion plans, product launches, risks, regulatory issues, or operational metrics.

Avoid repeating the company mission statements or vague goals.
Focus ONLY on tangible, reportable actions, financial data, or critical risks/opportunities.

Respond ONLY with bullet points like:
- Insight 1 (quantitative or factual)
- Insight 2 (quantitative or factual)
...

### SEC Filing Excerpts:
{context}
"""


        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        raw_output = response.choices[0].message.content.strip()
        insights = [line.lstrip("•- ").strip() for line in raw_output.split("\n") if line.strip()]
        return {"insights": insights[:5]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/theme_analysis")
def theme_analysis(
    theme: str = Query(..., description="Theme to analyze, e.g., AI risk, climate change"),
    form_type: str = Query("10-K"),
    top_k: int = Query(10)
):
    try:
        # Step 1: Build a more precise query for embeddings
        query_text = f"Discussion around {theme} in {form_type} SEC filings across companies"
        embedding = get_query_embedding(query_text)

        # Step 2: Search Pinecone for top documents
        pinecone_filter = {"form_type": {"$eq": form_type}}

        results = index.query(
            vector=embedding,
            top_k=top_k,
            include_metadata=True,
            filter=pinecone_filter
        )

        context = "\n\n".join([m["metadata"].get("text", "") for m in results["matches"]])

        if not context.strip():
            return {"analysis": f"No relevant discussions found around '{theme}' in recent {form_type} filings."}

        # Step 3: Strong, analytical prompt
        prompt = f"""
You are a professional SEC analyst.

Based on the following excerpts from multiple companies' {form_type} filings, analyze **how the theme '{theme}' is discussed**, including:

- Common concerns or risks associated with the theme
- Strategic initiatives or investments related to the theme
- Regulatory challenges mentioned
- Financial impact disclosures (if any)

Structure the answer with:
- A short executive summary (2-3 sentences)
- 3 to 5 bullet points highlighting key points
- Mention company names if possible based on context.

Use a clear, analytical, and professional tone.

### Filing Excerpts:
{context}
"""

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        return {"analysis": response.choices[0].message.content.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))