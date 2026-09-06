from fastapi import APIRouter, HTTPException, Query

from app.agent.orchestrator import run_query
from app.api.schemas import QueryResponse


router = APIRouter()


@router.get("/query", response_model=QueryResponse)
def query_database(
    question: str = Query(..., min_length=3)
):
    try:
        return run_query(question)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))