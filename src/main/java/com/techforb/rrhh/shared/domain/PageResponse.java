package com.techforb.rrhh.shared.domain;

import java.util.List;
import java.util.Objects;

/**
 * Respuesta paginada generica para listados. Utilizado en listados de cualquier entidad del sistema.
 * @param <T> tipo de los items de respuesta
 */
public record PageResponse<T>(
    List<T> items,
    int page,
    int size,
    long total
) {
    public PageResponse {
        Objects.requireNonNull(items);
        if (page < 0) throw new IllegalArgumentException("page no puede ser negativo");
        if (size < 0) throw new IllegalArgumentException("size no puede ser negativo");
        if (total < 0) throw new IllegalArgumentException("total no puede ser negativo");
    }
}
