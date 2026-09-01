from fastapi import APIRouter, HTTPException
from app.agent.orchestrator import run_query

router = APIRouter()


@router.get("/query")
def query_database(question: str):
    try:
        return run_query(question)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )