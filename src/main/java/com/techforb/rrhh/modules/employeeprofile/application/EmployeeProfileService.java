package com.techforb.rrhh.modules.employeeprofile.application;

import com.techforb.rrhh.shared.domain.EmployeeDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EmployeeProfileService {
    /**
     * Devuelve la ficha individual de un colaborador con todos sus datos personales y laborales.
     * Esto es una implementación dummy que retorna un ejemplo realista fijo.
     * Deberá ser reemplazada por la consulta real a la base y dominio correspondiente.
     */
    public EmployeeProfileDto getEmployeeProfile(String legajo) {
        // Dummy response para ficha individual de ejemplo
        if ("E-0001".equalsIgnoreCase(legajo)) {
            return new EmployeeProfileDto(
                "E-0001",
                "Ana",
                "Pérez",
                LocalDate.of(1990, 4, 2),
                "Argentina",
                "ana.perez@example.com",
                LocalDate.of(2021, 3, 15),
                "Permanente",
                "Full-time",
                "Presencial",
                "Jefe RRHH",
                "ACTIVO",
                "Techforb",
                "RRHH 2024",
                "RH ADMIN",
                "ana.perez@techforb.com"
            );
        }
        if ("E-0002".equalsIgnoreCase(legajo)) {
            return new EmployeeProfileDto(
                "E-0002",
                "Juan",
                "García",
                LocalDate.of(1986, 7, 18),
                "Argentina",
                "juan.garcia@example.com",
                LocalDate.of(2022, 9, 1),
                "Permanente",
                "Full-time",
                "Híbrido",
                "Desarrollador/a",
                "ACTIVO",
                "Techforb",
                "TalentSoft 2024",
                "Lucía Méndez",
                "juan.garcia@techforb.com"
            );
        }
        // No encontrado: lanzaría una excepción de "no encontrado" / 404 si estuviese implementada
        throw new RuntimeException("Colaborador no encontrado (dummy)");
    }
}
