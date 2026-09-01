from app.database import get_connection
from app.sql.validator import validate_sql

def execute_query(sql: str):
    connection = get_connection()

    try:
        cursor = connection.cursor()
        cursor.execute(sql)

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        return {
            "columns": columns,
            "rows": rows,
        }

    finally:
        cursor.close()
        connection.close()

def execute_safe_query(sql: str):
    validated_sql = validate_sql(sql)
    return execute_query(validated_sql)        