from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_query import router as query_router
from app.database import get_connection


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

app.include_router(query_router)


@app.get("/")
def root():
    return {"message": "QueryPilot API is running"}


@app.get("/health")
def health_check():
    try:
        connection = get_connection()
        connection.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as error:
        return {"status": "unhealthy", "database": str(error)}