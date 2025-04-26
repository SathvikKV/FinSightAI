from fastapi import APIRouter, HTTPException
from app.schemas import QueryRequest, QueryResponse, MatchResult
from app.openai_client import client
from app.pinecone_utils import index

router = APIRouter()

def get_query_embedding(text: str):
    response = client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

@router.post("/query", response_model=QueryResponse)
def query_index(req: QueryRequest):
    try:
        query_vector = get_query_embedding(req.query)
        filter_criteria = {"form_type": {"$eq": req.form_type}} if req.form_type else {}

        search_result = index.query(
            vector=query_vector,
            top_k=req.top_k,
            include_metadata=True,
            filter=filter_criteria or None
        )

        results = [
            MatchResult(
                id=match["id"],
                score=match["score"],
                metadata=match.get("metadata", {}),
                text=match["metadata"].get("text", "")
            ) for match in search_result["matches"]
        ]

        return QueryResponse(results=results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rag_answer")
def rag_answer(req: QueryRequest):
    try:
        query_vector = get_query_embedding(req.query)
        result = index.query(vector=query_vector, top_k=req.top_k, include_metadata=True)
        context = "\n\n".join([match["metadata"].get("text", "") for match in result["matches"]])

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {req.query}\nAnswer based only on the context above."
            }],
            temperature=0
        )
        return {"answer": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
