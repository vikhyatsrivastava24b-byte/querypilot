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


PRODUCTS = {
    "Laptops": [
        "NovaBook Pro 14",
        "NovaBook Air 13",
        "NovaBook Pro 16",
        "TechBook Ultra 15",
        "WorkMate Pro 14",
        "PowerBook X15",
        "CreatorBook 16",
    ],
    "Monitors": [
        "UltraView 24",
        "UltraView 27",
        "UltraView 32",
        "ProDisplay 27",
        "ProDisplay 32",
        "OfficeView 24",
    ],
    "Smartphones": [
        "NovaPhone X",
        "NovaPhone X Pro",
        "NovaPhone Lite",
        "NovaPhone Max",
        "TechPhone S",
        "TechPhone S Pro",
    ],
    "Tablets": [
        "NovaTab 10",
        "NovaTab 11",
        "NovaTab Pro 12",
        "NovaTab Air",
        "WorkTab 10",
        "MediaTab 11",
    ],
    "Accessories": [
        "Wireless Mouse",
        "Mechanical Keyboard",
        "USB-C Hub",
        "65W Fast Charger",
        "Wireless Headset",
        "Laptop Stand",
        "Webcam HD",
        "Bluetooth Speaker",
        "USB-C Cable",
    ],
    "Networking": [
        "NetConnect AX1800",
        "NetConnect AX3000",
        "NetConnect AX5400",
        "NovaRouter Pro",
        "NovaRouter Lite",
        "8-Port Gigabit Switch",
        "24-Port Gigabit Switch",
    ],
    "Office Equipment": [
        "Laser Printer",
        "InkJet Printer",
        "Document Scanner",
        "Office Projector",
        "Paper Shredder",
        "Conference Speaker",
    ],
    "Storage": [
        "NovaSSD 500GB",
        "NovaSSD 1TB",
        "NovaSSD 2TB",
        "NovaDrive 1TB",
        "NovaDrive 2TB",
        "Portable SSD 1TB",
        "Portable SSD 2TB",
    ],
}


PRICE_RANGES = {
    "Laptops": (45000, 150000),
    "Monitors": (10000, 65000),
    "Smartphones": (12000, 120000),
    "Tablets": (15000, 90000),
    "Accessories": (500, 12000),
    "Networking": (2000, 30000),
    "Office Equipment": (5000, 60000),
    "Storage": (3000, 30000),
}


def generate_products():
    connection = psycopg2.connect(**DATABASE_CONFIG)
    cursor = connection.cursor()

    cursor.execute("SELECT id, name FROM categories;")
    categories = {name: category_id for category_id, name in cursor.fetchall()}

    products = []

    for category_name, product_names in PRODUCTS.items():
        category_id = categories[category_name]
        minimum, maximum = PRICE_RANGES[category_name]

        for product_name in product_names:
            price = random.randint(minimum, maximum)

            products.append(
                (
                    product_name,
                    category_id,
                    price,
                )
            )

    cursor.executemany(
        """
        INSERT INTO products (name, category_id, price)
        VALUES (%s, %s, %s);
        """,
        products,
    )

    connection.commit()

    print(f"Inserted {len(products)} products.")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    generate_products()