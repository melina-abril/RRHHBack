package com.techforb.rrhh.modules.colaboradores.infrastructure;

import com.techforb.rrhh.modules.colaboradores.domain.Colaborador;
import com.techforb.rrhh.modules.colaboradores.domain.ColaboradorRepository;
import com.techforb.rrhh.modules.colaboradores.domain.FiltroColaboradores;
import com.techforb.rrhh.modules.colaboradores.domain.EstadoColaborador;
import org.springframework.stereotype.Component;
import java.util.*;

/**
 * Implementa el puerto ColaboradorRepository a partir de Spring Data JPA.
 * Dummy: memoria; reemplazar por implementación real.
 */
@Component
public class ColaboradorRepositoryAdapter implements ColaboradorRepository {
    private final Map<Long, Colaborador> base = new HashMap<>();

    @Override
    public Optional<Colaborador> findById(Long id) {
        return Optional.ofNullable(base.get(id));
    }
    @Override
    public Optional<Colaborador> findByLegajo(String legajo) {
        return base.values().stream().filter(c -> c.getLegajo().equalsIgnoreCase(legajo)).findFirst();
    }
    @Override
    public Optional<Colaborador> findByDocumento(String tipoDocumento, String numeroDocumento) {
        return base.values().stream()
                .filter(c -> c.getDocumentoTipo().equalsIgnoreCase(tipoDocumento) && c.getDocumentoNumero().equalsIgnoreCase(numeroDocumento))
                .findFirst();
    }
    @Override
    public List<Colaborador> findByFiltros(FiltroColaboradores filtro, int page, int size) {
        List<Colaborador> all = new ArrayList<>(base.values());
        return all;
    }
    @Override
    public long countByFiltros(FiltroColaboradores filtro) {
        return base.size();
    }
    @Override
    public Colaborador save(Colaborador colaborador) {
        base.put(colaborador.getId(), colaborador);
        return colaborador;
    }
    @Override
    public boolean existeDocumentoOLegajo(String tipoDocumento, String numeroDocumento, String legajo, Long exceptId) {
        return base.values().stream().anyMatch(c ->
                (exceptId == null || !c.getId().equals(exceptId)) &&
                (c.getDocumentoTipo().equalsIgnoreCase(tipoDocumento) && c.getDocumentoNumero().equalsIgnoreCase(numeroDocumento)
                || c.getLegajo().equalsIgnoreCase(legajo))
        );
    }
}
