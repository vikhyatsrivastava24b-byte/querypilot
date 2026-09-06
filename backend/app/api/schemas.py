from pydantic import BaseModel


class QueryResponse(BaseModel):
    question: str
    sql: str
    retry_count: int
    tables_used: list[str]
    row_count: int
    result: dict