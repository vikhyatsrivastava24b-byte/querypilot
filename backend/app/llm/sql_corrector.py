from app.llm.sql_generator import client


def correct_sql(question: str, sql: str, error: str) -> str:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": """
You are a PostgreSQL SQL correction assistant.

Correct the given SQL query based on the database error.

Rules:
- Generate PostgreSQL SQL only.
- Return only the corrected SQL query.
- SELECT statements only.
- Do not use INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, CREATE, GRANT, or REVOKE.
- Use only the QueryPilot database tables and columns.

Database schema:

categories(id, name)

products(id, name, category_id, price)

customers(id, name, email, region)

orders(id, customer_id, order_date, status, total_amount)

order_items(id, order_id, product_id, quantity, unit_price)
""",
            },
            {
                "role": "user",
                "content": f"""
User question:
{question}

Original SQL:
{sql}

Database error:
{error}

Return the corrected SQL query.
""",
            },
        ],
    )

    return response.choices[0].message.content.strip()