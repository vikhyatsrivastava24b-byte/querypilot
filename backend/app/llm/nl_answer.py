from app.llm.config import client


def generate_nl_answer(question: str, sql: str, result: dict) -> str:
    """Generate a natural language answer from query results."""

    columns = result.get("columns", [])
    rows = result.get("rows", [])

    # Limit rows sent to LLM to avoid token overflow
    sample_rows = rows[:20]
    total_rows = len(rows)

    # Format result as a readable table
    result_text = " | ".join(columns) + "\n"
    result_text += "-" * 50 + "\n"
    for row in sample_rows:
        result_text += " | ".join(str(cell) for cell in row) + "\n"

    if total_rows > 20:
        result_text += f"\n... and {total_rows - 20} more rows"

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": """You are a business analytics assistant.
Given a user's question, the SQL query that was executed, and the results,
provide a clear, concise natural language summary of the findings.

Rules:
- Be concise but informative (2-4 sentences max).
- Highlight key numbers, trends, or insights.
- Use currency format (₹) for monetary values.
- If the result is empty, say so clearly.
- Do not repeat the SQL query.
- Do not use markdown formatting.
""",
            },
            {
                "role": "user",
                "content": f"""
Question: {question}

SQL Query:
{sql}

Results ({total_rows} rows):
{result_text}

Provide a natural language summary of these results.
""",
            },
        ],
    )

    return response.choices[0].message.content.strip()

