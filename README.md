# 📦 Inventory Management System

A full-stack inventory management application built with **FastAPI** (Python) on the backend and **React + Vite** on the frontend, backed by a **PostgreSQL** database (Neon). Supports product management, customer management, and order processing with automated email confirmations.

---

## 🚀 Features

- **Products** — Create and list products with unique SKU enforcement
- **Customers** — Register customers with unique email validation
- **Orders** — Place orders with automatic stock deduction and total price calculation
- **Email Notifications** — Order confirmation emails sent via [Brevo](https://www.brevo.com/) (Sendinblue) API
- **Dockerized** — Both backend and frontend are containerized for easy deployment

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy, Pydantic, Uvicorn |
| Frontend | React 19, Vite, Axios |
| Database | PostgreSQL (Neon serverless) |
| Email | Brevo (SMTP API) |
| Deployment | Docker, Docker Compose |

---

## 📁 Project Structure

```
Inventory_Project/
├── main.py              # FastAPI app & route handlers
├── models.py            # SQLAlchemy ORM models
├── schemas.py           # Pydantic request/response schemas
├── database.py          # DB engine & session setup
├── requirements.txt     # Python dependencies
├── Dockerfile           # Backend Docker image
├── docker-compose.yml   # Multi-service orchestration
├── .env                 # Environment variables (not committed)
└── frontend/
    ├── src/
    │   ├── App.jsx      # Main React component
    │   └── main.jsx     # React entry point
    ├── Dockerfile       # Frontend Docker image
    └── package.json     # Node dependencies
```

---

## ⚙️ Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- Or: Python 3.10+ and Node.js 18+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/inventory-project.git
cd inventory-project
```

### 2. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_sender@example.com
```

> ⚠️ Never commit your `.env` file or expose credentials in source code. The `database.py` currently contains a hardcoded URL — move it to `.env` before deploying.

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

- Backend API: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:5173](http://localhost:5173)
- API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Run locally (without Docker)

**Backend:**
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### Products

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/products` | Create a new product |
| `GET` | `/products` | List all products |

### Customers

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/customers` | Register a new customer |
| `GET` | `/customers` | List all customers |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/orders` | Place a new order |
| `GET` | `/orders` | List all orders |

Full interactive documentation available at `/docs` (Swagger UI) when the server is running.

---

## 🗄️ Data Models

**Product**
- `id`, `name`, `sku` (unique), `price`, `stock_quantity`

**Customer**
- `id`, `name`, `email` (unique)

**Order**
- `id`, `customer_id`, `product_id`, `quantity`, `total_price`, `status` (default: `"Completed"`)

---

## 📧 Email Notifications

When an order is placed, a confirmation email is sent to the customer and the sender address using the Brevo transactional email API. Requires `BREVO_API_KEY` and `SENDER_EMAIL` to be set in `.env`.

---

## 🐳 Docker Services

| Service | Port | Description |
|---|---|---|
| `backend` | `8000` | FastAPI server |
| `frontend` | `5173` | React/Vite dev server |

---

## 📦 Dependencies

**Backend** (key packages):
- `fastapi==0.136.3`
- `sqlalchemy==2.0.50`
- `pydantic==2.13.4`
- `psycopg2-binary==2.9.12`
- `uvicorn==0.48.0`
- `requests`

**Frontend** (key packages):
- `react@19`, `react-dom@19`
- `axios@^1.16.1`
- `vite@^8.0.12`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. Feel free to use and modify it.
