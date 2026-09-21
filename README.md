# QueryPilot 🚀

**AI-Powered Natural Language Business Analytics Platform**

Ask questions about your PostgreSQL database in plain English and receive validated, executable SQL results as tables and visualizations.

![QueryPilot](https://img.shields.io/badge/QueryPilot-v1.0-blue) ![Python](https://img.shields.io/badge/Python-3.11+-green) ![React](https://img.shields.io/badge/React-18+-61dafb) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)

---

## ✨ Features

- **Natural Language Queries** — Ask questions in plain English, get SQL results
- **AI-Generated SQL** — Uses Groq LLM to generate validated PostgreSQL queries
- **Smart Visualizations** — Auto-detects the best chart type (bar, line, pie) for your data
- **NL Answer Summaries** — Get human-readable English summaries of query results
- **SQL Explanation** — Click "Explain" to understand any generated SQL in plain English
- **Query History** — Browse and re-run past queries from the sidebar
- **CSV Export** — Download any result set as a CSV file
- **Dark/Light Theme** — Toggle between dark and light modes
- **SQL Validation** — Blocks dangerous queries (only SELECT allowed)
- **Auto-Retry** — Automatically corrects failed SQL and retries

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│            React + Vite + Tailwind               │
│   ┌──────┐ ┌──────┐ ┌────────┐ ┌──────────┐    │
│   │ Chat │ │Table │ │ Charts │ │ History  │    │
│   │  UI  │ │ View │ │Recharts│ │ Sidebar  │    │
│   └──────┘ └──────┘ └────────┘ └──────────┘    │
└────────────────────┬────────────────────────────┘
                     │ REST API
┌────────────────────┴────────────────────────────┐
│                   Backend                        │
│               FastAPI + Python                   │
│                                                  │
│  ┌────────────┐  ┌───────────┐  ┌────────────┐  │
│  │ RAG Schema │→ │   LLM     │→ │    SQL     │  │
│  │ Retriever  │  │ Generator │  │ Validator  │  │
│  └────────────┘  └───────────┘  └────────────┘  │
│                       ↓                ↓         │
│              ┌───────────┐    ┌────────────┐     │
│              │    SQL     │    │    SQL     │     │
│              │ Corrector  │    │  Executor  │     │
│              └───────────┘    └────────────┘     │
└────────────────────┬────────────────────────────┘
                     │
              ┌──────┴──────┐
              │ PostgreSQL  │
              │  Database   │
              └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Groq API Key

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/querypilot.git
cd querypilot
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=querypilot
DB_USER=postgres
DB_PASSWORD=your_password
```

### 4. Setup Database

```sql
-- Create the database
CREATE DATABASE querypilot;

-- Create tables
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    category_id INTEGER REFERENCES categories(id),
    price NUMERIC(10, 2)
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(255),
    region VARCHAR(100)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date DATE,
    status VARCHAR(30),
    total_amount NUMERIC(12, 2)
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    unit_price NUMERIC(10, 2)
);
```

### 5. Seed Data

```bash
cd backend
python -m app.seed.seed_customers
python -m app.seed.seed_products
python -m app.seed.seed_orders
python -m app.seed.seed_order_items
```

### 6. Run Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### 7. Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/query` | Execute a natural language query |
| `GET` | `/api/query?question=...` | Execute query via GET |
| `GET` | `/api/history` | Get query history |
| `DELETE` | `/api/history` | Clear query history |
| `POST` | `/api/explain` | Get SQL explanation |
| `POST` | `/api/export/csv` | Export results as CSV |
| `GET` | `/api/suggestions` | Get example questions |
| `GET` | `/health` | Health check |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Python, FastAPI, Pydantic |
| **LLM** | Groq (openai/gpt-oss-120b) |
| **Database** | PostgreSQL, psycopg2 |
| **RAG** | Keyword-based schema retrieval |

---

## 📁 Project Structure

```
querypilot/
├── backend/
│   └── app/
│       ├── agent/           # Query orchestration
│       │   ├── orchestrator.py
│       │   └── state.py
│       ├── api/             # REST API routes
│       │   ├── routes_query.py
│       │   └── schemas.py
│       ├── llm/             # LLM integration
│       │   ├── config.py
│       │   ├── nl_answer.py
│       │   ├── sql_corrector.py
│       │   ├── sql_explainer.py
│       │   └── sql_generator.py
│       ├── rag/             # Schema retrieval
│       │   ├── schema_context.py
│       │   ├── schema_documents.py
│       │   └── schema_retriever.py
│       ├── seed/            # Data seeding scripts
│       ├── sql/             # SQL execution & validation
│       │   ├── error_handler.py
│       │   ├── executor.py
│       │   └── validator.py
│       ├── database.py
│       └── main.py
├── frontend/
│   └── src/
│       ├── components/      # React components
│       │   ├── ChatInput.jsx
│       │   ├── ChatMessage.jsx
│       │   ├── ChartView.jsx
│       │   ├── Header.jsx
│       │   ├── ResultsTable.jsx
│       │   ├── Sidebar.jsx
│       │   ├── SQLDisplay.jsx
│       │   └── WelcomeScreen.jsx
│       ├── context/         # React context (theme)
│       ├── services/        # API client
│       ├── App.jsx
│       └── main.jsx
├── .env
├── requirements.txt
└── README.md
```

---

## 👨‍💻 Author

**Vikhyat Srivastava**

---

## 📄 License

This project is for educational purposes.

