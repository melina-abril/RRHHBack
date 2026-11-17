import { z } from 'zod';

export const BENEFIT_TYPES = ['VACATION', 'DAYS_OFF', 'STUDY_LEAVE', 'MOVING_LEAVE'] as const;
export type BenefitType = (typeof BENEFIT_TYPES)[number];

export const benefitAdjustmentSchema = z.object({
  benefitType: z.enum(BENEFIT_TYPES, { error: 'Selecciona un beneficio válido.' }),
  amount: z.number({ error: 'Ingresa una cantidad.' }).int('Ingresa días completos.').refine((value) => value !== 0, 'La cantidad no puede ser cero.'),
  reason: z.string({ error: 'Ingresa un motivo.' }).trim().min(1, 'Ingresa un motivo.').max(500, 'Usa hasta 500 caracteres.'),
});
export type BenefitAdjustmentRequest = z.output<typeof benefitAdjustmentSchema>;

export interface BenefitBalanceResponse {
  benefitType: BenefitType;
  status: 'NOT_APPLICABLE' | 'NOT_RECORDED';
  granted: number | null;
  used: number | null;
  available: number | null;
  expired: number | null;
  periodStart: string | null;
  periodEnd: string | null;
}

export interface BenefitBalancesResponse {
  employeeId: string;
  employeeNumber: string;
  category: 'PERMANENT' | 'INTERN';
  balances: BenefitBalanceResponse[];
}

export interface BenefitMovementResponse {
  id: string;
  benefitType: BenefitType;
  amount: number;
  resultingBalance: number;
  reason: string;
  occurredAt: string;
  createdById: string;
}
