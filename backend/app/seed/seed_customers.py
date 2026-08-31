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


FIRST_NAMES = [
    "Aarav", "Vihaan", "Aditya", "Arjun", "Kabir",
    "Rohan", "Rahul", "Karan", "Vikram", "Ananya",
    "Aanya", "Diya", "Isha", "Meera", "Priya",
    "Riya", "Sneha", "Neha", "Kavya", "Tanya",
]


LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Singh", "Kumar",
    "Gupta", "Mehta", "Shah", "Joshi", "Malhotra",
    "Kapoor", "Reddy", "Nair", "Iyer", "Mishra",
]


REGIONS = [
    "North",
    "South",
    "East",
    "West",
    "Central",
]


def generate_customers():
    connection = psycopg2.connect(**DATABASE_CONFIG)
    cursor = connection.cursor()

    customers = []
    used_emails = set()

    for customer_id in range(1, 101):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)

        name = f"{first_name} {last_name}"
        email = f"{first_name.lower()}.{last_name.lower()}{customer_id}@novamart.com"
        region = random.choice(REGIONS)

        if email in used_emails:
            continue

        used_emails.add(email)

        customers.append(
            (
                name,
                email,
                region,
            )
        )

    cursor.executemany(
        """
        INSERT INTO customers (name, email, region)
        VALUES (%s, %s, %s);
        """,
        customers,
    )

    connection.commit()

    print(f"Inserted {len(customers)} customers.")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    generate_customers()