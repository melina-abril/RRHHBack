package com.techforb.rrhh.modules.employeeedition.application;

import com.techforb.rrhh.shared.domain.EmployeeDto;
import com.techforb.rrhh.shared.exception.BusinessException;
import com.techforb.rrhh.shared.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para editar colaboradores, conservando el historial de cambios y responsables.
 */
@Service
public class EmployeeEditionService {
    public EmployeeEditionService(){}

    /**
     * Modifica los datos personales y laborales de un colaborador por su identificador.
     * DUMMY: Implementación temporal (sin persistencia).
     * @param id  identificador colaborador (ej. legajo)
     * @param request datos editables
     * @return ficha actualizada
     */
    @Transactional
    public EmployeeDto updateEmployee(String id, UpdateEmployeeRequest request) {
        // TODO: reemplazar por acceso a base y conservación de historial con auditoría
        if (!"E-0001".equals(id)) {
            throw new NotFoundException("No existe un colaborador con el identificador indicado.");
        }
        // Respuesta dummy simulando el colaborador actualizado
        return new EmployeeDto() {
            @Override public String legajo() { return "E-0001"; }
            @Override public String nombre() { return request.nombre(); }
            @Override public String apellido() { return request.apellido(); }
            @Override public java.time.LocalDate fechaNacimiento() { return request.fechaNacimiento(); }
            @Override public String paisResidencia() { return request.paisResidencia(); }
            @Override public String correoPersonal() { return request.correoPersonal(); }
            @Override public java.time.LocalDate fechaIngreso() { return java.time.LocalDate.parse("2021-03-15"); }
            @Override public String categoria() { return request.categoria(); }
            @Override public String dedicacion() { return request.dedicacion(); }
            @Override public String modalidadTrabajo() { return request.modalidadTrabajo(); }
            @Override public String rolLaboral() { return request.rolLaboral(); }
            @Override public String estado() { return "ACTIVO"; }
            @Override public String cliente() { return "TECHFORB"; }
            @Override public String proyecto() { return "Portal RH"; }
            @Override public String referente() { return "Ana Pérez"; }
            @Override public String datosCorporativos() { return null; }
        };
    }
}
