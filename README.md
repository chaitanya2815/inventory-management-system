<div align="center">

# 📦 Inventory Management System

**A production-ready full-stack web application for managing products, customers, and orders — with real-time stock tracking and automated email notifications.**

![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)

</div>

---

## 📌 Overview

The **Inventory Management System** is a full-stack application that lets businesses track their product catalog, manage customer records, and process orders — all in one place. Every order automatically deducts from stock and fires a confirmation email to the customer.

Built with a clean separation between a **FastAPI REST backend** and a **React frontend**, containerized with Docker for consistent deployment anywhere.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🛒 **Product Management** | Add products with name, SKU (unique), price, and stock quantity |
| 👤 **Customer Management** | Register customers with name and unique email |
| 📋 **Order Processing** | Place orders with automatic stock deduction and total price calculation |
| 📧 **Email Notifications** | Order confirmation emails sent to customer + sender via Brevo API |
| 🔒 **Data Integrity** | Unique SKU enforcement, unique email enforcement, stock validation before order |
| 🐳 **Dockerized** | Backend and frontend each run in isolated containers via Docker Compose |
| 📖 **Auto API Docs** | Swagger UI available at `/docs` out of the box |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│               Browser (React)               │
│         Vite Dev Server :5173               │
│  Products | Customers | Orders | Dashboard  │
└────────────────┬────────────────────────────┘
                 │ HTTP (Axios)
                 ▼
┌─────────────────────────────────────────────┐
│          FastAPI Backend :8000              │
│  /products  /customers  /orders             │
│  SQLAlchemy ORM  +  Pydantic Schemas        │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│  PostgreSQL  │  │   Brevo SMTP API │
│  (Neon DB)   │  │ Email on Orders  │
└──────────────┘  └──────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — High-performance Python web framework
- **[SQLAlchemy 2.0](https://www.sqlalchemy.org/)** — ORM for database models
- **[Pydantic v2](https://docs.pydantic.dev/)** — Data validation and serialization
- **[Uvicorn](https://www.uvicorn.org/)** — ASGI server
- **[psycopg2](https://www.psycopg.org/)** — PostgreSQL adapter

### Frontend
- **[React 19](https://react.dev/)** — UI library
- **[Vite 8](https://vitejs.dev/)** — Fast build tool and dev server
- **[Axios](https://axios-http.com/)** — HTTP client

### Infrastructure
- **[PostgreSQL on Neon](https://neon.tech/)** — Serverless cloud database
- **[Brevo](https://www.brevo.com/)** — Transactional email API
- **[Docker + Docker Compose](https://docs.docker.com/)** — Containerization

---

## 📁 Project Structure

```
inventory-project/
│
├── 🐍 Backend (root)
│   ├── main.py              # FastAPI app, all route handlers
│   ├── models.py            # SQLAlchemy ORM models (Product, Customer, Order)
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── database.py          # DB engine, session, Base setup
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Backend container definition
│   └── docker-compose.yml   # Multi-service orchestration
│
├── ⚛️ frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component (Products, Customers, Orders UI)
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   ├── Dockerfile           # Frontend container definition
│   └── package.json
│
└── 🔒 .env                  # Secret credentials (never committed)
```

---

## 🗄️ Data Models

### Product
```
id            → Integer, Primary Key
name          → String
sku           → String, UNIQUE
price         → Float
stock_quantity→ Integer
```

### Customer
```
id    → Integer, Primary Key
name  → String
email → String, UNIQUE
```

### Order
```
id          → Integer, Primary Key
customer_id → ForeignKey → customers.id
product_id  → ForeignKey → products.id
quantity    → Integer
total_price → Float  (auto-calculated: price × quantity)
status      → String  (default: "Completed")
```

---

## 🔌 API Reference

### Products

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `POST` | `/products` | Create a product | `name`, `sku`, `price`, `stock_quantity` |
| `GET` | `/products` | List all products | — |

### Customers

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `POST` | `/customers` | Register a customer | `name`, `email` |
| `GET` | `/customers` | List all customers | — |

### Orders

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `POST` | `/orders` | Place an order | `customer_id`, `product_id`, `quantity` |
| `GET` | `/orders` | List all orders | — |

> 💡 Full interactive documentation at **[http://localhost:8000/docs](http://localhost:8000/docs)** after startup.

---

## ⚙️ Business Logic

- **Stock Validation** — Order is rejected if `product.stock_quantity < order.quantity`
- **Auto Price Calc** — `total_price = product.price × order.quantity`
- **Stock Deduction** — On successful order, stock is decremented automatically
- **Duplicate Guard** — SKU and customer email must be globally unique
- **Email Trigger** — Confirmation email sent on every successful order (if Brevo keys are set)

---

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** (recommended), or Python 3.10+ and Node.js 18+

### 1. Clone the repo

```bash
git clone https://github.com/your-username/inventory-project.git
cd inventory-project
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender@example.com
```

> ⚠️ `.env` is in `.gitignore` — it will never be committed. Also update `database.py` to read `DATABASE_URL` from the environment instead of being hardcoded.

### 3. Run with Docker

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |

### 4. Run locally (without Docker)

**Backend:**
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend** (new terminal):
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Security Notes

> These are important before deploying publicly:

- **Move hardcoded DB credentials** in `database.py` to `.env` and load via `os.getenv("DATABASE_URL")`
- **Restrict CORS** — `allow_origins=["*"]` is fine for development but should be set to your actual frontend URL in production
- **Use HTTPS** in production for all API calls
- **Never commit `.env`** — already handled in `.gitignore`

---

## 📧 Email Setup (Brevo)

1. Create a free account at [brevo.com](https://www.brevo.com)
2. Navigate to **Settings → API Keys** → generate a new key
3. Add a verified sender email in **Senders & Domains**
4. Set `BREVO_API_KEY` and `SENDER_EMAIL` in `.env`

> If keys are missing, orders still process normally — email is silently skipped.

---

## 🐛 Troubleshooting

| Issue | Fix |
|---|---|
| DB connection refused | Check `DATABASE_URL` in `.env`. Ensure Neon DB is awake (free tier may sleep). |
| Port already in use | Change ports in `docker-compose.yml` |
| CORS error in browser | Verify the API URL in `App.jsx` matches the running backend URL |
| `SKU already exists` error | SKU must be globally unique per product |
| Email not sent | Verify `BREVO_API_KEY` and that `SENDER_EMAIL` is a verified sender in Brevo |
| Docker build fails | Run `docker-compose down --rmi all` then `docker-compose up --build` |

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Built with FastAPI + React · Powered by Neon PostgreSQL
</div>
