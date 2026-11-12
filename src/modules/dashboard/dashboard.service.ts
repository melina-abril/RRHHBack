import { dashboardRepository } from './dashboard.repository.js';
import type { DashboardSummaryResponse } from './dashboard.schemas.js';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummaryResponse> {
    const activeEmployees = await dashboardRepository.countActiveEmployees();
    return {
      activeEmployees,
      // Todavía no hay colecciones de solicitudes ni de eventos.
      pendingRequests: 0,
      upcomingEvents: 0,
    };
  },
};
