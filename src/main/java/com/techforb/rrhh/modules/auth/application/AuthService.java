package com.techforb.rrhh.modules.auth.application;

import com.techforb.rrhh.modules.auth.application.AuthDtos.LoginRequest;
import com.techforb.rrhh.modules.auth.application.AuthDtos.SesionResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    public SesionResponse login(LoginRequest request) {
        // Dummy: simula autenticación exitosa, siempre devuelve admin
        return new SesionResponse(
            "e87e4b66-205a-47a4-8b48-cc11e72d9b31",
            "rh@techforb.com",
            "Administrador RH",
            "ADMIN_RRHH",
            "c470cf0d-d878-41ad-8aa3-2d1ac487ab22"
        );
        // Nota: reemplazar lógica dummy por autenticación real
    }

    public void logout() {
        // Dummy: no realiza ninguna acción (solo elimina cookie en controller)
    }

    public SesionResponse getSessionInfo() {
        // Dummy: siempre retorna sesión admin fija
        return new SesionResponse(
            "e87e4b66-205a-47a4-8b48-cc11e72d9b31",
            "rh@techforb.com",
            "Administrador RH",
            "ADMIN_RRHH",
            "c470cf0d-d878-41ad-8aa3-2d1ac487ab22"
        );
        // Nota: implementar lógica real a futuro
    }
}
