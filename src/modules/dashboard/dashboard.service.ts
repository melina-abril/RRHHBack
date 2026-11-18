import { dashboardRepository } from './dashboard.repository.js';
import type { DashboardSummaryResponse } from './dashboard.schemas.js';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummaryResponse> {
    return {
      activeEmployees: await dashboardRepository.countActiveEmployees(),
    };
  },
};
