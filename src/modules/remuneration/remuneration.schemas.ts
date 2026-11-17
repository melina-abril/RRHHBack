import { z } from 'zod';

export const REMUNERATION_CURRENCIES = ['ARS', 'MXN', 'USD'] as const;
export type RemunerationCurrency = (typeof REMUNERATION_CURRENCIES)[number];

export const remunerationRequestSchema = z.object({
  amount: z.number({ error: 'Ingresa el importe base.' }).finite().positive('El importe debe ser mayor a cero.').multipleOf(0.01, 'Usa como máximo dos decimales.'),
  currency: z.enum(REMUNERATION_CURRENCIES, { error: 'Selecciona una moneda válida.' }),
  effectiveDate: z.iso.date({ error: 'Ingresa una fecha válida en formato YYYY-MM-DD.' }),
  reason: z.string({ error: 'Ingresa el motivo.' }).trim().min(1, 'Ingresa el motivo.').max(500, 'Usa hasta 500 caracteres.'),
});
export type RemunerationRequest = z.output<typeof remunerationRequestSchema>;

export type RemunerationPeriodStatus = 'SCHEDULED' | 'CURRENT' | 'HISTORICAL';

export interface RemunerationPeriodResponse {
  id: string;
  amount: number;
  currency: RemunerationCurrency;
  effectiveDate: string;
  reason: string;
  registeredById: string;
  registeredAt: string;
  status: RemunerationPeriodStatus;
  internSupplement: number;
}

export interface RemunerationHistoryResponse {
  employeeId: string;
  periods: RemunerationPeriodResponse[];
}
