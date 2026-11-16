import { dashboardRepository, type DashboardEmployee } from './dashboard.repository.js';
import type { DashboardEventResponse, DashboardSummaryResponse } from './dashboard.schemas.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Calcula el siguiente cumpleaños usando fechas UTC para no desplazar el día según la zona horaria. */
const nextBirthday = (birthDate: Date, today: Date): Date => {
  const startOfToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  let year = today.getUTCFullYear();
  let birthday = new Date(Date.UTC(year, birthDate.getUTCMonth(), birthDate.getUTCDate()));
  if (birthday.getTime() < startOfToday) {
    year += 1;
    birthday = new Date(Date.UTC(year, birthDate.getUTCMonth(), birthDate.getUTCDate()));
  }
  return birthday;
};

const upcomingBirthday = (employee: DashboardEmployee, today: Date): DashboardEventResponse | null => {
  const date = nextBirthday(employee.birthDate.toDate(), today);
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (date.getTime() - todayUtc > 30 * DAY_MS) return null;

  return {
    type: 'BIRTHDAY',
    employeeId: employee.id,
    employeeNumber: employee.employeeNumber,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    date: date.toISOString().slice(0, 10),
  };
};

export const dashboardService = {
  async getSummary(): Promise<DashboardSummaryResponse> {
    const employees = await dashboardRepository.findActiveEmployees();
    const today = new Date();
    const upcomingEvents = employees
      .map((employee) => upcomingBirthday(employee, today))
      .filter((event): event is DashboardEventResponse => event !== null)
      .sort((left, right) => left.date.localeCompare(right.date) || left.employeeName.localeCompare(right.employeeName));

    return {
      activeEmployees: employees.length,
      pendingRequests: null,
      pendingRequestsMessage: 'Las solicitudes todavía no están disponibles.',
      upcomingEvents,
    };
  },
};
