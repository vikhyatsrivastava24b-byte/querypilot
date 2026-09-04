def build_schema_context(documents):
    context_parts = []

    for document in documents:
        context_parts.append(
            f"TABLE {document['table']}\n"
            f"Description: {document['description']}\n"
            f"Columns: {', '.join(document['columns'])}\n"
            f"Relationships:\n"
            + "\n".join(
                f"- {relationship}"
                for relationship in document["relationships"]
            )
        )

    return "\n\n".join(context_parts)