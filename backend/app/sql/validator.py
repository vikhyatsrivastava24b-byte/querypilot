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

ALLOWED_TABLES = {
    "categories",
    "products",
    "customers",
    "orders",
    "order_items",
}


def validate_sql(sql: str) -> str:
    sql = sql.strip()

    if "--" in sql or "/*" in sql or "*/" in sql:
        raise ValueError("SQL comments are not allowed")

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

    tables = re.findall(
        r"\b(?:FROM|JOIN)\s+([a-zA-Z_][a-zA-Z0-9_]*)",
        normalized_sql,
        re.IGNORECASE,
    )

    for table in tables:
        if table.lower() not in ALLOWED_TABLES:
            raise ValueError(f"Table not allowed: {table}")    

    return sql