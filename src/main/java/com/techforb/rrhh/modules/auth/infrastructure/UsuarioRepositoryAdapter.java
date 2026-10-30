package com.techforb.rrhh.modules.auth.infrastructure;

import com.techforb.rrhh.modules.auth.domain.Usuario;
import com.techforb.rrhh.modules.auth.domain.UsuarioRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class UsuarioRepositoryAdapter implements UsuarioRepository {

    private final UsuarioJpaRepository jpaRepository;

    public UsuarioRepositoryAdapter(UsuarioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return jpaRepository.findByEmailIgnoreCase(email)
                .map(this::toDomain);
    }

    private Usuario toDomain(UsuarioJpaEntity entity) {
        return new Usuario(
                entity.getOrganizacionId(), // Re-usa organizacion_id como UUID
                entity.getEmail(),
                entity.getPasswordHash(),
                entity.getNombre(),
                entity.getRol(),
                entity.getOrganizacionId(),
                entity.isActivo()
        );
    }
}
