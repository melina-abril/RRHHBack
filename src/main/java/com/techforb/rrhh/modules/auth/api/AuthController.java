package com.techforb.rrhh.modules.auth.api;

import com.techforb.rrhh.modules.auth.application.AuthService;
import com.techforb.rrhh.modules.auth.application.AuthDtos.LoginRequest;
import com.techforb.rrhh.modules.auth.application.AuthDtos.SesionResponse;
import com.techforb.rrhh.shared.security.CurrentUser;
import com.techforb.rrhh.shared.security.Roles;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<SesionResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        // Dummy session JWT would be generated and set as HttpOnly cookie
        // Dummy: accept only email 'rh@techforb.com' and password 'demo123'
        if ("rh@techforb.com".equalsIgnoreCase(request.email()) && "demo123".equals(request.password())) {
            // Aquí se simula emisión del JWT y seteo cookie HttpOnly (por ahora dummy)
            ResponseCookie cookie = ResponseCookie.from("rrhh_session", "dummytoken")
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(8 * 60 * 60) // 8 horas
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            SesionResponse sesion = new SesionResponse(
                    "f0fac4c1-63b9-47cd-8e99-f87e019aac9f",
                    "RH ADMIN",
                    "rh@techforb.com",
                    Roles.ADMIN_RRHH,
                    "techforb-org-uuid"
            );
            return ResponseEntity.ok(sesion);
        } else {
            // Dummy error: credenciales incorrectas, (HTTP 401)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Dummy: borra la cookie rrhh_session para simular cierre de sesión
        ResponseCookie cookie = ResponseCookie.from("rrhh_session", null)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ADMIN_RRHH')")
    public ResponseEntity<SesionResponse> getCurrentSession() {
        // Dummy: devuelve siempre la sesión de ejemplo
        SesionResponse sesion = new SesionResponse(
                "f0fac4c1-63b9-47cd-8e99-f87e019aac9f",
                "RH ADMIN",
                "rh@techforb.com",
                Roles.ADMIN_RRHH,
                "techforb-org-uuid"
        );
        return ResponseEntity.ok(sesion);
    }
}
