package com.techforb.rrhh.modules.auth.api;

import com.techforb.rrhh.modules.auth.application.AuthDtos.LoginRequest;
import com.techforb.rrhh.modules.auth.application.AuthDtos.SesionResponse;
import com.techforb.rrhh.modules.auth.application.AuthService;
import com.techforb.rrhh.shared.security.CurrentUser;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.beans.factory.annotation.Value;
import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final String jwtCookieName;
    private final String frontUrl;

    public AuthController(AuthService authService,
                         @Value("${app.jwt-cookie-name:rrhh_session}") String jwtCookieName,
                         @Value("${app.front-url:http://localhost:4200}") String frontUrl) {
        this.authService = authService;
        this.jwtCookieName = jwtCookieName;
        this.frontUrl = frontUrl;
    }

    /**
     * POST /api/auth/login
     * Valida las credenciales y emite el JWT en la cookie HttpOnly.
     */
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SesionResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        var session = authService.login(request);
        Cookie cookie = new Cookie(jwtCookieName, session.jwt());
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Siempre Secure, incluso en dev (front y backend corren por https o en desarrollo cors)
        cookie.setPath("/");
        cookie.setMaxAge((int) Duration.ofHours(8).getSeconds()); // 8h expiración
        cookie.setSameSite("Lax");
        response.addCookie(cookie);
        return ResponseEntity.ok(session.withoutJwt());
    }

    /**
     * POST /api/auth/logout
     * Borra la cookie de sesión.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie cookie = new Cookie(jwtCookieName, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expira inmediatamente
        cookie.setSameSite("Lax");
        response.addCookie(cookie);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/auth/me
     * Devuelve el usuario autenticado y su rol.
     */
    @GetMapping("/me")
    public ResponseEntity<SesionResponse> getSession(@AuthenticationPrincipal CurrentUser user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.me(user));
    }
}
