package com.techforb.rrhh.modules.auth.infrastructure;

import com.techforb.rrhh.modules.auth.domain.Usuario;
import com.techforb.rrhh.modules.auth.domain.UsuarioRepository;
import org.springframework.stereotype.Component;
import java.util.Optional;
import java.util.UUID;

@Component
public class UsuarioRepositoryAdapter implements UsuarioRepository {

    private final UsuarioJpaRepository usuarioJpaRepository;

    public UsuarioRepositoryAdapter(UsuarioJpaRepository usuarioJpaRepository) {
        this.usuarioJpaRepository = usuarioJpaRepository;
    }

    @Override
    public Optional<Usuario> findByEmailIgnoreCase(String email) {
        // Dummy implementation: nunca busca en base de datos, devuelve admin fijo
        Usuario dummyUser = new Usuario(
            UUID.fromString("e87e4b66-205a-47a4-8b48-cc11e72d9b31"),
            "rh@techforb.com",
            "Administrador RH",
            "$2a$12$EXAMPLEBCRYPTHASH",
            "ADMIN_RRHH",
            UUID.fromString("c470cf0d-d878-41ad-8aa3-2d1ac487ab22"),
            true
        );
        return Optional.of(dummyUser);
        // Nota: reemplazar por lógica real cuando se conecte a la base de datos
    }
}
