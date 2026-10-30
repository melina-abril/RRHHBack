package com.techforb.rrhh.modules.auth.application;

import com.techforb.rrhh.modules.auth.application.AuthDtos.LoginRequest;
import com.techforb.rrhh.modules.auth.application.AuthDtos.SesionResponse;
import com.techforb.rrhh.modules.auth.domain.Usuario;
import com.techforb.rrhh.modules.auth.domain.UsuarioRepository;
import com.techforb.rrhh.shared.exception.NotFoundException;
import com.techforb.rrhh.shared.security.CurrentUser;
import com.techforb.rrhh.shared.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Servicio de autenticación. Valida credenciales, emite el JWT y gestiona sesión actual.
 */
@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    /**
     * Valida credenciales, bloquea usuario inactivo, emite JWT.
     */
    @Transactional
    public SesionResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new NotFoundException("Credenciales incorrectas."));
        if (!usuario.isActivo()) {
            throw new NotFoundException("Usuario inactivo o bloqueado.");
        }
        if (!BCrypt.checkpw(request.password(), usuario.getPasswordHash())) {
            throw new NotFoundException("Credenciales incorrectas.");
        }
        String jwt = jwtService.generarJwt(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol(), usuario.getOrganizacionId());
        return new SesionResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol(), usuario.getOrganizacionId(), jwt);
    }

    /**
     * Devuelve el usuario autenticado y su rol.
     */
    public SesionResponse me(CurrentUser user) {
        return new SesionResponse(user.getId(), user.getNombre(), user.getEmail(), user.getRol(), user.getOrganizacionId(), null);
    }
}
