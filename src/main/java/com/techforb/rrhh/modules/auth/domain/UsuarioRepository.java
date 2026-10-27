package com.techforb.rrhh.modules.auth.domain;

import java.util.Optional;

/**
 * Puerto de persistencia de usuarios (abstracto, implementado en infrastructure)
 */
public interface UsuarioRepository {
    Optional<Usuario> findByEmailIgnoreCase(String email);

    // Otros métodos según necesidad del dominio
}
