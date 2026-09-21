"""Tests for the schema context builder module."""
import pytest
from app.rag.schema_context import build_schema_context


class TestBuildSchemaContext:
    """Tests for build_schema_context function."""

    def test_single_table(self):
        documents = [{
            "table": "customers",
            "description": "Customers who place orders.",
            "columns": ["id", "name", "email", "region"],
            "relationships": ["customers.id = orders.customer_id"],
        }]
        context = build_schema_context(documents)
        assert "TABLE customers" in context
        assert "Customers who place orders." in context
        assert "id, name, email, region" in context
        assert "customers.id = orders.customer_id" in context

    def test_multiple_tables(self):
        documents = [
            {
                "table": "customers",
                "description": "Customers.",
                "columns": ["id", "name"],
                "relationships": ["customers.id = orders.customer_id"],
            },
            {
                "table": "orders",
                "description": "Orders.",
                "columns": ["id", "customer_id"],
                "relationships": ["orders.customer_id = customers.id"],
            },
        ]
        context = build_schema_context(documents)
        assert "TABLE customers" in context
        assert "TABLE orders" in context

    def test_empty_documents(self):
        context = build_schema_context([])
        assert context == ""

