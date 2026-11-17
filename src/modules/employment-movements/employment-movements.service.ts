import { nowTimestamp, newId, toIsoDateTime } from '../../shared/db/db-utils.js';
import { BusinessRuleError, NotFoundError } from '../../shared/errors/http-errors.js';
import {
  employmentMovementsRepository,
  type Employee,
  type EmploymentMovementDocument,
} from './employment-movements.repository.js';
import type {
  CategoryChangeRequest,
  DepartureRequest,
  EmploymentMovementsResponse,
  EmploymentMovementResponse,
  RehireRequest,
} from './employment-movements.schemas.js';

const dateOf = (employee: Employee): string => toIsoDateTime(employee.startDate).slice(0, 10);

const historyOf = (employee: Employee): EmploymentMovementDocument[] => employee.movements ?? [];

const initialMovement = (employee: Employee): EmploymentMovementDocument => ({
  id: `${employee.id}-initial`,
  type: 'HIRE',
  effectiveDate: dateOf(employee),
  previousCategory: null,
  category: employee.category,
  previousStatus: null,
  status: 'ACTIVE',
  reason: null,
  recordedById: employee.createdById,
  recordedAt: employee.createdAt,
});

const completeHistory = (employee: Employee): EmploymentMovementDocument[] => {
  const saved = historyOf(employee);
  return saved.length > 0 ? saved : [initialMovement(employee)];
};

const latestDate = (employee: Employee): string => {
  const movements = historyOf(employee);
  return movements.length > 0 ? movements[movements.length - 1].effectiveDate : dateOf(employee);
};

const validateDate = (employee: Employee, effectiveDate: string): void => {
  if (effectiveDate <= latestDate(employee)) {
    throw new BusinessRuleError('INVALID_MOVEMENT_DATE', 'La fecha debe ser posterior al último movimiento laboral.');
  }
};

const movementResponse = (movement: EmploymentMovementDocument): EmploymentMovementResponse => ({
  id: movement.id,
  type: movement.type,
  effectiveDate: movement.effectiveDate,
  previousCategory: movement.previousCategory,
  category: movement.category,
  previousStatus: movement.previousStatus,
  status: movement.status,
  reason: movement.reason,
  recordedById: movement.recordedById,
  recordedAt: toIsoDateTime(movement.recordedAt),
});

const toResponse = (employee: Employee): EmploymentMovementsResponse => ({
  employeeId: employee.id,
  employeeNumber: employee.employeeNumber,
  firstName: employee.firstName,
  lastName: employee.lastName,
  category: employee.category,
  status: employee.status,
  startDate: dateOf(employee),
  movements: completeHistory(employee).map(movementResponse).reverse(),
});

const notFound = (id: string): NotFoundError => new NotFoundError(`No existe el colaborador ${id}.`);

export const employmentMovementsService = {
  async get(id: string): Promise<EmploymentMovementsResponse> {
    const employee = await employmentMovementsRepository.findById(id);
    if (!employee) throw notFound(id);
    return toResponse(employee);
  },

  async changeCategory(id: string, request: CategoryChangeRequest, userId: string): Promise<EmploymentMovementsResponse> {
    const updated = await employmentMovementsRepository.update(id, (employee) => {
      if (employee.status !== 'ACTIVE') {
        throw new BusinessRuleError('EMPLOYEE_INACTIVE', 'Solo puedes cambiar la categoría de un colaborador activo.');
      }
      if (employee.category === request.category) {
        throw new BusinessRuleError('CATEGORY_UNCHANGED', 'Selecciona una categoría diferente a la actual.');
      }
      validateDate(employee, request.effectiveDate);
      const movement: EmploymentMovementDocument = {
        id: newId(),
        type: 'CATEGORY_CHANGE',
        effectiveDate: request.effectiveDate,
        previousCategory: employee.category,
        category: request.category,
        previousStatus: employee.status,
        status: employee.status,
        reason: request.reason,
        recordedById: userId,
        recordedAt: nowTimestamp(),
      };
      return {
        category: request.category,
        status: employee.status,
        startDate: employee.startDate,
        movements: [...completeHistory(employee), movement],
      };
    });
    if (!updated) throw notFound(id);
    return toResponse(updated);
  },

  async registerDeparture(id: string, request: DepartureRequest, userId: string): Promise<EmploymentMovementsResponse> {
    const updated = await employmentMovementsRepository.update(id, (employee) => {
      if (employee.status !== 'ACTIVE') {
        throw new BusinessRuleError('EMPLOYEE_INACTIVE', 'El colaborador ya está inactivo.');
      }
      validateDate(employee, request.effectiveDate);
      const movement: EmploymentMovementDocument = {
        id: newId(),
        type: 'DEPARTURE',
        effectiveDate: request.effectiveDate,
        previousCategory: employee.category,
        category: employee.category,
        previousStatus: employee.status,
        status: 'INACTIVE',
        reason: request.reason,
        recordedById: userId,
        recordedAt: nowTimestamp(),
      };
      return {
        category: employee.category,
        status: 'INACTIVE',
        startDate: employee.startDate,
        movements: [...completeHistory(employee), movement],
      };
    });
    if (!updated) throw notFound(id);
    return toResponse(updated);
  },

  async registerRehire(id: string, request: RehireRequest, userId: string): Promise<EmploymentMovementsResponse> {
    const updated = await employmentMovementsRepository.update(id, (employee) => {
      if (employee.status !== 'INACTIVE') {
        throw new BusinessRuleError('EMPLOYEE_ACTIVE', 'Solo puedes reingresar a un colaborador inactivo.');
      }
      validateDate(employee, request.effectiveDate);
      const movement: EmploymentMovementDocument = {
        id: newId(),
        type: 'REHIRE',
        effectiveDate: request.effectiveDate,
        previousCategory: employee.category,
        category: request.category,
        previousStatus: employee.status,
        status: 'ACTIVE',
        reason: request.reason,
        recordedById: userId,
        recordedAt: nowTimestamp(),
      };
      return {
        category: request.category,
        status: 'ACTIVE',
        startDate: employee.startDate,
        movements: [...completeHistory(employee), movement],
      };
    });
    if (!updated) throw notFound(id);
    return toResponse(updated);
  },
};
