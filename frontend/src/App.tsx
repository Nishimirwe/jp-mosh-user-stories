import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { NetworksPage } from "./pages/Networks/NetworksPage";
import { SimulationsPage } from "./pages/Simulations/SimulationsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserRole } from "./types";

function App() {
  const { initialize, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/networks"
          element={
            <ProtectedRoute>
              <NetworksPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulations"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PLANNER]}>
              <SimulationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
