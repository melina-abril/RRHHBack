import { BusinessRuleError, NotFoundError } from '../../shared/errors/http-errors.js';
import { benefitsRepository, type BenefitEmployee } from './benefits.repository.js';
import { BENEFIT_TYPES, type BenefitAdjustmentRequest, type BenefitBalanceResponse, type BenefitBalancesResponse, type BenefitMovementResponse, type BenefitType } from './benefits.schemas.js';

const employeeOrThrow = async (id: string): Promise<BenefitEmployee> => {
  const employee = await benefitsRepository.findEmployee(id);
  if (!employee) throw new NotFoundError(`No existe el colaborador ${id}.`);
  return employee;
};

const balanceFor = (category: BenefitEmployee['category'], benefitType: BenefitType): BenefitBalanceResponse => {
  const applicable = benefitType === 'VACATION' ? category === 'INTERN' : benefitType === 'DAYS_OFF' ? category === 'PERMANENT' : true;
  return {
    benefitType,
    status: applicable ? 'NOT_RECORDED' : 'NOT_APPLICABLE',
    granted: null,
    used: null,
    available: null,
    expired: null,
    periodStart: null,
    periodEnd: null,
  };
};

/** No se deducen días usados, ajustes ni fechas de cambio de categoría a partir del alta. */
export const benefitsService = {
  async getBenefitBalances(id: string): Promise<BenefitBalancesResponse> {
    const employee = await employeeOrThrow(id);
    return {
      employeeId: employee.id,
      employeeNumber: employee.employeeNumber,
      category: employee.category,
      balances: BENEFIT_TYPES.map((benefitType) => balanceFor(employee.category, benefitType)),
    };
  },

  async listBenefitMovements(id: string): Promise<BenefitMovementResponse[]> {
    await employeeOrThrow(id);
    // El contrato aprobado no contiene movimientos ni campos de movimientos en employees.
    return [];
  },

  async createBenefitAdjustment(id: string, _request: BenefitAdjustmentRequest, _userId: string): Promise<never> {
    await employeeOrThrow(id);
    // No se confirma un ajuste que la base aprobada no permite guardar ni auditar.
    throw new BusinessRuleError('BENEFIT_STORAGE_UNAVAILABLE', 'No se puede registrar el ajuste: la base de datos todavía no dispone de movimientos de beneficios.');
  },
};
