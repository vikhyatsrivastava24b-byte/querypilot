from app.llm.sql_generator import generate_sql
from app.llm.sql_corrector import correct_sql
from app.rag.schema_context import build_schema_context
from app.rag.schema_retriever import retrieve_schema
from app.sql.executor import execute_safe_query


def run_query(question: str):
    documents = retrieve_schema(question)

    if not documents:
        raise ValueError("Question is not related to the database")

    schema_context = build_schema_context(documents)

    sql = generate_sql(question, schema_context)

    max_retries = 1
    retry_count = 0

    while retry_count <= max_retries:
        try:
            result = execute_safe_query(sql)
            break

        except ValueError as error:
            if retry_count == max_retries:
                raise

            sql = correct_sql(question, sql, str(error))
            retry_count += 1

    return {
        "question": question,
        "sql": sql,
        "retry_count": retry_count,
        "tables_used": [document["table"] for document in documents],
        "row_count": len(result["rows"]),
        "result": result,
    }