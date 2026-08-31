from fastapi import FastAPI

from app.database import get_connection

app = FastAPI(title="QueryPilot API")


@app.get("/")
def root():
    return {"message": "QueryPilot API is running"}


@app.get("/health")
def health_check():
    connection = get_connection()
    connection.close()

    return {"status": "healthy", "database": "connected"}