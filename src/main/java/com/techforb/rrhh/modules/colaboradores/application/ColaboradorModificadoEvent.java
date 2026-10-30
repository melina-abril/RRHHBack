package com.techforb.rrhh.modules.colaboradores.application;

import java.time.Instant;

/**
 * Evento publicado cuando un colaborador es modificado, para que auditoria registre el historial.
 */
public record ColaboradorModificadoEvent(
    Long colaboradorId,
    Object anterior,
    Object nuevo,
    Instant fechaModificacion,
    String usuario
) {}
