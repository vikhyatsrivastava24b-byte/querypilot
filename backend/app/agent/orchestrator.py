from app.llm.sql_generator import generate_sql
from app.sql.executor import execute_safe_query


def run_query(question: str):
    sql = generate_sql(question)

    result = execute_safe_query(sql)

    return {
        "question": question,
        "sql": sql,
        "result": result,
    }