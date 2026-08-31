import random
from datetime import date, timedelta

import psycopg2


random.seed(42)


DATABASE_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "querypilot",
    "user": "postgres",
    "password": "Vishwasa@123",
}


STATUSES = [
    "completed",
    "completed",
    "completed",
    "shipped",
    "pending",
    "cancelled",
]


def generate_orders():
    connection = psycopg2.connect(**DATABASE_CONFIG)
    cursor = connection.cursor()

    cursor.execute("SELECT id FROM customers ORDER BY id;")
    customer_ids = [row[0] for row in cursor.fetchall()]

    if not customer_ids:
        raise RuntimeError("No customers found. Seed customers first.")

    orders = []

    start_date = date(2025, 1, 1)
    end_date = date(2026, 6, 30)
    days_range = (end_date - start_date).days

    for _ in range(500):
        customer_id = random.choice(customer_ids)

        order_date = start_date + timedelta(
            days=random.randint(0, days_range)
        )

        status = random.choice(STATUSES)

        # This is initially a placeholder.
        # We'll calculate the real amount after order_items exist.
        total_amount = 0

        orders.append(
            (
                customer_id,
                order_date,
                status,
                total_amount,
            )
        )

    cursor.executemany(
        """
        INSERT INTO orders (
            customer_id,
            order_date,
            status,
            total_amount
        )
        VALUES (%s, %s, %s, %s);
        """,
        orders,
    )

    connection.commit()

    print(f"Inserted {len(orders)} orders.")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    generate_orders()