from app.database import get_connection
from app.sql.validator import validate_sql
from app.sql.error_handler import format_database_error

def execute_query(sql: str):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        try:
            cursor.execute(sql)

            columns = [description[0] for description in cursor.description]
            rows = cursor.fetchall()

            return {
                "columns": columns,
                "rows": rows,
            }

        except Exception as error:
            raise ValueError(format_database_error(error))

    finally:
        cursor.close()
        connection.close()

        
def execute_safe_query(sql: str):
    validated_sql = validate_sql(sql)
    return execute_query(validated_sql)        