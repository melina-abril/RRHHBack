/** Datos de un cumpleaños próximo, calculados a partir de la fecha de nacimiento. */
export interface UpcomingBirthdayResponse {
  employeeNumber: string;
  name: string;
  date: string;
  daysUntil: number;
}

/** Resumen del panel interno. */
export interface DashboardSummaryResponse {
  activeEmployees: number;
  pendingRequests: number;
  upcomingBirthdays: UpcomingBirthdayResponse[];
}
