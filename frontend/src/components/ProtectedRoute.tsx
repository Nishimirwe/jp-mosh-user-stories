import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
    // Handle both uppercase and lowercase roles
    const userRolesUpper = user.roles.map(r => r.toString().toUpperCase() as UserRole);
    const hasAllowedRole = userRolesUpper.some(role => allowedRoles.includes(role));
    if (!hasAllowedRole) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
