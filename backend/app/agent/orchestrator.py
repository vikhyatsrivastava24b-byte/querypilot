from app.llm.sql_generator import generate_sql
from app.llm.sql_corrector import correct_sql
from app.sql.executor import execute_safe_query


def run_query(question: str):
    sql = generate_sql(question)

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