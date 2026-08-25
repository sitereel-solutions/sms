# Society Management System - Backend (Spring Boot 3 + PostgreSQL)

Production-ready Spring Boot backend for the Society Management System (SMS), managing Flats, Residents, Maintenance Billing, Payments, Society Expenses, Notices, Helpdesk Complaints, Activity Logs, and Society Configuration.

---

## 🛠️ Tech Stack & Architecture

- **Java**: 21 (LTS)
- **Framework**: Spring Boot 3.3.3
- **ORM / Persistence**: Spring Data JPA & Hibernate
- **Database**: PostgreSQL 16
- **Validation**: Jakarta Validation (`@NotNull`, `@NotBlank`, `@Positive`)
- **API Documentation**: SpringDoc OpenAPI 3 / Swagger UI (`org.springdoc:springdoc-openapi-starter-webmvc-ui`)
- **Boilerplate**: Project Lombok

---

## 🚀 Quick Start Guide

### 1. Start the PostgreSQL Database

#### Option A: Using Docker Compose (Recommended - 1 Command)
From the root project folder:
```bash
docker compose up -d
```
This starts a PostgreSQL 16 container named `sms_postgres` listening on port `5432` with:
- **Database**: `sms_db`
- **Username**: `postgres`
- **Password**: `postgres`

#### Option B: Using Local PostgreSQL Installation
If you already have PostgreSQL installed on your machine:
1. Open `psql` or pgAdmin:
   ```sql
   CREATE DATABASE sms_db;
   ```
2. Verify credentials in `backend/src/main/resources/application.yml` (or export environment variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

---

### 2. Run the Spring Boot Application

Inside the `backend/` directory:

#### On Windows (PowerShell / Command Prompt):
```powershell
.\mvnw.cmd spring-boot:run
```

#### On Linux / macOS / Git Bash:
```bash
./mvnw spring-boot:run
```

> **Note**: On the first startup, `DataInitializer` will automatically seed the database with **120 flats** (across blocks A to F), residents, August 2026 maintenance cycle, payments, expenses, notices, complaints, and society settings!

---

### 3. Interactive API Documentation (Swagger UI)

Once the backend is running, open your browser and navigate to:
👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

You can view all endpoints, test requests interactively, and inspect the OpenAPI 3 specification at `http://localhost:8080/v3/api-docs`.

---

## 📡 REST API Summary

### 🏢 Flats (`/api/flats`)
- `GET /api/flats` - List all flats (optional filter: `?block=A`)
- `GET /api/flats/{id}` - Get flat details by ID
- `GET /api/flats/number/{flatNumber}` - Get flat by unit number (e.g., `A-101`)
- `POST /api/flats` - Register a new flat
- `PUT /api/flats/{id}` - Update flat information
- `DELETE /api/flats/{id}` - Delete a flat

### 👥 Residents (`/api/residents`)
- `GET /api/residents` - List all residents
- `GET /api/residents/{id}` - Get resident by ID
- `GET /api/residents/flat/{flatNumber}` - Get resident by flat number
- `POST /api/residents` - Register a resident (automatically marks flat as Occupied)
- `PUT /api/residents/{id}` - Update resident profile, emergency contacts, vehicles
- `DELETE /api/residents/{id}` - Delete resident (marks flat as Vacant)

### 💳 Maintenance Billing (`/api/maintenance`)
- `GET /api/maintenance` - List maintenance records (optional filters: `?cycle=2026-08&flatNumber=A-101`)
- `GET /api/maintenance/{id}` - Get maintenance record by ID
- `POST /api/maintenance/generate-cycle` - Generate monthly maintenance records for all occupied units
- `PATCH /api/maintenance/{id}/status` - Update maintenance payment status

### 🧾 Payments & Receipts (`/api/payments`)
- `GET /api/payments` - List all payment transactions
- `GET /api/payments/{id}` - Get payment transaction by ID
- `GET /api/payments/receipt/{receiptNumber}` - Get receipt by receipt number (e.g., `REC-2026-00842`)
- `POST /api/payments` - Record a new payment (auto-generates receipt number, marks maintenance record as `Paid`, and updates flat status)

### 💰 Expenses (`/api/expenses`)
- `GET /api/expenses` - List society expenses (optional filter: `?category=Electricity`)
- `GET /api/expenses/{id}` - Get expense details
- `POST /api/expenses` - Record a new expense
- `PUT /api/expenses/{id}` - Update expense details
- `DELETE /api/expenses/{id}` - Delete an expense

### 📢 Notices (`/api/notices`)
- `GET /api/notices` - List all notices (pinned notices first)
- `GET /api/notices/{id}` - Get notice by ID
- `POST /api/notices` - Broadcast a new notice
- `PATCH /api/notices/{id}/pin` - Toggle pin status
- `DELETE /api/notices/{id}` - Delete notice

### 🎫 Complaints & Helpdesk (`/api/complaints`)
- `GET /api/complaints` - List complaints (optional filters: `?status=Open&flatNumber=A-101`)
- `GET /api/complaints/{id}` - Get complaint with full audit timeline
- `POST /api/complaints` - Register a new complaint ticket
- `PATCH /api/complaints/{id}/status` - Update status (`Open` -> `In Progress` -> `Resolved`), assign staff, and append timeline entry

### ⚙️ Society Settings (`/api/settings`)
- `GET /api/settings` - Get society profile, bank details, and maintenance billing rates
- `PUT /api/settings` - Update society settings and committee members

### 📊 Dashboard Analytics (`/api/dashboard`)
- `GET /api/dashboard/stats` - Fetch aggregate KPIs (total flats, occupancy %, collection %, total collected, total pending, balance, complaints breakdown, category-wise expenses)

### 🕒 Activity Log (`/api/activities`)
- `GET /api/activities` - Fetch latest 50 audit and activity log items

---

## 💻 Fullstack Development Flow

1. **Start PostgreSQL**:
   ```bash
   docker compose up -d
   ```
2. **Start Backend**:
   ```bash
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
3. **Start Frontend**:
   ```bash
   npm run dev
   ```
4. Access frontend at `http://localhost:5173` and backend API at `http://localhost:8080`.
