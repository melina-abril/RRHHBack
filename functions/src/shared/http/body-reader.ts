import { FieldErrors, ValidationError } from './errors';

interface TextRules {
  /** Largo máximo (después del trim). */
  max?: number;
  /** Mensaje si falta o está vacío. */
  message?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Lee y valida el body de un alta o edición campo por campo, juntando TODOS los errores. Al final, done()
 * lanza un 400 VALIDATION_ERROR con { campo: [mensajes] } si hubo alguno. Uso:
 *
 *   const body = new BodyReader(req.body);
 *   const request: ProductRequest = { name: body.text('name', { max: 80 }), price: body.number('price', { min: 0 }) };
 *   body.done();
 */
export class BodyReader {
  private readonly data: Record<string, unknown>;
  private readonly errors: FieldErrors = {};

  constructor(body: unknown) {
    this.data = typeof body === 'object' && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  }

  /** Texto obligatorio (trim). */
  text(field: string, rules: TextRules = {}): string {
    const value = this.data[field];
    const text = typeof value === 'string' ? value.trim() : '';
    if (!text) this.fail(field, rules.message ?? 'Este dato es obligatorio.');
    else if (rules.max !== undefined && text.length > rules.max) this.fail(field, `Puede tener hasta ${rules.max} caracteres.`);
    return text;
  }

  /** Texto opcional: null si no vino o vino vacío. */
  optionalText(field: string, rules: Omit<TextRules, 'message'> = {}): string | null {
    const value = this.data[field];
    if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) return null;
    if (typeof value !== 'string') {
      this.fail(field, 'Debe ser un texto.');
      return null;
    }
    const text = value.trim();
    if (rules.max !== undefined && text.length > rules.max) this.fail(field, `Puede tener hasta ${rules.max} caracteres.`);
    return text;
  }

  /** Correo obligatorio, en minúsculas. */
  email(field: string): string {
    const text = this.text(field, { max: 150 }).toLowerCase();
    if (text && !EMAIL.test(text)) this.fail(field, 'Ingresa un correo válido.');
    return text;
  }

  /** Número obligatorio (acepta "12.5"). integer: sin decimales. */
  number(field: string, rules: { min?: number; max?: number; integer?: boolean } = {}): number {
    const raw = this.data[field];
    const value = typeof raw === 'string' && raw.trim() ? Number(raw) : raw;
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      this.fail(field, 'Ingresa un número.');
      return 0;
    }
    if (rules.integer && !Number.isInteger(value)) this.fail(field, 'Debe ser un número entero.');
    if (rules.min !== undefined && value < rules.min) this.fail(field, `Debe ser mayor o igual a ${rules.min}.`);
    if (rules.max !== undefined && value > rules.max) this.fail(field, `Debe ser menor o igual a ${rules.max}.`);
    return value;
  }

  /** Importe: número con hasta 2 decimales, redondeado a 2. */
  money(field: string, rules: { min?: number } = {}): number {
    return Math.round(this.number(field, rules) * 100) / 100;
  }

  /** Valor de un enum (códigos en MAYÚSCULAS). */
  oneOf<T extends string>(field: string, values: readonly T[], message = 'Selecciona una opción válida.'): T {
    const value = this.data[field];
    if (typeof value === 'string' && (values as readonly string[]).includes(value)) return value as T;
    this.fail(field, message);
    return values[0] as T;
  }

  /** Fecha obligatoria "YYYY-MM-DD". */
  date(field: string, message = 'Ingresa una fecha válida.'): string {
    const value = this.data[field];
    if (typeof value === 'string' && ISO_DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))) return value;
    this.fail(field, message);
    return '';
  }

  /** Fecha opcional "YYYY-MM-DD": null si no vino. */
  optionalDate(field: string): string | null {
    const value = this.data[field];
    return value === undefined || value === null || value === '' ? null : this.date(field);
  }

  boolean(field: string): boolean {
    const value = this.data[field];
    if (typeof value === 'boolean') return value;
    this.fail(field, 'Debe ser sí o no.');
    return false;
  }

  /** Error de una regla entre campos (ej. endDate < startDate). */
  fail(field: string, message: string): void {
    (this.errors[field] ??= []).push(message);
  }

  /** Lanza 400 VALIDATION_ERROR si algún campo falló. Llamarlo SIEMPRE después de leer todos los campos. */
  done(): void {
    if (Object.keys(this.errors).length) throw new ValidationError(this.errors);
  }
}
