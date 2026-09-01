import re


FORBIDDEN_KEYWORDS = {
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "TRUNCATE",
    "CREATE",
    "GRANT",
    "REVOKE",
}


def validate_sql(sql: str) -> str:
    sql = sql.strip()

    if not sql:
        raise ValueError("SQL query is empty")

    # Remove one trailing semicolon for validation.
    normalized_sql = sql.rstrip(";").strip()

    # Only one SQL statement is allowed.
    if ";" in normalized_sql:
        raise ValueError("Multiple SQL statements are not allowed")

    # QueryPilot currently allows SELECT statements only.
    if not re.match(r"^SELECT\b", normalized_sql, re.IGNORECASE):
        raise ValueError("Only SELECT queries are allowed")

    # Block dangerous SQL keywords.
    for keyword in FORBIDDEN_KEYWORDS:
        if re.search(rf"\b{keyword}\b", normalized_sql, re.IGNORECASE):
            raise ValueError(f"Forbidden SQL keyword: {keyword}")

    return sql