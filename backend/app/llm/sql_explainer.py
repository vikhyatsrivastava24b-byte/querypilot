from app.llm.config import client


def explain_sql(sql: str, question: str) -> str:
    """Generate a plain-English explanation of a SQL query."""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": """You are a SQL tutor. Explain SQL queries in simple, plain English
that a non-technical business user can understand.

Rules:
- Break down the query step by step.
- Explain what each part does (SELECT, FROM, WHERE, JOIN, GROUP BY, etc.).
- Use bullet points for clarity.
- Keep it concise (3-6 bullet points).
- Do not re-write the SQL.
- Relate the explanation back to the user's original question.
""",
            },
            {
                "role": "user",
                "content": f"""
User's question: {question}

SQL Query:
{sql}

Explain this query in plain English.
""",
            },
        ],
    )

    return response.choices[0].message.content.strip()

