# Society Management System (SMS) - Fullstack Application

A comprehensive full-stack Society & Residential Community Management platform built with **React + TypeScript + Vite + Tailwind CSS** frontend and **Spring Boot 3 + Java 21 + PostgreSQL** backend.

---

## 🏗️ Architecture

```
SMS/
├── backend/                       # Spring Boot 3 + PostgreSQL Backend
│   ├── src/main/java/com/society/management/
│   │   ├── config/                # CORS & OpenAPI (Swagger) Configuration
│   │   ├── controller/            # REST Controllers (/api/*)
│   │   ├── dto/                   # Request / Response DTOs
│   │   ├── entity/                # JPA Entities (PostgreSQL Tables)
│   │   ├── exception/             # Global Error Handling
│   │   ├── repository/            # Spring Data JPA Repositories
│   │   ├── service/               # Business Logic Layer
│   │   ├── init/                  # Database Seeder (Seeds 120 flats, residents, billing)
│   │   └── SocietyManagementApplication.java
│   ├── src/main/resources/
│   │   └── application.yml        # PostgreSQL & HikariCP Configuration
│   ├── pom.xml                    # Maven configuration
│   └── mvnw / mvnw.cmd            # Maven Wrapper
│
├── src/                           # React + TypeScript Frontend
│   ├── components/                # Layout, Modals, Common UI components
│   ├── context/SocietyContext.tsx  # State Management & Backend Sync
│   ├── pages/                     # Admin & Resident views
│   ├── services/api.ts            # Type-safe REST client for Spring Boot
│   └── types/                     # TypeScript interfaces & domain models
│
└── docker-compose.yml             # 1-Click PostgreSQL 16 container setup
```

---

## 🚀 Quick Start

### 1. Start PostgreSQL Database
```bash
docker compose up -d
```
*(Or use a local PostgreSQL instance with database `sms_db`)*

### 2. Start Spring Boot Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
- Server starts at: `http://localhost:8080`
- Swagger UI (Interactive API Docs): `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### 3. Start Frontend Dev Server
From the root directory:
```bash
npm install
npm run dev
```
- App URL: `http://localhost:5173`

---

## 🌟 Key Features

- **Flats & Occupancy**: Manage 120 units across 6 Blocks (A–F), BHK types, floor numbers, parking slots, and meters.
- **Resident Directory**: Owner & Tenant directory with vehicles, family members, and emergency contacts.
- **Maintenance Billing**: Monthly cycle generation, breakdown (base rate, water, sinking fund, parking, late fees), and invoice statuses.
- **Payments & Receipts**: Instant payment logging (UPI, NetBanking, Cheque, Cash) with auto-receipt generation and status updates.
- **Society Expenses**: Expense tracking by category (Security, Electricity, Housekeeping, Lift AMC, Repairs) with invoices and vendor info.
- **Notice Board**: Broadcast urgent and pinned notices to residents.
- **Helpdesk & Complaints**: Ticket tracking with complete event history/timeline from `Open` to `In Progress` and `Resolved`.
- **Society Settings**: Management committee members, bank details, and dynamic maintenance billing calculations.
