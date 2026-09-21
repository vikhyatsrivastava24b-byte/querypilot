import csv
import io
from datetime import datetime

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.agent.orchestrator import run_query
from app.api.schemas import (
    QueryRequest,
    QueryResponse,
    ExplainRequest,
    ExplainResponse,
    HistoryResponse,
    HistoryItem,
    ExportRequest,
)
from app.llm.nl_answer import generate_nl_answer
from app.llm.sql_explainer import explain_sql


router = APIRouter(prefix="/api", tags=["query"])

# In-memory query history (per server session)
query_history: list[dict] = []
history_counter = 0


@router.get("/query", response_model=QueryResponse)
def query_database_get(
    question: str = Query(..., min_length=3),
):
    """Query the database using a natural language question (GET)."""
    return _process_query(question)


@router.post("/query", response_model=QueryResponse)
def query_database_post(request: QueryRequest):
    """Query the database using a natural language question (POST)."""
    return _process_query(request.question)


@router.get("/history", response_model=HistoryResponse)
def get_query_history():
    """Get the query history for this session."""
    items = [
        HistoryItem(**entry) for entry in reversed(query_history)
    ]
    return HistoryResponse(queries=items)


@router.post("/explain", response_model=ExplainResponse)
def explain_query(request: ExplainRequest):
    """Get a plain-English explanation of a SQL query."""
    try:
        explanation = explain_sql(request.sql, request.question)
        return ExplainResponse(explanation=explanation)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/export/csv")
def export_csv(request: ExportRequest):
    """Export query results as a CSV file."""
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(request.columns)

    for row in request.rows:
        writer.writerow(row)

    output.seek(0)

    filename = f"{request.filename}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
        },
    )


@router.delete("/history")
def clear_history():
    """Clear the query history."""
    global query_history, history_counter
    query_history = []
    history_counter = 0
    return {"message": "History cleared"}


@router.get("/suggestions")
def get_suggestions():
    """Get example questions to help users get started."""
    return {
        "suggestions": [
            "Show me total revenue by product category",
            "Who are the top 5 customers by order value?",
            "How many orders were placed each month in 2025?",
            "What is the average order value by region?",
            "Which products have never been ordered?",
            "Show me the order status breakdown",
            "What are the top 10 most sold products by quantity?",
            "List customers who placed more than 5 orders",
        ]
    }


def _process_query(question: str) -> dict:
    """Core query processing logic shared by GET and POST endpoints."""
    global history_counter

    try:
        result = run_query(question)

        # Generate natural language answer
        nl_answer = None
        try:
            nl_answer = generate_nl_answer(
                question,
                result["sql"],
                result["result"],
            )
        except Exception:
            pass  # NL answer is optional, don't fail the whole query

        result["nl_answer"] = nl_answer

        # Store in history
        history_counter += 1
        query_history.append({
            "id": history_counter,
            "question": question,
            "sql": result["sql"],
            "row_count": result["row_count"],
            "timestamp": datetime.now().isoformat(),
            "tables_used": result["tables_used"],
        })

        return result

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(error)}")