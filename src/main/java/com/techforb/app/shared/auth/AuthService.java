package com.techforb.app.shared.auth;

import com.techforb.app.shared.error.UnauthorizedException;
import com.techforb.app.shared.security.CurrentUser;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Valida credenciales contra la tabla users y emite el JWT de sesión con los claims que lee CurrentUser. */
@Service
public class AuthService {

    private final UserAccountRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final Clock clock;
    private final Duration sessionDuration;

    public AuthService(UserAccountRepository users, PasswordEncoder passwordEncoder, JwtEncoder jwtEncoder, Clock clock,
            @Value("${app.security.session-hours}") long sessionHours) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.clock = clock;
        this.sessionDuration = Duration.ofHours(sessionHours);
    }

    public Duration sessionDuration() {
        return sessionDuration;
    }

    /** Usuario activo con esa contraseña; si no, 401 con el mismo mensaje (no se revela si el correo existe). */
    @Transactional(readOnly = true)
    public CurrentUser authenticate(LoginRequest request) {
        return users.findByEmailIgnoreCase(request.email().trim())
                .filter(UserAccountEntity::isActive)
                .filter(user -> passwordEncoder.matches(request.password(), user.getPasswordHash()))
                .map(user -> new CurrentUser(user.getId(), user.getName(), user.getEmail(), user.getRole()))
                .orElseThrow(() -> new UnauthorizedException("INVALID_CREDENTIALS", "El correo o la contraseña no son correctos."));
    }

    public String issueToken(CurrentUser user) {
        Instant now = Instant.now(clock);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(user.id())
                .issuedAt(now)
                .expiresAt(now.plus(sessionDuration))
                .claim(CurrentUser.CLAIM_NAME, user.name())
                .claim(CurrentUser.CLAIM_EMAIL, user.email())
                .claim(CurrentUser.CLAIM_ROLE, user.role())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
