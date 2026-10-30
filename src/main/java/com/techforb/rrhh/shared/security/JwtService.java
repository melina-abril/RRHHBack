package com.techforb.rrhh.shared.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import java.util.Map;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

// Servicio para emitir y validar JWT HS256. Los métodos usados son los requeridos por AuthService.
@Service
public class JwtService {

    private final SecretKey secretKey;
    private static final long EXPIRATION_HOURS = 8;

    public JwtService(@Value("${app.jwt-secret}") String jwtSecret) {
        if(jwtSecret == null || jwtSecret.length() < 32) throw new IllegalArgumentException("El secreto JWT debe tener al menos 32 bytes.");
        this.secretKey = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    /**
     * Emite un JWT para el usuario autenticado.
     * @param userId UUID del usuario
     * @param nombre nombre del usuario
     * @param email email corporativo
     * @param rol rol de usuario (ej. ADMIN_RRHH)
     * @param organizacionId organización (UUID)
     * @return JWT válido
     */
    public String generarJwt(UUID userId, String nombre, String email, String rol, UUID organizacionId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("nombre", nombre)
                .claim("email", email)
                .claim("roles", rol)
                .claim("org", organizacionId.toString())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(EXPIRATION_HOURS, ChronoUnit.HOURS)))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Valida el JWT y extrae claims. Lanza JwtException si es inválido o expirado.
     */
    public Claims validarJwt(String jwt) throws JwtException {
        Jws<Claims> jws = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt);
        return jws.getBody();
    }
}
