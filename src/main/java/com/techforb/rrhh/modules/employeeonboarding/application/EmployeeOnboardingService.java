package com.techforb.rrhh.modules.employeeonboarding.application;

import com.techforb.rrhh.shared.domain.EmployeeDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

/**
 * Servicio de negocio para alta de colaborador.
 */
@Service
public class EmployeeOnboardingService {
    @Transactional
    public EmployeeDto createEmployee(CreateEmployeeRequest request) {
        // Implementación dummy temporal: simula validación y alta, devuelve ficha de ejemplo
        // TODO: Integrar persistencia, validaciones y generación de legajo único con el dominio compartido (cuando esté disponible)
        return new EmployeeDto() {
            @Override
            public String legajo() { return "E-0010"; }
            @Override
            public String nombre() { return request.nombre(); }
            @Override
            public String apellido() { return request.apellido(); }
            @Override
            public LocalDate fechaNacimiento() { return request.fechaNacimiento(); }
            @Override
            public String paisResidencia() { return request.paisResidencia(); }
            @Override
            public String correoPersonal() { return request.correoPersonal(); }
            @Override
            public LocalDate fechaIngreso() { return request.fechaIngreso(); }
            @Override
            public String categoria() { return request.categoria(); }
            @Override
            public String dedicacion() { return request.dedicacion(); }
            @Override
            public String modalidadTrabajo() { return request.modalidadTrabajo(); }
            @Override
            public String rolLaboral() { return request.rolLaboral(); }
            @Override
            public String estado() { return "ACTIVO"; }
            @Override
            public String cliente() { return request.cliente(); }
            @Override
            public String proyecto() { return request.proyecto(); }
            @Override
            public String referente() { return request.referente(); }
            @Override
            public String datosCorporativos() { return request.datosCorporativos(); }
        };
    }
}
