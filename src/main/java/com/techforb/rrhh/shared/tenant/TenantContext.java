package com.techforb.rrhh.shared.tenant;

import com.techforb.rrhh.shared.security.CurrentUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.Authentication;
import java.util.UUID;

/**
 * Utilidad para obtener el organizacionId actual desde el contexto de seguridad (claim "org" en el JWT)
 */
public class TenantContext {

    private TenantContext() {}

    public static UUID getOrganizacionId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            String orgValue = jwt.getClaimAsString("org");
            if(orgValue != null) {
                return UUID.fromString(orgValue);
            }
        }
        throw new IllegalStateException("No organization in authentication context");
    }
}
