package com.techforb.rrhh.modules.colaboradores.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Spring Data JPA repository para entidad ColaboradorJpaEntity.
 */
public interface ColaboradorJpaRepository extends JpaRepository<ColaboradorJpaEntity, Long>, JpaSpecificationExecutor<ColaboradorJpaEntity> {
    boolean existsByDocumentoTipoAndDocumentoNumeroAndOrganizacionId(String documentoTipo, String documentoNumero, java.util.UUID organizacionId);
    boolean existsByLegajoAndOrganizacionId(String legajo, java.util.UUID organizacionId);
}
