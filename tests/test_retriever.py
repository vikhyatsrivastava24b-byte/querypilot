"""Tests for the RAG schema retriever module."""
import pytest
from app.rag.schema_retriever import retrieve_schema


class TestRetrieveSchema:
    """Tests for retrieve_schema function."""

    def test_customer_keyword(self):
        results = retrieve_schema("Show me all customers")
        tables = [doc["table"] for doc in results]
        assert "customers" in tables

    def test_product_keyword(self):
        results = retrieve_schema("What are the most expensive products?")
        tables = [doc["table"] for doc in results]
        assert "products" in tables

    def test_order_keyword(self):
        results = retrieve_schema("How many orders were placed?")
        tables = [doc["table"] for doc in results]
        assert "orders" in tables

    def test_category_keyword(self):
        results = retrieve_schema("List all categories")
        tables = [doc["table"] for doc in results]
        assert "categories" in tables

    def test_price_keyword(self):
        results = retrieve_schema("Show average price")
        tables = [doc["table"] for doc in results]
        assert "products" in tables

    def test_region_keyword(self):
        results = retrieve_schema("Sales by region")
        tables = [doc["table"] for doc in results]
        assert "customers" in tables

    def test_quantity_keyword(self):
        results = retrieve_schema("Total quantity sold")
        tables = [doc["table"] for doc in results]
        # Both orders and order_items have "quantity" keyword
        assert any(t in tables for t in ["orders", "order_items"])

    def test_no_match(self):
        results = retrieve_schema("hello world xyz")
        assert len(results) == 0

    def test_case_insensitive(self):
        results1 = retrieve_schema("CUSTOMERS")
        results2 = retrieve_schema("customers")
        tables1 = [doc["table"] for doc in results1]
        tables2 = [doc["table"] for doc in results2]
        assert tables1 == tables2

    def test_multiple_tables(self):
        results = retrieve_schema("Show customer orders with products")
        tables = [doc["table"] for doc in results]
        assert len(tables) >= 2

    def test_result_structure(self):
        results = retrieve_schema("Show me customers")
        assert len(results) > 0
        doc = results[0]
        assert "table" in doc
        assert "description" in doc
        assert "columns" in doc
        assert "keywords" in doc
        assert "relationships" in doc

