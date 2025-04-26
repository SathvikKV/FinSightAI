import os
from diagrams import Diagram, Cluster, Edge, Node
from diagrams.custom import Custom
from diagrams.onprem.client import Users

# Setup custom icon path
class CustomIcon(Node):
    _provider = "custom"
    _icon_dir = os.path.join(os.path.dirname(__file__), "icons")

# Custom icons
class FastAPI(CustomIcon): _icon = "fastapi.png"
class NextJS(CustomIcon): _icon = "nextjs.png"
class OpenAI(CustomIcon): _icon = "openai.png"
class Pinecone(CustomIcon): _icon = "pinecone.png"
class PostgreSQL(CustomIcon): _icon = "postgresql.png"
class Docker(CustomIcon): _icon = "docker.png"
class AWS(CustomIcon): _icon = "aws.png"
class SEC(CustomIcon): _icon = "sec.png"
class Chunker(CustomIcon): _icon = "chunking.png"
class Embedder(CustomIcon): _icon = "embedding.png"

with Diagram(
    "SEC Filing Analysis Platform - Architecture",
    filename="sec_filing_architecture_clean_ltr",
    outformat="png",
    show=True,
    direction="LR",
    graph_attr={"fontsize": "20", "fontname": "Arial"}
):

    # Input Flow (Left of Container)
    sec_input = SEC("SEC.gov\nFilings")
    chunker = Chunker("Text\nChunking")
    embedder = Embedder("Embedding\n(ada-002)")

    # Output Flow (Right of Container)
    frontend = NextJS("Next.js App")
    aws = AWS("AWS EC2")
    user = Users("User")

    # Docker + Services (Center)
    with Cluster("Docker Container (on EC2)", graph_attr={"margin": "40", "fontsize": "20"}):
        docker_icon = Docker("Docker")

        with Cluster("FastAPI Backend", graph_attr={"fontsize": "18", "margin": "30"}):
            backend = FastAPI("FastAPI")
            pinecone = Pinecone("Pinecone\n(Vector DB)")
            postgres = PostgreSQL("AWS RDS\n(PostgreSQL)")
            openai = OpenAI("OpenAI API\n(RAG + Summaries)")

            # Vector storage from embedder
            embedder >> Edge(label="Store Embeddings", fontsize="16") >> pinecone

            # Backend connections
            backend >> Edge(label="Semantic Search", fontsize="16") >> pinecone
            backend >> Edge(label="RAG Queries", fontsize="16") >> openai
            backend >> Edge(label="User/Auth Data", fontsize="16") >> postgres

        # FastAPI to Frontend
        backend >> Edge(label="Reports, Insights", fontsize="16") >> frontend

    # Final Outputs
    frontend >> Edge(label="Hosted on", fontsize="16") >> aws
    aws >> Edge(label="Serves UI", fontsize="16") >> user

    # Inputs Flow
    sec_input >> Edge(label="Extract", fontsize="16") >> chunker
    chunker >> Edge(label="Chunked Text", fontsize="16") >> embedder
