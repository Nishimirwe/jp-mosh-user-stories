# MOSH Frontend

**Modeling Open-Source for Health** - Transportation planning and simulation platform frontend application.

## 🎨 Design

This frontend application features a clean **blue and white** color theme, providing a professional and accessible interface for transportation planners and administrators.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running at `http://localhost:3009`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:5173/**

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🔐 Authentication & Test Credentials

The application uses JWT-based authentication. After logging in, your session token is stored in localStorage and automatically included in all API requests.

### Test Users

Use these credentials to test different user roles:

#### 1. Admin User (Full Access)
```
Email: john.admin@newyork.gov
Password: password123
Roles: ADMIN, PLANNER
```
**Capabilities:**
- Manage cities and users
- Full system access
- Create and run simulations
- Generate and view reports
- Configure system settings

#### 2. Planner User (New York)
```
Email: sarah.planner@newyork.gov
Password: password123
Role: PLANNER
```
**Capabilities:**
- Create transportation scenarios
- Run simulations
- View and analyze results
- Generate reports
- City-specific access (New York)

#### 3. Viewer User (Read-Only)
```
Email: mike.viewer@newyork.gov
Password: password123
Role: VIEWER
```
**Capabilities:**
- View cities and networks
- Browse simulations
- Access reports
- Read-only access
- City-specific access (New York)

#### 4. Paris Planner
```
Email: marie.planner@paris.fr
Password: password123
Role: PLANNER
```
**Capabilities:**
- Create transportation scenarios for Paris
- Run simulations
- City-specific access (Paris)

#### 5. Tokyo Admin
```
Email: yuki.admin@tokyo.jp
Password: password123
Roles: ADMIN, PLANNER
```
**Capabilities:**
- Full admin access for Tokyo
- Manage Tokyo users and settings

## 🎯 User Roles

### ADMIN
Full system access including:
- User management
- City configuration
- System settings
- All CRUD operations
- View all data across cities

### PLANNER
Transportation planning capabilities:
- Create and edit transportation networks
- Run simulations
- Analyze simulation results
- Generate reports
- City-specific access

### VIEWER
Read-only access:
- View cities and networks
- Browse simulations
- Access reports
- No create/edit/delete permissions
- City-specific access

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ProtectedRoute.tsx
│   ├── pages/              # Page components
│   │   ├── Login.tsx       # Login page
│   │   ├── Login.css
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   └── Dashboard.css
│   ├── services/           # API services
│   │   └── auth.service.ts # Authentication service
│   ├── store/              # State management (Zustand)
│   │   └── authStore.ts    # Auth state
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Type definitions
│   ├── lib/                # Utilities
│   │   └── axios.ts        # Axios configuration
│   ├── styles/             # Global styles and theme
│   │   └── theme.ts        # Blue/white theme config
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global CSS with theme variables
├── .env                    # Environment variables
├── package.json
└── README.md
```

## 🎨 Theme Colors

The application uses a blue and white color scheme:

### Primary Colors (Blue)
- `#E3F2FD` - Lightest blue (backgrounds)
- `#2196F3` - Primary blue (buttons, links)
- `#1E88E5` - Main blue (primary actions)
- `#1976D2` - Dark blue (headers)
- `#0D47A1` - Darkest blue (text)

### Neutral Colors (White/Gray)
- `#FFFFFF` - Pure white (cards, backgrounds)
- `#FAFAFA` - Off-white (page backgrounds)
- `#F5F5F5` - Light gray (hover states)
- `#E0E0E0` - Medium gray (borders)

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:3009/api/v1`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3009/api/v1
```

### API Authentication

All authenticated requests automatically include the JWT token in the Authorization header:

```typescript
Authorization: Bearer <token>
```

The token is managed automatically by the Axios interceptor configured in `src/lib/axios.ts`.

## 🛣️ Routes

- `/` - Redirects to login or dashboard based on auth status
- `/login` - Login page
- `/dashboard` - Protected dashboard (requires authentication)

## 📦 Dependencies

### Core
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Routing & State
- **react-router-dom** - Client-side routing
- **zustand** - Lightweight state management

### Data Fetching
- **axios** - HTTP client
- **@tanstack/react-query** - Data fetching and caching (ready to use)

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh on requests
- Automatic logout on 401 responses
- Protected routes with role-based access control
- Secure token storage in localStorage

## 🧪 Testing the Login Flow

1. **Start the backend** (must be running):
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Seed the database** with test users:
   ```bash
   curl -X POST http://localhost:3009/api/v1/seed
   ```

3. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open browser** to http://localhost:5173/

5. **Login** with any test credentials above

6. **Explore** the dashboard and role-specific features

## 🚧 Development

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route to `src/App.tsx`
3. Wrap with `<ProtectedRoute>` if authentication required
4. Optionally specify `allowedRoles` for role-based access

Example:
```typescript
<Route
  path="/simulations"
  element={
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PLANNER]}>
      <Simulations />
    </ProtectedRoute>
  }
/>
```

### Styling Guidelines

- Use CSS variables defined in `index.css` for colors
- Follow the blue/white theme palette
- Use utility classes: `.card`, `.container`, `.text-primary`, etc.
- Keep component styles in separate `.css` files

### API Calls

Use the configured Axios instance:

```typescript
import { api } from '../lib/axios';

// GET request
const response = await api.get('/cities');

// POST request
const response = await api.post('/users', userData);
```

## 📝 Notes

- The application requires the backend API to be running
- Test data is seeded using the `/api/v1/seed` endpoint
- Tokens expire based on backend JWT configuration
- All times are displayed in the user's city timezone

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test with all user roles
4. Ensure blue/white theme consistency
5. Submit pull request

## 📄 License

[Add your license here]
