import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { simulationsService } from '../../services/simulations.service';
import { SimulationCard } from './components/SimulationCard';
import { CreateSimulationForm } from './components/CreateSimulationForm';
import { Modal } from '../../components/Modal';
import { useCreateSimulation } from '../../hooks/useSimulations';
import { UserRole } from '../../types';
import './SimulationsPage.css';

export function SimulationsPage() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const createSimulation = useCreateSimulation();

  const { data: simulations, isLoading } = useQuery({
    queryKey: ['simulations', user?.cityId],
    queryFn: async () => {
      if (!user?.cityId) return [];
      return await simulationsService.getAllSimulations(user.cityId);
    },
    enabled: !!user?.cityId,
    refetchInterval: (query) => {
      // Auto-refresh every 5 seconds if any simulation is running
      const data = query.state.data;
      const hasRunning = Array.isArray(data) && data.some(sim => sim.status === 'RUNNING');
      return hasRunning ? 5000 : false;
    },
  });

  const canCreateSimulation = user?.roles.some(role =>
    [UserRole.ADMIN, UserRole.PLANNER].includes(role.toString().toUpperCase() as UserRole)
  );

  // Ensure simulations is always an array
  const simulationsArray = Array.isArray(simulations) ? simulations : [];

  const filtered = simulationsArray.filter(sim =>
    statusFilter === 'all' ? true : sim.status === statusFilter
  );

  const statusCounts = {
    all: simulationsArray.length,
    PENDING: simulationsArray.filter(s => s.status === 'PENDING').length,
    RUNNING: simulationsArray.filter(s => s.status === 'RUNNING').length,
    COMPLETED: simulationsArray.filter(s => s.status === 'COMPLETED').length,
    FAILED: simulationsArray.filter(s => s.status === 'FAILED').length,
  };

  const handleCreateSimulation = async (data: any) => {
    try {
      await createSimulation.mutateAsync({
        ...data,
        cityId: user?.cityId!,
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create simulation:', error);
    }
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
          <button
            className="primary-button"
            onClick={() => setIsCreateModalOpen(true)}
          >
            ➕ Create Simulation
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

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Simulation"
      >
        <CreateSimulationForm
          onSubmit={handleCreateSimulation}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={createSimulation.isPending}
        />
      </Modal>
    </div>
  );
}
