package com.techforb.rrhh.modules.auth.domain;

import java.util.Optional;

/**
 * Puerto de acceso a persistencia de usuarios.
 */
public interface UsuarioRepository {
    Optional<Usuario> findByEmail(String email);
}
