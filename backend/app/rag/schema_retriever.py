from app.rag.schema_documents import SCHEMA_DOCUMENTS


def retrieve_schema(question: str):
    relevant_documents = []

    question_lower = question.lower()

    for document in SCHEMA_DOCUMENTS:
        if any(
            keyword.lower() in question_lower
            for keyword in document["keywords"]
        ):
            relevant_documents.append(document)

    return relevant_documents