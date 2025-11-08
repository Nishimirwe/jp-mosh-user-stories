import type { Simulation } from '../../../types';
import './SimulationCard.css';

interface SimulationCardProps {
  simulation: Simulation;
  onViewResults?: (simulationId: string) => void;
}

export function SimulationCard({ simulation, onViewResults }: SimulationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'RUNNING':
        return 'status-running';
      case 'COMPLETED':
        return 'status-completed';
      case 'FAILED':
        return 'status-failed';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '⏳';
      case 'RUNNING':
        return '▶️';
      case 'COMPLETED':
        return '✅';
      case 'FAILED':
        return '❌';
      default:
        return '•';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="simulation-card">
      <div className="simulation-card-header">
        <div className="simulation-title-row">
          <h3>{simulation.name}</h3>
          <span className={`simulation-status ${getStatusColor(simulation.status)}`}>
            <span className="status-icon">{getStatusIcon(simulation.status)}</span>
            {simulation.status}
          </span>
        </div>
        {simulation.description && (
          <p className="simulation-description">{simulation.description}</p>
        )}
      </div>

      <div className="simulation-card-body">
        <div className="simulation-meta">
          <div className="meta-item">
            <span className="meta-label">Created</span>
            <span className="meta-value">{formatDate(simulation.createdAt)}</span>
          </div>
          {simulation.startedAt && (
            <div className="meta-item">
              <span className="meta-label">Started</span>
              <span className="meta-value">{formatDate(simulation.startedAt)}</span>
            </div>
          )}
          {simulation.completedAt && (
            <div className="meta-item">
              <span className="meta-label">Completed</span>
              <span className="meta-value">{formatDate(simulation.completedAt)}</span>
            </div>
          )}
        </div>

        {simulation.status === 'RUNNING' && (
          <div className="progress-indicator">
            <div className="progress-bar">
              <div className="progress-bar-fill"></div>
            </div>
            <span className="progress-text">Simulation in progress...</span>
          </div>
        )}

        {simulation.status === 'FAILED' && simulation.error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{simulation.error}</span>
          </div>
        )}
      </div>

      <div className="simulation-card-footer">
        {simulation.status === 'COMPLETED' && (
          <button
            className="view-results-btn"
            onClick={() => onViewResults?.(simulation._id)}
          >
            📊 View Results
          </button>
        )}
        {simulation.status === 'PENDING' && (
          <span className="footer-hint">Waiting to start...</span>
        )}
        {simulation.status === 'RUNNING' && (
          <span className="footer-hint">🔄 Auto-refreshing...</span>
        )}
      </div>
    </div>
  );
}
