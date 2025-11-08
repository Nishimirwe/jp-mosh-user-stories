import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import './Dashboard.css';

export function Dashboard() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getRoleDisplay = () => {
    if (!user?.roles) return '';
    return user.roles.join(', ');
  };

  const getDashboardContent = () => {
    if (!user) return null;

    // Handle both uppercase and lowercase role strings
    const roles = user.roles.map(r => r.toString().toUpperCase());
    const isAdmin = roles.includes(UserRole.ADMIN);
    const isPlanner = roles.includes(UserRole.PLANNER);
    const isViewer = roles.includes(UserRole.VIEWER);

    return (
      <div className="dashboard-content">
        <h2>Welcome, {user.firstName} {user.lastName}!</h2>
        <p className="user-info">Role(s): <span className="role-badge">{getRoleDisplay()}</span></p>
        <p className="user-info">Email: {user.email}</p>

        <div className="capabilities-section">
          <h3>Your Capabilities</h3>
          <div className="capabilities-grid">
            {isAdmin && (
              <div className="capability-card admin">
                <h4>🔐 Administrator</h4>
                <ul>
                  <li>Manage cities and users</li>
                  <li>Full system access</li>
                  <li>Configure settings</li>
                  <li>View all reports</li>
                </ul>
              </div>
            )}

            {isPlanner && (
              <div className="capability-card planner">
                <h4>📊 Planner</h4>
                <ul>
                  <li>Create transportation scenarios</li>
                  <li>Run simulations</li>
                  <li>Analyze results</li>
                  <li>Generate reports</li>
                </ul>
              </div>
            )}

            {isViewer && (
              <div className="capability-card viewer">
                <h4>👁️ Viewer</h4>
                <ul>
                  <li>View cities and networks</li>
                  <li>Browse simulations</li>
                  <li>Access reports</li>
                  <li>Read-only access</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/networks" className="action-button">
              🗺️ Browse Networks
            </Link>
            {(isAdmin || isPlanner) && (
              <Link to="/simulations" className="action-button">
                ▶️ View Simulations
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="logo">MOSH</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          {getDashboardContent()}
        </div>
      </main>
    </div>
  );
}
