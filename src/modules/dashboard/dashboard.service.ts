import { dashboardRepository } from './dashboard.repository.js';
import type { DashboardResponse } from './dashboard.schemas.js';

export const dashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    return {
      activeEmployees: await dashboardRepository.countActiveEmployees(),
    };
  },
};
