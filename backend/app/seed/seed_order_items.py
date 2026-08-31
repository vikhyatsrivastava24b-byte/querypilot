import random

import psycopg2


random.seed(42)


DATABASE_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "querypilot",
    "user": "postgres",
    "password": "Vishwasa@123",
}


def generate_order_items():
    connection = psycopg2.connect(**DATABASE_CONFIG)
    cursor = connection.cursor()

    cursor.execute("SELECT id FROM orders ORDER BY id;")
    order_ids = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT id, price FROM products ORDER BY id;")
    products = cursor.fetchall()

    if not order_ids:
        raise RuntimeError("No orders found. Seed orders first.")

    if not products:
        raise RuntimeError("No products found. Seed products first.")

    order_items = []

    for order_id in order_ids:
        number_of_products = random.randint(1, 5)

        selected_products = random.sample(
            products,
            min(number_of_products, len(products))
        )

        for product_id, product_price in selected_products:
            quantity = random.randint(1, 4)

            order_items.append(
                (
                    order_id,
                    product_id,
                    quantity,
                    product_price,
                )
            )

    cursor.executemany(
        """
        INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            unit_price
        )
        VALUES (%s, %s, %s, %s);
        """,
        order_items,
    )

    connection.commit()

    print(f"Inserted {len(order_items)} order items.")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    generate_order_items()