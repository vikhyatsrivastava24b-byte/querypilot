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

    try:
        result = execute_safe_query(sql)
    except ValueError as error:
        corrected_sql = correct_sql(question, sql, str(error))
        result = execute_safe_query(corrected_sql)
        sql = corrected_sql

    return {
        "question": question,
        "sql": sql,
        "result": result,
    }