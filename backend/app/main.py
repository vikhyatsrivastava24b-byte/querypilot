from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_query, routes_research, routes_schema, routes_projects
from app.database import engine
from app import models

# Create database tables via SQLAlchemy
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="QueryPilot API",
    description="AI-powered natural-language business analytics platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_schema.router, prefix="/api/schema", tags=["schema"])
app.include_router(routes_query.router, prefix="/api/query", tags=["query"])
app.include_router(routes_research.router, prefix="/api/research", tags=["research"])
app.include_router(routes_projects.router, prefix="/api/projects", tags=["projects"])

@app.get("/")
def root():
    return {"message": "QueryPilot API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}