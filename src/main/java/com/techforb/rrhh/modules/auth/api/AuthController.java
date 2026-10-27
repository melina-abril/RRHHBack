package com.techforb.rrhh.modules.auth.api;

import com.techforb.rrhh.modules.auth.application.AuthService;
import com.techforb.rrhh.modules.auth.application.AuthDtos.LoginRequest;
import com.techforb.rrhh.modules.auth.application.AuthDtos.SesionResponse;
import com.techforb.rrhh.shared.security.CurrentUser;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/login
     * Recibe correo y contraseña, valida credenciales y establece la cookie JWT HttpOnly.
     *
     * @param request LoginRequest
     * @param response HttpServletResponse
     * @return SesionResponse
     */
    @PostMapping("/login")
    public SesionResponse login(@RequestBody LoginRequest request, HttpServletResponse response) {
        // Dummy response: simula login exitoso, establece cookie dummy
        Cookie cookie = new Cookie("rrhh_session", "dummy.jwt.token");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(8 * 60 * 60); // 8 horas
        cookie.setSameSite("Lax");
        response.addCookie(cookie);
        return new SesionResponse(
            "e87e4b66-205a-47a4-8b48-cc11e72d9b31",
            "rh@techforb.com",
            "Administrador RH",
            "ADMIN_RRHH",
            "c470cf0d-d878-41ad-8aa3-2d1ac487ab22"
        );
        // Nota: reemplazar lógica dummy por autenticación real y generación JWT
    }

    /**
     * POST /api/auth/logout
     * Cierra la sesión eliminando la cookie JWT.
     *
     * @param response HttpServletResponse
     */
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletResponse response) {
        // Dummy logout: elimina cookie jwt
        Cookie cookie = new Cookie("rrhh_session", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setSameSite("Lax");
        response.addCookie(cookie);
        // Nota: reemplazar por invalidación de JWT si es necesario
    }

    /**
     * GET /api/auth/me
     * Devuelve los datos de la cuenta autenticada si la sesión está vigente.
     *
     * @param currentUser CurrentUser
     * @return SesionResponse
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public SesionResponse getSessionInfo(@AuthenticationPrincipal CurrentUser currentUser) {
        // Dummy response: retorna admin fijo
        return new SesionResponse(
            "e87e4b66-205a-47a4-8b48-cc11e72d9b31",
            "rh@techforb.com",
            "Administrador RH",
            "ADMIN_RRHH",
            "c470cf0d-d878-41ad-8aa3-2d1ac487ab22"
        );
        // Nota: reemplazar respuesta dummy por usuario actual real
    }
}