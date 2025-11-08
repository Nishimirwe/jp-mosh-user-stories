import { api } from '../lib/axios';
import type { Simulation } from '../types';

export interface CreateSimulationDto {
  cityId: string;
  name: string;
  description?: string;
  baselineNetworkId: string;
  proposedNetworkId: string;
  metadata?: Record<string, any>;
}

export interface UpdateSimulationDto {
  name?: string;
  description?: string;
  status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  metadata?: Record<string, any>;
}

export const simulationsService = {
  /**
   * Get all simulations
   */
  async getAllSimulations(cityId?: string): Promise<Simulation[]> {
    const response = await api.get<Simulation[]>('/simulations', {
      params: cityId ? { cityId } : undefined,
    });
    return response.data;
  },

  /**
   * Get simulation by ID
   */
  async getSimulationById(id: string): Promise<Simulation> {
    const response = await api.get<Simulation>(`/simulations/${id}`);
    return response.data;
  },

  /**
   * Create new simulation
   */
  async createSimulation(data: CreateSimulationDto): Promise<Simulation> {
    const response = await api.post<Simulation>('/simulations', data);
    return response.data;
  },

  /**
   * Update simulation
   */
  async updateSimulation(id: string, data: UpdateSimulationDto): Promise<Simulation> {
    const response = await api.patch<Simulation>(`/simulations/${id}`, data);
    return response.data;
  },

  /**
   * Delete simulation
   */
  async deleteSimulation(id: string): Promise<void> {
    await api.delete(`/simulations/${id}`);
  },
};
