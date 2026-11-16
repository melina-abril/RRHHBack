/** Resumen calculado únicamente a partir de las colecciones disponibles. */
export interface DashboardEventResponse {
  type: 'BIRTHDAY';
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  date: string;
}

export interface DashboardSummaryResponse {
  activeEmployees: number;
  /** No hay colección de solicitudes en esta generación: null no significa cero solicitudes. */
  pendingRequests: null;
  pendingRequestsMessage: string;
  upcomingEvents: DashboardEventResponse[];
}
