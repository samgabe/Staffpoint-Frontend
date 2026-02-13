Full-Stack Employee Management & Attendance System

A production-style full-stack web application built to demonstrate end-to-end software engineering skills using Vue 3, Go (Gin), and PostgreSQL.

This project showcases clean architecture, RESTful API design, state management, authentication, and relational data modeling.

🚀 Tech Stack
Frontend

Vue 3 (Composition API)

Tailwind CSS

Pinia (state management)

Axios (HTTP client)

Heroicons

Backend

Go (Golang)

Gin (HTTP framework)

GORM (ORM)

JWT authentication

Database

PostgreSQL

Tooling

Postman (API testing & documentation)

Git & GitHub

📌 Project Overview

The system manages employees and their daily attendance in an organization.

Key Capabilities

Secure authentication and authorization

Role-based access control (Admin, Manager, Employee)

Employee lifecycle management

Daily attendance tracking (clock-in / clock-out)

Administrative dashboard with KPIs

This project is intentionally designed to reflect real-world backend and frontend engineering challenges, including authentication, authorization, data integrity, analytics, and operational auditing. It prioritizes maintainability, correctness, and scalability over superficial UI complexity.

🧱 System Architecture
Vue 3 SPA (Frontend)
   │
   │ Axios (JWT secured)
   ▼
Gin REST API (Backend)
   │
   │ GORM
   ▼
PostgreSQL Database

Architectural Principles

Separation of concerns

Layered backend architecture

Stateless REST APIs

Centralized error handling

Environment-based configuration


# API Design Principles

RESTful resource-based endpoints

Predictable HTTP status codes

Consistent JSON response envelopes

Pagination and filtering for list endpoints

Authentication enforced via middleware

🗂 Backend Architecture
backend/
├── server/
│       └── main.go
├── internal/
│   ├── config/
│   ├── database/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── handlers/
│   ├── middleware/
│   └── routes/
├── pkg/
│   └── utils/
└── go.mod

Layer Responsibilities

Handlers – HTTP request/response

Services – business logic

Repositories – database access

Models – GORM entities

🎨 Frontend Architecture
frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── layouts/
│   ├── router/
│   ├── stores/
│   ├── views/
│   └── main.js

State Management

authStore – authentication state, user, tokens

employeeStore – employee data

attendanceStore – attendance records

🧩 Core Features
Authentication & Authorization

User registration and login

JWT access & refresh tokens

Role-based route protection

Employee Management

Create, update, deactivate employees

Department assignment

Employment status tracking

Attendance Management

Clock-in / clock-out

Daily attendance validation

Absence detection

Dashboard

Total employees

Today’s attendance summary

Absentees overview

Attendance Analytics & Charts

Daily, weekly, and monthly attendance summaries

Absenteeism, punctuality, and overtime metrics

Visualized analytics displayed on the dashboard (charts and trends)

Backend-aggregated analytics exposed via dedicated API endpoints

Reports & Exporting

Export attendance reports in CSV format

Export formatted attendance summaries in PDF format

Date-range, department, and employee-based filtering

Audit Logs

Automatic logging of sensitive actions (authentication, record updates, deletions)

Immutable audit trail for compliance and traceability

Admin-only access to audit records

Analytics data is computed server-side using optimized SQL queries and exposed via dedicated endpoints to avoid heavy client-side aggregation.

🗃 Database Design
Core Tables

users

employees

departments

attendance

audit_logs

The database is fully normalized with foreign key constraints to ensure data integrity.

🔐 Security Considerations

Password hashing using bcrypt

JWT expiration and validation

Role-based authorization middleware

CORS configuration

SQL injection prevention via GORM

🧪 API Testing

All API endpoints are tested using Postman.

Included

Auth endpoints

Employee CRUD

Attendance endpoints

Protected route testing

A Postman collection will be provided to allow easy testing and review.

⚙️ Setup Instructions
Prerequisites

Go ≥ 1.21

Node.js ≥ 18

PostgreSQL ≥ 14

Backend Setup
cd backend
go mod tidy
go run cmd/server/main.go

Frontend Setup
cd frontend
npm install
npm run dev

📄 Environment Variables
Backend (.env)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=employee
JWT_SECRET=supersecretkey

📈 Future Enhancements

Unit and integration tests

Docker & CI/CD pipeline

👤 Author

Sam Gabe
Full-Stack Developer
Focused on building scalable, secure, and maintainable systems.

📜 License

This project is for educational and portfolio purposes.