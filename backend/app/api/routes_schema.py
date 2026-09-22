from fastapi import APIRouter
from app.rag.schema_documents import SCHEMA_DOCUMENTS

router = APIRouter(prefix="/api/schema", tags=["schema"])

@router.get("/")
def get_schema():
    """Return the database schema (tables and columns) for the Schema Explorer."""
    return {"tables": SCHEMA_DOCUMENTS}

