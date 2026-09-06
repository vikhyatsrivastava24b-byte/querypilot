from app.agent.state import QueryState
from app.llm.sql_generator import generate_sql
from app.llm.sql_corrector import correct_sql
from app.rag.schema_context import build_schema_context
from app.rag.schema_retriever import retrieve_schema
from app.sql.executor import execute_safe_query


def run_query(question: str):
    documents = retrieve_schema(question)

    if not documents:
        raise ValueError("Question is not related to the database")

    state = QueryState(
        question=question,
        schema_context=build_schema_context(documents),
        tables_used=[document["table"] for document in documents],
    )

    state.sql = generate_sql(
        state.question,
        state.schema_context,
    )

    max_retries = 1

    while state.retry_count <= max_retries:
        try:
            state.result = execute_safe_query(state.sql)
            break

        except ValueError as error:
            if state.retry_count == max_retries:
                raise

            state.sql = correct_sql(
                state.question,
                state.sql,
                str(error),
            )

            state.retry_count += 1

    return {
        "question": state.question,
        "sql": state.sql,
        "retry_count": state.retry_count,
        "tables_used": state.tables_used,
        "row_count": len(state.result["rows"]),
        "result": state.result,
    }