"""Tests for the SQL validator module."""
import pytest
from app.sql.validator import validate_sql


class TestValidateSQL:
    """Tests for validate_sql function."""

    def test_valid_select(self):
        sql = "SELECT * FROM customers"
        assert validate_sql(sql) == sql

    def test_valid_select_with_semicolon(self):
        sql = "SELECT * FROM customers;"
        assert validate_sql(sql) == sql

    def test_valid_join(self):
        sql = "SELECT c.name, o.id FROM customers c JOIN orders o ON c.id = o.customer_id"
        assert validate_sql(sql) == sql

    def test_valid_multiple_tables(self):
        sql = "SELECT p.name, c.name FROM products p JOIN categories c ON p.category_id = c.id"
        assert validate_sql(sql) == sql

    def test_empty_sql(self):
        with pytest.raises(ValueError, match="empty"):
            validate_sql("")

    def test_whitespace_only(self):
        with pytest.raises(ValueError, match="empty"):
            validate_sql("   ")

    def test_insert_blocked(self):
        with pytest.raises(ValueError, match="SELECT"):
            validate_sql("INSERT INTO customers VALUES (1, 'test', 'test@test.com', 'North')")

    def test_update_blocked(self):
        with pytest.raises(ValueError, match="SELECT"):
            validate_sql("UPDATE customers SET name = 'test'")

    def test_delete_blocked(self):
        with pytest.raises(ValueError, match="SELECT"):
            validate_sql("DELETE FROM customers")

    def test_drop_blocked(self):
        with pytest.raises(ValueError, match="SELECT"):
            validate_sql("DROP TABLE customers")

    def test_alter_blocked(self):
        with pytest.raises(ValueError, match="SELECT"):
            validate_sql("ALTER TABLE customers ADD COLUMN phone VARCHAR(20)")

    def test_truncate_blocked(self):
        with pytest.raises(ValueError, match="SELECT"):
            validate_sql("TRUNCATE TABLE customers")

    def test_create_blocked(self):
        with pytest.raises(ValueError, match="SELECT"):
            validate_sql("CREATE TABLE test (id INT)")

    def test_forbidden_keyword_in_select_subquery(self):
        """Forbidden keywords are caught even within SELECT statements."""
        with pytest.raises(ValueError, match="Multiple SQL statements"):
            validate_sql("SELECT * FROM customers WHERE 1=1; INSERT INTO customers VALUES (1)")

    def test_non_select_rejected(self):
        with pytest.raises(ValueError, match="SELECT"):
            validate_sql("SHOW TABLES")

    def test_multiple_statements_rejected(self):
        with pytest.raises(ValueError, match="Multiple"):
            validate_sql("SELECT 1; SELECT 2")

    def test_comments_rejected(self):
        with pytest.raises(ValueError, match="comments"):
            validate_sql("SELECT * FROM customers -- comment")

    def test_block_comments_rejected(self):
        with pytest.raises(ValueError, match="comments"):
            validate_sql("SELECT * FROM customers /* comment */")

    def test_unknown_table_rejected(self):
        with pytest.raises(ValueError, match="not allowed"):
            validate_sql("SELECT * FROM secret_table")

    def test_all_allowed_tables(self):
        for table in ["categories", "products", "customers", "orders", "order_items"]:
            sql = f"SELECT * FROM {table}"
            assert validate_sql(sql) == sql

    def test_case_insensitive_select(self):
        sql = "select * from customers"
        assert validate_sql(sql) == sql

    def test_select_with_forbidden_in_subquery(self):
        with pytest.raises(ValueError):
            validate_sql("SELECT * FROM customers WHERE id IN (DELETE FROM orders)")
