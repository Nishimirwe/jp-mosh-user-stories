import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { simulationsService } from '../../services/simulations.service';
import { SimulationCard } from './components/SimulationCard';
import { UserRole } from '../../types';
import './SimulationsPage.css';

export function SimulationsPage() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: simulations, isLoading } = useQuery({
    queryKey: ['simulations', user?.cityId],
    queryFn: () => simulationsService.getAllSimulations(user?.cityId),
    refetchInterval: (data) => {
      // Auto-refresh every 5 seconds if any simulation is running
      const hasRunning = data?.some(sim => sim.status === 'RUNNING');
      return hasRunning ? 5000 : false;
    },
  });

  const canCreateSimulation = user?.roles.some(role =>
    [UserRole.ADMIN, UserRole.PLANNER].includes(role)
  );

  const filtered = simulations?.filter(sim =>
    statusFilter === 'all' ? true : sim.status === statusFilter
  ) || [];

  const statusCounts = {
    all: simulations?.length || 0,
    PENDING: simulations?.filter(s => s.status === 'PENDING').length || 0,
    RUNNING: simulations?.filter(s => s.status === 'RUNNING').length || 0,
    COMPLETED: simulations?.filter(s => s.status === 'COMPLETED').length || 0,
    FAILED: simulations?.filter(s => s.status === 'FAILED').length || 0,
  };

  return (
    <div className="simulations-page">
      <header className="page-header">
        <div>
          <h1>Simulations</h1>
          <p className="page-subtitle">
            Manage and monitor your transportation simulations
          </p>
        </div>
        {canCreateSimulation && (
          <button className="primary-button" disabled>
            Create Simulation
            <span className="badge-soon">Coming Soon</span>
          </button>
        )}
      </header>

      <div className="filters-bar">
        <button
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All <span className="count">{statusCounts.all}</span>
        </button>
        <button
          className={`filter-btn ${statusFilter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setStatusFilter('PENDING')}
        >
          Pending <span className="count">{statusCounts.PENDING}</span>
        </button>
        <button
          className={`filter-btn ${statusFilter === 'RUNNING' ? 'active' : ''}`}
          onClick={() => setStatusFilter('RUNNING')}
        >
          Running <span className="count">{statusCounts.RUNNING}</span>
        </button>
        <button
          className={`filter-btn ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setStatusFilter('COMPLETED')}
        >
          Completed <span className="count">{statusCounts.COMPLETED}</span>
        </button>
        {statusCounts.FAILED > 0 && (
          <button
            className={`filter-btn ${statusFilter === 'FAILED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('FAILED')}
          >
            Failed <span className="count">{statusCounts.FAILED}</span>
          </button>
        )}
      </div>

      <div className="simulations-content">
        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading simulations...</p>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No simulations found</h3>
            <p>
              {statusFilter === 'all'
                ? 'Create your first simulation to get started'
                : `No ${statusFilter.toLowerCase()} simulations`}
            </p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="simulations-grid">
            {filtered.map(simulation => (
              <SimulationCard key={simulation._id} simulation={simulation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
