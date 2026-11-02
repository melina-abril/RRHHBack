/** Respuesta de TODO listado paginado. page empieza en 0. Mismo formato que Page<T> del front. */
export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface PageQuery {
  page: number;
  size: number;
}

const DEFAULT_SIZE = 10;
const MAX_SIZE = 100;

/** ?page=&size= del query → números válidos (page >= 0, 1 <= size <= 100). */
export function parsePageQuery(query: Record<string, unknown>): PageQuery {
  const page = Number(query['page']);
  const size = Number(query['size']);
  return {
    page: Number.isInteger(page) && page >= 0 ? page : 0,
    size: Number.isInteger(size) && size > 0 ? Math.min(size, MAX_SIZE) : DEFAULT_SIZE,
  };
}

/** Lista completa (ya filtrada y ordenada) → una página, mapeando cada item a su DTO. */
export function toPage<T, R>(all: readonly T[], { page, size }: PageQuery, map: (item: T) => R): Page<R> {
  const start = page * size;
  return {
    items: all.slice(start, start + size).map(map),
    page,
    size,
    totalItems: all.length,
    totalPages: Math.max(1, Math.ceil(all.length / size)),
  };
}

/** Texto de un filtro opcional del query (?search=, ?status=): trim, o null si no vino. */
export function queryText(query: Record<string, unknown>, name: string): string | null {
  const value = query[name];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
