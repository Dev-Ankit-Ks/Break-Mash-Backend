# 🔗 Break Mash Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![Redis](https://img.shields.io/badge/Cache-Redis-red?logo=redis)
![Docker](https://img.shields.io/badge/Containerized-Docker-blue?logo=docker)
![Jest](https://img.shields.io/badge/Testing-Jest-C21325?logo=jest)
![Swagger](https://img.shields.io/badge/API%20Docs-Swagger-brightgreen?logo=swagger)
![Prometheus](https://img.shields.io/badge/Monitoring-Prometheus-orange?logo=prometheus)
![Grafana](https://img.shields.io/badge/Visualization-Grafana-orange?logo=grafana)
![Loki](https://img.shields.io/badge/Logs-Loki-blue?logo=loki)
![License](https://img.shields.io/badge/License-MIT-yellow)

> Backend API for delivering curated news data using Node.js + Express, PostgreSQL, and Redis caching.  
> Features comprehensive testing with Jest (unit & E2E), API documentation with Swagger, and modern monitoring via Prometheus, Grafana, and Loki.  
> Fully containerized with Docker for streamlined deployments.

**🔗 Live Repo:** [github.com/Dev-Ankit-Ks/Break-Mash-Backend](https://github.com/Dev-Ankit-Ks/Break-Mash-Backend)

---

## 📚 Table of Contents

- [🌟 Features](#-features)  
- [🏗️ Architecture](#-architecture)  
- [🧰 Tech Stack](#-tech-stack)  
- [📁 Project Structure](#-project-structure)  
- [🚀 Getting Started](#-getting-started)  
- [🐳 Docker Setup](#-docker-setup)  
- [🔐 Environment Variables](#-environment-variables)  
- [🧪 Testing](#-testing)  
- [📄 API Documentation](#-api-documentation)  
- [📊 Monitoring & Logging](#-monitoring--logging)  
- [📄 License](#-license)  

---

## 🌟 Features

- Clean RESTful API developed with **Node.js** and **Express**  
- Persistent data storage with powerful **PostgreSQL** relational DB  
- Lightning-fast data retrieval using **Redis** caching layer  
- Thorough **unit tests** & **end-to-end (E2E) tests** using **Jest**  
- Well-structured **Swagger UI** for interactive and detailed API docs  
- Extensive runtime **monitoring and observability** stack:  
  - Metrics with **Prometheus**  
  - Dashboards with **Grafana**  
  - Centralized logs via **Loki**  
- Fully containerized with **Docker** for seamless, portable deployment  

---

## 🏗️ Architecture

```mermaid
flowchart TD
  A[Clients / Frontend] -->|REST API Calls| B(Express API Server)
  B --> C[PostgreSQL Database]
  B --> D[Redis Cache]
  B --> E[Prometheus Metrics]
  B --> F[Loki Logs]
  E --> G[Grafana Dashboard]
  F --> G
```

---

## 🧰 Tech Stack

| Layer             | Technology                |
|-------------------|---------------------------|
| Backend Framework | Node.js, Express.js       |
| Database          | PostgreSQL                |
| Cache             | Redis                     |
| Testing Framework | Jest (Unit & E2E)         |
| API Documentation | Swagger (OpenAPI)         |
| Monitoring & Logs | Prometheus, Grafana, Loki |
| Containerization  | Docker                    |

---

## 📁 Project Structure

```
Break-Mash-Backend/
├── tests/              # Unit & E2E test cases
├── controllers/        # Route handlers
├── middlewares/        # Custom middlewares (auth, error, etc.)
├── routes/             # API routes
├── services/           # Business logic
├── DB/                 # PostgreSQL config & Prisma
├── config/             # Redis, monitoring, dotenv
├── validations/        # Schema validation using vinejs
├── docker-compose.yml  # Full Docker orchestration
├── prometheus.yml      # Prometheus config
├── swagger.yaml        # API docs
└── app.js              # Main entry point
```

---

## 🚀 Getting Started

### 📁 Prerequisites

- Node.js v18+  
- PostgreSQL 12+  
- Redis latest stable  
- Docker (optional but recommended)  
- Git  

### 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Dev-Ankit-Ks/Break-Mash-Backend.git
cd Break-Mash-Backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
# Edit `.env` to configure your PostgreSQL, Redis, JWT secret, etc.

# Run database migrations (if applicable)
npm run migrate

# Start development server
npm run dev
```

The API server will start on `http://localhost:3000` by default.

---

## 🐳 Docker Setup

Use Docker to build and run the app containerized for consistent environments:

```bash
# Build the Docker image
docker build -t break-mash-backend .

# Run the container (map port 3000)
docker run -p 3000:3000 --env-file .env break-mash-backend
```

If you have a `docker-compose.yml` file, you can use:

```bash
docker-compose up --build
```

---

## 🔐 Environment Variables

Example `.env` file variables to configure:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/breakmash
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
SWAGGER_ENABLED=true
PROMETHEUS_METRICS_PORT=9090
```

---

## 🧪 Testing

Run all tests using Jest (includes unit and E2E):

```bash
npm run test
```

Or run end-to-end tests separately:

```bash
npm run test:e2e
```

---

## 📄 API Documentation

Access interactive Swagger API docs at:

```
http://localhost:3000/api-docs
```

---

## 📊 Monitoring & Logging

- **Prometheus** collects runtime metrics exposed by the API server.  
- **Grafana** visualizes these metrics on real-time dashboards.  
- **Loki** aggregates and indexes logs for fast troubleshooting.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

🔥 Crafted with ❤️ by [Ankit Kumar Singh](https://github.com/Dev-Ankit-Ks)
