import psycopg2


DATABASE_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "querypilot",
    "user": "postgres",
    "password": "Vishwasa@123",
}


def get_connection():
    return psycopg2.connect(**DATABASE_CONFIG)