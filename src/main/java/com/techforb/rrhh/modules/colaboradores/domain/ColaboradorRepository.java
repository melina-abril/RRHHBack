package com.techforb.rrhh.modules.colaboradores.domain;

import java.util.List;
import java.util.Optional;

public interface ColaboradorRepository {
    Optional<Colaborador> findById(Long id);
    Optional<Colaborador> findByLegajo(String legajo);
    Optional<Colaborador> findByDocumento(String tipoDocumento, String numeroDocumento);
    List<Colaborador> findByFiltros(FiltroColaboradores filtro, int page, int size);
    long countByFiltros(FiltroColaboradores filtro);
    Colaborador save(Colaborador colaborador);
    boolean existeDocumentoOLegajo(String tipoDocumento, String numeroDocumento, String legajo, Long exceptId);
}
