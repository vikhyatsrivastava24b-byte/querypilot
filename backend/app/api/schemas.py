from pydantic import BaseModel, Field
from typing import Optional


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=3, description="Natural language question about the database")


class ExecuteSqlRequest(BaseModel):
    sql: str = Field(..., min_length=5, description="Raw SQL query to execute")


class ResultData(BaseModel):
    columns: list[str]
    rows: list[list]


class QueryResponse(BaseModel):
    question: str
    sql: str
    retry_count: int
    tables_used: list[str]
    row_count: int
    result: dict
    nl_answer: Optional[str] = None
    sql_explanation: Optional[str] = None


class ExplainRequest(BaseModel):
    sql: str
    question: str


class ExplainResponse(BaseModel):
    explanation: str


class HistoryItem(BaseModel):
    id: int
    question: str
    sql: str
    row_count: int
    timestamp: str
    tables_used: list[str]


class HistoryResponse(BaseModel):
    queries: list[HistoryItem]


class ErrorResponse(BaseModel):
    detail: str
    error_type: str = "query_error"


class ExportRequest(BaseModel):
    columns: list[str]
    rows: list[list]
    filename: Optional[str] = "query_results"