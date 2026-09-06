from dataclasses import dataclass


@dataclass
class QueryState:
    question: str
    schema_context: str = ""
    sql: str = ""
    retry_count: int = 0
    tables_used: list[str] | None = None
    result: dict | None = None