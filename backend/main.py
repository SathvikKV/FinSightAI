import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path, override=True)

# Import database + models
from app.database import engine  # engine from app/database.py
from app.models import Base      # Base from app/models.py

# Import routers
from app.query import router as query_router
from app.auth import router as auth_router
from app.query_browser import router as query_browser_router

from app.filing_links import router as filing_links_router
from app.ai_insights import router as insights_router

from app import report

# --- FastAPI App ---
app = FastAPI()

# --- Enable CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all during development. Tighten in prod!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Create Tables (if not exists) ---
Base.metadata.create_all(bind=engine)

# --- Include Routers with tags for Swagger grouping ---

# Querying and Search
app.include_router(query_router, tags=["Query"])

# Authentication (Register, Login)
app.include_router(auth_router, tags=["Authentication"])

# Browse SEC filings (filing links)
app.include_router(filing_links_router, tags=["Filing Links"])

# AI Insights (Compare companies, Spotlight, Theme Analysis)
app.include_router(insights_router, tags=["AI Insights"])

# Report Drafting and Saving
app.include_router(report.router, tags=["Report Assistant"])