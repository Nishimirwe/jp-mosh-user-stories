import { api } from '../lib/axios';
import type { Report } from '../types';

export const reportsService = {
  /**
   * Get all reports
   */
  async getAllReports(simulationId?: string): Promise<Report[]> {
    const response = await api.get<Report[]>('/reports', {
      params: simulationId ? { simulationId } : undefined,
    });
    return response.data;
  },

  /**
   * Get report by ID
   */
  async getReportById(id: string): Promise<Report> {
    const response = await api.get<Report>(`/reports/${id}`);
    return response.data;
  },
};
