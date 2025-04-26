# FinSightAI: SEC Filings Intelligence Platform

<div align="center">
  <img src="https://via.placeholder.com/200x200.png?text=FinSightAI" alt="FinSightAI Logo" width="200"/>
  
  ![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
  ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)
  ![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Latest-38B2AC.svg)
  ![Docker](https://img.shields.io/badge/Docker-Latest-2496ED.svg)
</div>

## 📊 Overview

FinSightAI is an advanced financial intelligence platform that transforms SEC filings into actionable insights through AI-powered analysis. Our platform enables investors, analysts, and financial professionals to search, analyze, compare, and generate reports from SEC company filings using cutting-edge natural language processing and machine learning techniques.

## 🔍 Problem We Solve

Financial professionals struggle with:
- **Information Overload**: Processing hundreds of pages in complex filings
- **Unstructured Data**: Extracting insights from dense, text-heavy documents
- **Difficult Comparisons**: Manually comparing metrics across companies
- **Limited Search Capabilities**: Standard keyword searches miss contextual relationships
- **Report Creation Inefficiency**: Manual extraction and synthesis of financial data

## ✨ Key Features

- **🤖 Intelligent RAG-based Q&A**: Ask natural language questions about SEC filings and receive accurate, context-aware responses
- **🔎 SEC Filing Explorer**: Browse, filter, and navigate filings across 40 companies
- **📈 AI-Powered Insights**: Automated company comparisons, financial metric visualizations, and thematic analyses 
- **📝 Report Generation**: Create, customize, save, and export financial reports in seconds
- **🔒 Secure Authentication**: User-based access control with JWT authentication
- **☁️ Cloud Deployment**: Fully containerized application hosted on AWS

## 🏗️ Architecture

The FinSightAI platform consists of three main components:

```
┌─────────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│ Data Ingestion      │     │ Backend (FastAPI) │     │ Frontend (Next) │
│ ──────────────────  │     │ ────────────────  │     │ ──────────────  │
│ ▶ SEC Scraping      │────▶│ ▶ API Endpoints   │────▶│ ▶ User Interface│
│ ▶ Text Extraction   │     │ ▶ RAG Processing  │     │ ▶ Visualizations│
│ ▶ Chunking          │     │ ▶ Authentication  │     │ ▶ Report Editor │
│ ▶ Vector Embedding  │     │ ▶ Report Gen      │     └─────────────────┘
└─────────────────────┘     └───────────────────┘
        │                            │
        ▼                            ▼
┌─────────────────┐        ┌─────────────────┐
│  Pinecone DB    │        │ PostgreSQL (RDS)│
│  (Vector Store) │        │ (User Data)     │
└─────────────────┘        └─────────────────┘
```

## 🚀 Technologies

- **Backend**: Python 3.12, FastAPI
- **Frontend**: Next.js 14, TailwindCSS, React hooks
- **AI/ML**: OpenAI GPT-3.5/4, text-embedding-ada-002
- **Databases**: Pinecone (vector DB), PostgreSQL (user data)
- **Cloud**: AWS EC2, AWS RDS
- **Containerization**: Docker

## 🔧 Installation & Setup

### Prerequisites

- Docker and Docker Compose
- AWS account (for deployment)
- Pinecone account
- OpenAI API key

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/finsightai.git
   cd finsightai
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Backend API: http://localhost:8000
   - Frontend: http://localhost:3000

## API Documentation

The FinSightAI API provides the following endpoints:

| Category | Endpoint | Description |
|----------|----------|-------------|
| Query | POST /query | Perform semantic search |
| Query | POST /rag_answer | Q&A over SEC filings |
| Auth | POST /register | Register a new user |
| Auth | POST /login | Authenticate a user |
| Files | GET /filing_links | Retrieve filing metadata |
| Insights | POST /compare_companies | Company comparison |
| Insights | POST /company_financials_chart | Financial metrics |
| Insights | GET /insight_spotlight | Strategic spotlights |
| Reports | POST /report_draft | Draft report sections |
| Reports | CRUD /reports | Manage saved reports |

For detailed API documentation, visit `/docs` after starting the backend server.

## Project Structure

```
finsightai/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core functionality
│   │   ├── db/            # Database models
│   │   ├── services/      # Business logic
│   │   └── main.py        # Application entry point
│   ├── Dockerfile         # Backend container definition
│   └── requirements.txt   # Python dependencies
├── frontend/              # Next.js frontend
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── public/            # Static assets
│   ├── Dockerfile         # Frontend container definition
│   └── package.json       # Node dependencies
├── scripts/               # Data ingestion scripts
│   ├── scraper.py         # SEC filing scraper
│   ├── processor.py       # Text processing utilities
│   └── embedding.py       # Vector embedding generator
├── docker-compose.yml     # Development environment
├── .env.example           # Environment variable template
└── README.md              # This file
```

##  Deployment

FinSightAI is designed for deployment on AWS:

1. Configure AWS resources:
   - EC2 instance (t3.large or better recommended)
   - RDS PostgreSQL instance
   - Configure security groups

2. Set up environment variables on EC2

3. Deploy with Docker:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. (Optional) Set up Nginx reverse proxy and SSL

## Future Enhancements

- Expand company coverage to 100+ companies
- Implement advanced semantic chunking strategies
- Add background processing with Celery
- Enhance financial prompting techniques
- Incorporate quantitative financial modeling
- Add user audit trail functionality
- Implement auto-scaling infrastructure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed.

## Contact

Project Lead - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/finsightai](https://github.com/yourusername/finsightai)
