from pydantic import BaseModel
from typing import List, Optional

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5
    form_type: Optional[str] = None

class MatchResult(BaseModel):
    id: str
    score: float
    metadata: dict
    text: str

class QueryResponse(BaseModel):
    results: List[MatchResult]

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    confirm_password: str

class LoginRequest(BaseModel):
    username: str
    password: str
