# 🏛️ Government Infrastructure & Project Management System
## Production-Ready Authentication & Role-Based Access Control (RBAC) Foundation

A secure, scalable full-stack MERN (MongoDB, Express, React, Node.js) platform built for government infrastructure project tracking with fine-grained Role-Based Access Control (RBAC) and an instant 1-click evaluation experience for hackathon judges.

---

## 👥 User Roles & RBAC Matrix

| Role | Title | Purpose | Default Route |
| :--- | :--- | :--- | :--- |
| **`citizen`** | Citizen | Public user submitting grievances & tracking civic works | `/citizen` |
| **`contractor`** | Contractor | Executes assigned tenders, logs daily workforce & milestones | `/contractor` |
| **`engineer`** | Engineer | Conducts site structural audits & certifies QC tests | `/engineer` |
| **`officer`** | Department Officer | Oversees municipal schemes, sanctions tenders & approvals | `/officer` |
| **`finance`** | Finance Officer | Manages state treasury, releases contractor escrow & billing | `/finance` |
| **`admin`** | Super Admin | System administrator managing RBAC IAM & audit logs | `/admin` |

---

## ⚡ Pre-Seeded Demo Accounts (1-Click Judge Access)

These demo accounts are automatically initialized in MongoDB upon server launch by `seed/seedUsers.js`. The login page features a dedicated **Demo Accounts Panel** where judges can click any role card to log in instantly:

| Name | Role | Email | Password | Primary Dashboard Cards |
| :--- | :--- | :--- | :--- | :--- |
| **Riya Shah** | `citizen` | `citizen@test.com` | `Test@123` | My Complaints, Nearby Projects, Notifications |
| **Arjun Mehta** | `contractor` | `contractor@test.com` | `Test@123` | Assigned Projects, Today's Tasks, Pending Payments |
| **Neha Verma** | `engineer` | `engineer@test.com` | `Test@123` | Pending Inspections, Approved Sites, Quality Reports |
| **Vikram Singh** | `officer` | `officer@test.com` | `Test@123` | Active Projects, Pending Approvals, Budget Used |
| **Kavya Desai** | `finance` | `finance@test.com` | `Test@123` | Budget, Released Funds, Pending Bills |
| **Aditya Rao** | `admin` | `admin@test.com` | `Test@123` | Total Users, Departments, Active Projects, System Health |

---

## 🏗️ Architecture & Folder Structure

### Backend Architecture
```text
backend/
├── config/
│   ├── db.js                 # Mongoose connection & exit on failure
│   ├── cloudinary.js         # Cloudinary configuration
│   └── cors.js               # CORS configuration
├── controllers/
│   ├── authController.js     # register, login, getProfile, logout, getDemoUsers
│   ├── userController.js
│   └── projectController.js
├── middleware/
│   ├── authMiddleware.js     # Bearer JWT verification & req.user binding
│   ├── roleMiddleware.js     # allowRoles(...roles) RBAC guard
│   ├── adminMiddleware.js
│   ├── uploadMiddleware.js
│   ├── errorMiddleware.js
│   └── validateMiddleware.js
├── models/
│   ├── User.js               # User schema with bcrypt pre-save & 6 RBAC roles
│   ├── Project.js
│   └── Notification.js
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   ├── userRoutes.js
│   ├── projectRoutes.js
│   └── notificationRoutes.js
├── seed/
│   └── seedUsers.js          # Auto-seeder for all 6 demo accounts
├── utils/
│   ├── generateToken.js      # JWT generator with 7-day expiration
│   └── response.js
├── server.js                 # Express app, CORS, routes & seed runner
└── .env
```

### Frontend Architecture
```text
frontend/src/
├── context/
│   └── AuthContext.jsx       # Auth state, session persistence, role routing
├── hooks/
│   └── useAuth.js            # Custom hook exposing AuthContext
├── routes/
│   ├── AppRoutes.jsx         # Routing tree with RootRedirect
│   ├── ProtectedRoute.jsx    # Auth verification guard
│   └── RoleRoute.jsx         # RBAC route guard with auto role redirection
├── pages/
│   ├── Login/                # Split-screen login with 1-click Demo Cards
│   ├── Register/             # Citizen public registration form
│   ├── Citizen/              # /citizen dashboard
│   ├── Contractor/           # /contractor dashboard
│   ├── Engineer/             # /engineer dashboard
│   ├── Officer/              # /officer dashboard
│   ├── Finance/              # /finance dashboard
│   └── Admin/                # /admin dashboard
├── components/
│   └── dashboard/
│       ├── DashboardLayout.jsx # Unified shared layout for all 6 dashboards
│       ├── Sidebar.jsx         # Navigation + live Role Switcher for judges
│       ├── TopNavbar.jsx       # Branding, search, notifications, UserMenu
│       ├── StatCard.jsx        # Standardized government KPI metric card
│       ├── DashboardTable.jsx  # Reusable data table with status badges
│       ├── EmptyState.jsx      # Placeholder state component
│       └── UserMenu.jsx        # User profile badge, quick switch, sign out
└── services/
    ├── api.js                # Axios instance with Bearer interceptor
    └── authService.js        # Auth API calls (login, register, demo users)
```

---

## 📡 Authentication API Specifications

### `POST /api/auth/register`
- **Access:** Public (Citizen self-registration)
- **Body:** `{ "name": "Riya Shah", "email": "citizen@test.com", "password": "..." }`
- **Output:** `{ "token": "jwt...", "user": { "id": "...", "name": "...", "email": "...", "role": "citizen" } }`

### `POST /api/auth/login`
- **Access:** Public
- **Body:** `{ "email": "engineer@test.com", "password": "Test@123" }`
- **Output:** `{ "token": "jwt...", "user": { "id": "...", "name": "Neha Verma", "email": "...", "role": "engineer" } }`

### `GET /api/auth/profile`
- **Access:** Private (Bearer token required)
- **Output:** `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }`

### `GET /api/auth/demo-users`
- **Access:** Public
- **Output:** Array of 6 demo account descriptors (passwords omitted)

### `POST /api/auth/logout`
- **Access:** Public
- **Output:** `{ "success": true, "message": "Logged out successfully" }`

---

## 🚀 Running the System

### 1. Backend Server
```bash
cd backend
npm install
npm run dev
```
- Listens on `http://localhost:5000`
- Automatically connects to MongoDB and runs `seedUsers()` to verify the 6 demo accounts.

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- Available at `http://localhost:5173`
- Open the login page and test either the manual login form, citizen registration, or one-click demo login cards!
