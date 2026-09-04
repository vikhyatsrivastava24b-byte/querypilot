SCHEMA_DOCUMENTS = [

    {
        "table": "categories",
        "description": "Product categories.",
        "columns": ["id", "name"],
        "keywords": [
            "category",
            "categories",
            "product category",
        ],
        "relationships": [
            "categories.id = products.category_id"
        ],
    },

    {
        "table": "products",
        "description": "Products sold by the business.",
        "columns": ["id", "name", "category_id", "price"],
        "keywords": [
            "product",
            "products",
            "item",
            "price",
        ],
        "relationships": [
            "products.category_id = categories.id",
            "products.id = order_items.product_id"
        ],
    },

    {
        "table": "customers",
        "description": "Customers who place orders.",
        "columns": ["id", "name", "email", "region"],
        "keywords": [
            "customer",
            "customers",
            "buyer",
            "region",
        ],
        "relationships": [
            "customers.id = orders.customer_id"
        ],
    },

    {
        "table": "orders",
        "description": "Customer orders.",
        "columns": ["id", "customer_id", "order_date", "status", "total_amount"],
        "keywords": [
            "order",
            "orders",
            "order value",
            "order amount",
            "status",
            "sold",
            "customer region",
            "quantity",
        ],
        "relationships": [
            "orders.customer_id = customers.id",
            "orders.id = order_items.order_id"
        ],
    },

    {
        "table": "order_items",
        "description": "Individual products included in orders.",
        "columns": ["id", "order_id", "product_id", "quantity", "unit_price"],
        "keywords": [
            "quantity",
            "units",
            "unit price",
            "ordered product",
            "order item",
            "items sold",
        ],
        "relationships": [
            "order_items.order_id = orders.id",
            "order_items.product_id = products.id"
        ],
    },

]