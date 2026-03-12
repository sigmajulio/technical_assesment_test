# DEVS Community Admission 🚀

> A full-stack REST API built to demonstrate CRUD mastery, clean architecture, and modern tooling. Products and providers management system — fast, structured, and deployed.

---

## Live Demo
- 🌐 Frontend: https://technical-assesment-test.vercel.app
- 🚀 Backend API: https://technicalassesmenttest-production.up.railway.app
- 📦 API Base URL: https://technicalassesmenttest-production.up.railway.app/api/v1

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Bun |
| Backend Framework | ElysiaJS |
| Database | MongoDB + Mongoose |
| Frontend | React + Vite |
| HTTP Client | Axios |
| Deployment | Railway (API) + Vercel (Frontend) + MongoDB Atlas (DB) |

---

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Node.js](https://nodejs.org) >= 18
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/sigmajulio/technical_assesment_test.git
cd technical_assesment_test
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
bun install
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

---

## Configuration

Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/productsdb
PORT=3000
```

---

## Running the app locally

### Backend (in `/backend`)
```bash
bun run dev
```

API available at `http://localhost:3000`

### Frontend (in `/frontend`)
```bash
npm run dev
```

Frontend available at `http://localhost:5173`

---

## API Documentation

Base URL: `http://localhost:3000/api/v1`

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List all products |
| GET | `/products/:id` | Get single product |
| POST | `/products` | Create product |
| PATCH | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

### Providers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/providers` | List all providers |
| GET | `/providers/:id` | Get single provider |
| POST | `/providers` | Create provider |
| PATCH | `/providers/:id` | Update provider |
| DELETE | `/providers/:id` | Delete provider |

### Query Parameters (GET all)

| Parameter | Example | Description |
|---|---|---|
| `page` | `?page=2` | Page number |
| `limit` | `?limit=20` | Items per page |
| `sort` | `?sort=price` or `?sort=-price` | Sort ascending/descending |
| `fields` | `?fields=name,price` | Field selection |
| `name` | `?name=laptop` | Filter by name (partial match) |
| `price[gte]` | `?price[gte]=100` | Range filter |
| `price[lte]` | `?price[lte]=500` | Range filter |

### Example POST /products
```json
{
  "name": "Laptop Dell XPS 15",
  "price": 1299.99,
  "description": "High-performance laptop",
  "category": "Electronics",
  "stock_quantity": 10,
  "provider_id": "<provider_id>"
}
```

### Response format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [{ "field": "price", "message": "Price must be a positive number" }]
  }
}
```

---

## Project Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── Product.controller.ts
│   │   └── Provider.controller.ts
│   ├── database/
│   │   └── Mongo.service.ts
│   ├── interfaces/
│   │   ├── Product.interface.ts
│   │   └── Provider.interface.ts
│   ├── models/
│   │   ├── Product.model.ts
│   │   └── Provider.model.ts
│   ├── repositories/
│   │   ├── ProductRepository.service.ts
│   │   └── ProviderRepository.service.ts
│   ├── routes/
│   │   └── index.ts
│   └── index.ts

frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Toast.jsx
│   │   └── ConfirmDialog.jsx
│   ├── pages/
│   │   ├── ProductsPage.jsx
│   │   └── ProvidersPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
```

---

## Database Design

**Relationship**: One-to-Many — each Product belongs to one Provider via `provider_id`.

This was chosen for simplicity and because in a product catalog context, a product typically has one primary supplier.

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://technical-assesment-test.vercel.app |
| Backend API | Railway | https://technicalassesmenttest-production.up.railway.app |
| Database | MongoDB Atlas | Cloud hosted |

---

## Known Issues / Limitations

- No authentication implemented (out of scope for this assessment)
- Many-to-many product-provider relationship not implemented (chose One-to-Many for simplicity)