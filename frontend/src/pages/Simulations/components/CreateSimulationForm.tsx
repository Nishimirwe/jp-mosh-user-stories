import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../../store/authStore';
import { useNetworks } from '../../../hooks/useNetworks';
import { NetworkType } from '../../../types';
import './CreateSimulationForm.css';

const simulationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  baselineNetworkId: z.string().min(1, 'Please select a baseline network'),
  proposedNetworkId: z.string().min(1, 'Please select a proposed network'),
}).refine((data) => data.baselineNetworkId !== data.proposedNetworkId, {
  message: 'Baseline and proposed networks must be different',
  path: ['proposedNetworkId'],
});

type SimulationFormData = z.infer<typeof simulationSchema>;

interface CreateSimulationFormProps {
  onSubmit: (data: SimulationFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CreateSimulationForm({ onSubmit, onCancel, isSubmitting }: CreateSimulationFormProps) {
  const { user } = useAuthStore();
  const { data: networks } = useNetworks(user?.cityId || '');
  const [selectedBaseline, setSelectedBaseline] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SimulationFormData>({
    resolver: zodResolver(simulationSchema),
  });

  const baselineNetworkId = watch('baselineNetworkId');
  const proposedNetworkId = watch('proposedNetworkId');

  // Filter networks by type
  const baselineNetworks = networks?.filter(n => n.isBaseline) || [];
  const proposedNetworks = networks?.filter(n => !n.isBaseline) || [];

  const getSelectedNetwork = (id: string) => {
    return networks?.find(n => n._id === id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="create-simulation-form">
      <div className="form-group">
        <label htmlFor="name">Simulation Name *</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={errors.name ? 'error' : ''}
          placeholder="e.g., Downtown Bike Lane Expansion 2024"
        />
        {errors.name && <span className="error-message">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          placeholder="Describe what this simulation will test..."
        />
        {errors.description && <span className="error-message">{errors.description.message}</span>}
      </div>

      <div className="network-selection-section">
        <h3>Network Selection</h3>
        <p className="section-description">
          Select a baseline (current state) and proposed (future scenario) network to compare
        </p>

        <div className="form-group">
          <label htmlFor="baselineNetworkId">Baseline Network (Current State) *</label>
          <select
            id="baselineNetworkId"
            {...register('baselineNetworkId')}
            className={errors.baselineNetworkId ? 'error' : ''}
            onChange={(e) => setSelectedBaseline(e.target.value)}
          >
            <option value="">Select baseline network...</option>
            {baselineNetworks.map((network) => (
              <option key={network._id} value={network._id}>
                {network.name} ({network.type})
              </option>
            ))}
          </select>
          {errors.baselineNetworkId && (
            <span className="error-message">{errors.baselineNetworkId.message}</span>
          )}
          {baselineNetworkId && (
            <div className="network-preview">
              <span className="network-badge baseline">
                {getSelectedNetwork(baselineNetworkId)?.type === NetworkType.BIKING ? '🚴' : '🚇'}
                {getSelectedNetwork(baselineNetworkId)?.name}
              </span>
            </div>
          )}
        </div>

        <div className="comparison-arrow">
          <span>⬇️ Compare with ⬇️</span>
        </div>

        <div className="form-group">
          <label htmlFor="proposedNetworkId">Proposed Network (Future Scenario) *</label>
          <select
            id="proposedNetworkId"
            {...register('proposedNetworkId')}
            className={errors.proposedNetworkId ? 'error' : ''}
          >
            <option value="">Select proposed network...</option>
            {proposedNetworks.map((network) => (
              <option key={network._id} value={network._id}>
                {network.name} ({network.type})
              </option>
            ))}
          </select>
          {errors.proposedNetworkId && (
            <span className="error-message">{errors.proposedNetworkId.message}</span>
          )}
          {proposedNetworkId && (
            <div className="network-preview">
              <span className="network-badge proposed">
                {getSelectedNetwork(proposedNetworkId)?.type === NetworkType.BIKING ? '🚴' : '🚇'}
                {getSelectedNetwork(proposedNetworkId)?.name}
              </span>
            </div>
          )}
        </div>

        {baselineNetworks.length === 0 && (
          <div className="warning-box">
            ⚠️ No baseline networks found. Please create a baseline network first.
          </div>
        )}

        {proposedNetworks.length === 0 && (
          <div className="warning-box">
            ⚠️ No proposed networks found. Please create a proposed network first.
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting || baselineNetworks.length === 0 || proposedNetworks.length === 0}
        >
          {isSubmitting ? 'Creating...' : 'Create Simulation'}
        </button>
      </div>
    </form>
  );
}
