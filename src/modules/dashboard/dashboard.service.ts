import { dashboardRepository, type Employee } from './dashboard.repository.js';
import type { DashboardSummaryResponse, UpcomingBirthdayResponse } from './dashboard.schemas.js';

const UPCOMING_DAYS = 30;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const birthdayInYear = (employee: Employee, year: number): Date => {
  const birthDate = employee.birthDate.toDate();
  // El 29 de febrero se celebra el 1 de marzo en años no bisiestos.
  return new Date(Date.UTC(year, birthDate.getUTCMonth(), birthDate.getUTCDate()));
};

const nextBirthday = (employee: Employee, today: Date): UpcomingBirthdayResponse => {
  let birthday = birthdayInYear(employee, today.getUTCFullYear());
  if (birthday.getTime() < today.getTime()) {
    birthday = birthdayInYear(employee, today.getUTCFullYear() + 1);
  }
  return {
    employeeNumber: employee.employeeNumber,
    name: `${employee.firstName} ${employee.lastName}`,
    date: birthday.toISOString().slice(0, 10),
    daysUntil: Math.round((birthday.getTime() - today.getTime()) / DAY_IN_MS),
  };
};

export const dashboardService = {
  async getSummary(): Promise<DashboardSummaryResponse> {
    const employees = await dashboardRepository.findActiveEmployees();
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const upcomingBirthdays = employees
      .map((employee) => nextBirthday(employee, today))
      .filter((birthday) => birthday.daysUntil <= UPCOMING_DAYS)
      .sort((first, second) => first.daysUntil - second.daysUntil || first.name.localeCompare(second.name));

    return {
      activeEmployees: employees.length,
      // Todavía no existe una colección de solicitudes en esta generación.
      pendingRequests: 0,
      upcomingBirthdays,
    };
  },
};
