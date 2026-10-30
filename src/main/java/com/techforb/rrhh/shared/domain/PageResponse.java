package com.techforb.rrhh.shared.domain;

import java.util.List;

/**
 * Respuesta estándar paginada para listados: items, número de página, tamaño de página y total de elementos.
 */
public record PageResponse<T>(List<T> items, int page, int size, long total) { }
