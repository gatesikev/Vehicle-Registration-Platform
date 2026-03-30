# 🚗 Vehicle Registration & Management Platform

A production-grade Vehicle Registration and Management dashboard built with React. This application allows users to view, register, edit, and manage vehicles through a dynamic, data-driven frontend connected to a live REST API.


## 📁 Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx        # Navigation with auth state
│   │   └── Sidebar.jsx
│   ├── ui/
│   │   ├── InputField.jsx    # Reusable input with error state
│   │   ├── SelectField.jsx   # Reusable select with error state
│   │   ├── Modal.jsx
│   │   └── Toast.jsx
│   └── ProtectedRoute.jsx    # Auth guard for protected pages
├── context/
│   └── AuthContext.jsx       # Global authentication state
├── hooks/
│   └── useVehicles.js
├── pages/
│   ├── Home.jsx              # Public vehicle list
│   ├── Login.jsx             # Mock authentication page
│   ├── Dashboard.jsx         # Protected admin dashboard
│   ├── RegisterVehicle.jsx   # Multi-step registration form
│   └── VehicleDetails.jsx    # Tabbed vehicle detail view
├── services/
│   └── api.js                # Centralized Axios instance
└── validation/
    └── vehicleSchema.js      # Zod validation schemas
```

## ✨ Features

- 🔐 **Client-side Authentication** with Context API and localStorage persistence
- 🛡️ **Protected Routes** that redirect unauthenticated users to login
- 📝 **Multi-step Registration Form** with 3 steps: Vehicle Info, Owner Info, Registration & Insurance
- ✅ **Strict Zod Validation** mirroring all backend rules to prevent 422 errors
- 📊 **Dashboard** with live stats and recent vehicles table
- 🗂️ **Tabbed Detail View** using segmented API endpoints to prevent over-fetching
- 🗑️ **Delete with Confirmation Modal**
- 🔔 **Toast Notifications** for success and error feedback
- ⚡ **TanStack Query** for smart caching and data synchronization

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vehicle-registration-platform.git

# Navigate into the project
cd vehicle-registration-platform

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Test Credentials
```
Email:    test@gmail.com
Password: Password!234
```

## 🔌 API

This project connects to a live Express.js backend:

**Base URL:** `https://student-management-system-backend.up.railway.app/api/vehicle-service`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /vehicle | Public | Get all vehicles |
| POST | /vehicle | Protected | Register new vehicle |
| PUT | /vehicle/:id | Protected | Update vehicle |
| DELETE | /vehicle/:id | Protected | Delete vehicle |
| GET | /vehicle/:id/info | Protected | Vehicle info tab |
| GET | /vehicle/:id/owner | Protected | Owner info tab |
| GET | /vehicle/:id/registration | Protected | Registration tab |
| GET | /vehicle/:id/insurance | Protected | Insurance tab |

## 🧠 State Management Approach

### Authentication (Context API)
Global auth state is managed through `AuthContext` using React's Context API. The `isAuthenticated` flag is persisted in `localStorage` so users remain logged in on page refresh. A `ProtectedRoute` component wraps all sensitive routes and redirects unauthenticated users to `/login`.

### Server State (TanStack Query)
All API data fetching is handled by TanStack Query (React Query):
- `useQuery` fetches and caches vehicle lists and segmented detail tabs
- `useMutation` handles POST, PUT, and DELETE operations
- Queries are automatically invalidated after mutations to keep data fresh
- The tabbed detail view uses `enabled` flags so each tab only fetches when active, preventing unnecessary API calls

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| React Router v6 | Client-side routing |
| TanStack Query | Server state & caching |
| React Hook Form | Form state management |
| Zod | Schema validation |
| Axios | HTTP client |
| Tailwind CSS | Styling |
| React Hot Toast | Notifications |
| Vite | Build tool |

## 📦 Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚢 Deployment

This application is deployed on **Vercel/Netlify**. Every push to the `main` branch automatically triggers a new deployment.

> ⚠️ Note: Ensure your hosting platform is configured to redirect all routes to `index.html` for React Router to work correctly in production.