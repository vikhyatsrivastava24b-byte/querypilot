from fastapi import FastAPI
from app.api.routes_query import router as query_router
from app.database import get_connection

app = FastAPI(title="QueryPilot API")

app.include_router(query_router)

@app.get("/")
def root():
    return {"message": "QueryPilot API is running"}

@app.get("/health")
def health_check():
    connection = get_connection()
    connection.close()
    return {"status": "healthy", "database": "connected"}