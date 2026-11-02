import { Request, Router } from 'express';
import { requireRole } from '../../shared/auth/auth.middleware';
import { BodyReader } from '../../shared/http/body-reader';
import { payrollService } from './payroll.service';
import {
  PAYROLL_PERIOD_STATUSES,
  PAYSLIP_STATUSES,
  BONUS_STATUSES,
  BONUS_CONCEPTS,
  CURRENCIES,
  PayslipRequest,
  BonusRequest
} from './payroll.dto';

/**
 * Router del módulo payroll: un handler por servicio del plan.
 * El alta de recibos y bonos es de uso administrativo (ADMIN / HR_ANALYST).
 */
export const payrollRouter = Router();

// --- Payroll Periods ---

// GET /payroll-periods
payrollRouter.get('/payroll-periods', async (_req, res) => {
  res.json(await payrollService.listPayrollPeriods());
});

// --- Payslips ---

// GET /payslips/:employeeId
payrollRouter.get('/payslips/:employeeId', async (req: Request<{ employeeId: string }>, res) => {
  res.json(await payrollService.getPayslipsByEmployee(req.params.employeeId));
});

function readPayslipRequest(req: Request): PayslipRequest {
  const body = new BodyReader(req.body);
  const request: PayslipRequest = {
    employeeId: body.text('employeeId', { max: 20 }),
    periodId: body.text('periodId', { max: 20 }),
    baseAmount: body.money('baseAmount', { min: 0 }),
    currency: body.oneOf('currency', CURRENCIES, 'Selecciona una moneda.'),
    additional: body.money('additional', { min: 0 }),
    total: body.money('total', { min: 0 }),
    issueDate: body.date('issueDate'),
    status: body.oneOf('status', PAYSLIP_STATUSES, 'Selecciona un estado válido.')
  };
  body.done();
  return request;
}

// POST /payslips (solo ADMIN y HR_ANALYST)
payrollRouter.post('/payslips', requireRole('ADMIN', 'HR_ANALYST'), async (req, res) => {
  res.status(201).json(await payrollService.createPayslip(readPayslipRequest(req)));
});

// --- Bonuses ---
// GET /bonuses/:employeeId
payrollRouter.get('/bonuses/:employeeId', async (req: Request<{ employeeId: string }>, res) => {
  res.json(await payrollService.getBonusesByEmployee(req.params.employeeId));
});

function readBonusRequest(req: Request): BonusRequest {
  const body = new BodyReader(req.body);
  const request: BonusRequest = {
    employeeId: body.text('employeeId', { max: 20 }),
    periodId: body.text('periodId', { max: 20 }),
    concept: body.oneOf('concept', BONUS_CONCEPTS, 'Selecciona un concepto.'),
    amount: body.money('amount', { min: 0 }),
    currency: body.oneOf('currency', CURRENCIES, 'Selecciona una moneda.'),
    approvedBy: body.text('approvedBy', { max: 20 }),
    status: body.oneOf('status', BONUS_STATUSES, 'Selecciona un estado válido.'),
    grantDate: body.optionalDate('grantDate'),
  };
  body.done();
  return request;
}

// POST /bonuses (solo ADMIN y HR_ANALYST)
payrollRouter.post('/bonuses', requireRole('ADMIN', 'HR_ANALYST'), async (req, res) => {
  res.status(201).json(await payrollService.assignBonus(readBonusRequest(req)));
});
