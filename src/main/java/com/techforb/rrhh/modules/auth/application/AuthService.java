package com.techforb.rrhh.modules.auth.application;

import com.techforb.rrhh.modules.auth.application.AuthDtos.LoginRequest;
import com.techforb.rrhh.modules.auth.application.AuthDtos.SesionResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    public SesionResponse login(LoginRequest login) {
        // Dummy implementation: solo acepta email 'rh@techforb.com' y password 'demo123'
        if ("rh@techforb.com".equalsIgnoreCase(login.email()) && "demo123".equals(login.password())) {
            return new SesionResponse(
                    "f0fac4c1-63b9-47cd-8e99-f87e019aac9f",
                    "RH ADMIN",
                    "rh@techforb.com",
                    "ADMIN_RRHH",
                    "techforb-org-uuid"
            );
        } else {
            // Dummy: devuelve null, el controller responde 401
            return null;
        }
    }

    public SesionResponse getCurrentSession() {
        // Dummy: devuelve siempre la sesión de ejemplo
        return new SesionResponse(
                "f0fac4c1-63b9-47cd-8e99-f87e019aac9f",
                "RH ADMIN",
                "rh@techforb.com",
                "ADMIN_RRHH",
                "techforb-org-uuid"
        );
    }

    public void logout() {
        // Dummy: no hace nada, la cookie se borra en el controller
    }
}
