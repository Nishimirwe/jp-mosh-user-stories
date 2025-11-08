# MOSH - Modal Shift World

**Transportation Planning Simulation Platform**

A comprehensive platform for urban transportation planning and modal shift analysis, enabling city planners to simulate and optimize public transit networks.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Technology Stack](#technology-stack)
- [License](#license)

## 🌍 Overview

MOSH (Modal Shift World) is a web-based platform designed to help urban planners:
- Simulate public transportation networks
- Analyze accessibility and coverage
- Optimize transit routes
- Evaluate modal shift scenarios
- Generate comprehensive reports

## 📁 Project Structure

```
jp-mosh-user-stories/
├── backend/              # NestJS API Server
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/     # JWT Authentication
│   │   │   ├── cities/   # City/Workspace Management
│   │   │   ├── users/    # User Management
│   │   │   └── ...
│   │   ├── common/       # Shared Guards & Decorators
│   │   └── config/       # Configuration
│   ├── docker-compose.yml
│   └── package.json
│
├── frontend/             # Frontend Application (Coming Soon)
│
├── docs/                 # Additional Documentation
│   └── USER_STORIES_TO_NESTJS_ALIGNMENT.md
│
└── README.md            # This file
```

## ✨ Features

### Backend (Implemented)
- ✅ **Multi-tenancy**: City-based workspace isolation
- ✅ **Authentication**: JWT-based auth with Passport
- ✅ **User Management**: Role-based access control (Admin, Planner, Viewer)
- ✅ **City Management**: CRUD operations for cities/workspaces
- ✅ **API Documentation**: Interactive Swagger/OpenAPI docs
- ✅ **Validation**: Comprehensive request validation
- ✅ **Database**: MongoDB with Mongoose ODM
- ✅ **Security**: Password hashing with bcrypt

### Frontend (Planned)
- 🔜 React/Vue.js application
- 🔜 Interactive map interface
- 🔜 GeoJSON visualization
- 🔜 Simulation dashboard

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- MongoDB (via Docker)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start Docker services (MongoDB & Redis)**
   ```bash
   docker-compose up -d
   ```

5. **Run development server**
   ```bash
   npm run start:dev
   ```

6. **Access the application**
   - API: http://localhost:3009/api/v1
   - Swagger Docs: http://localhost:3009/docs
   - Health Check: http://localhost:3009/api/v1/health

### Frontend Setup

```bash
cd frontend
# Coming soon...
```

## 📖 Documentation

### API Documentation

Once the backend is running, visit the interactive API documentation:
- **Swagger UI**: http://localhost:3009/docs

### Available Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login

#### Cities
- `POST /api/v1/cities` - Create city
- `GET /api/v1/cities` - List all cities
- `GET /api/v1/cities/:id` - Get city by ID
- `PATCH /api/v1/cities/:id` - Update city
- `DELETE /api/v1/cities/:id` - Delete city

#### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - List all users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Additional Documentation

- [User Stories to NestJS Alignment](./USER_STORIES_TO_NESTJS_ALIGNMENT.md)
- Backend README: [./backend/README.md](./backend/README.md)

## 🛠 Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: Passport JWT
- **Validation**: class-validator
- **API Docs**: Swagger/OpenAPI
- **Cache**: Redis
- **Containerization**: Docker

### Frontend (Planned)
- React or Vue.js
- TypeScript
- Leaflet/Mapbox for maps
- Axios for API calls

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server
NODE_ENV=development
PORT=3009
API_PREFIX=api/v1

# Database
MONGODB_URI=mongodb://admin:admin123@localhost:27017/mosh_db?authSource=admin

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h

# Limits
MAX_USERS_PER_CITY=20
```

## 🧪 Testing

```bash
# Unit tests
cd backend
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 License

This project is part of the MOSH platform development.

## 👥 Contributors

- Development Team

## 🗺 Roadmap

- [x] Backend API setup
- [x] Authentication & Authorization
- [x] Cities & Users management
- [x] API Documentation
- [ ] Frontend application
- [ ] GeoJSON module
- [ ] Simulation engine
- [ ] File storage
- [ ] Advanced analytics
- [ ] Production deployment

## 📞 Support

For questions or issues, please contact the development team or create an issue in this repository.

---

**Last Updated**: November 2025
