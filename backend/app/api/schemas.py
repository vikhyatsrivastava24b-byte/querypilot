from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# ==========================================
# Phase 1 Legacy (SQL Data)
# ==========================================
class QueryRequest(BaseModel):
    question: str = Field(..., min_length=3, description="Natural language question about the database")
    chat_history: Optional[list[dict]] = Field(default=[], description="Previous user/assistant messages for context")


class ExecuteSqlRequest(BaseModel):
    sql: str = Field(..., description="Raw SQL query to execute")


# ==========================================
# Phase 2 Research Platform
# ==========================================
class ResearchAnalyzeRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Vague user query to analyze")


class QueryUnderstanding(BaseModel):
    intent: str = Field(description="Main intent, e.g. Product Evaluation")
    topic: str = Field(description="Core topic")
    budget: Optional[str] = Field(None, description="Extracted budget if any")
    purpose: Optional[str] = Field(None, description="Underlying objective")


class QueryAnalysisResponse(BaseModel):
    understanding: QueryUnderstanding
    missing_information: List[str] = Field(description="Questions to clarify the need")
    improved_query: str = Field(description="The highly specific, improved research query")
    research_plan: List[str] = Field(description="Step by step plan to research the topic")

class ExecuteSearchRequest(BaseModel):
    query: str = Field(..., description="The highly specific, improved query to search")
    plan_steps: List[str] = Field(default=[], description="The research plan steps for context")

class SourceCard(BaseModel):
    title: str
    url: str
    domain: str
    snippet: str
    type: str = Field(description="e.g. Official, Community, Academic, News")

class ExecuteSearchResponse(BaseModel):
    sources: List[SourceCard]


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