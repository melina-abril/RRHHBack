package com.techforb.rrhh.modules.colaboradores.application;

import com.techforb.rrhh.shared.domain.PageResponse;
import com.techforb.rrhh.modules.colaboradores.domain.EstadoColaborador;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class ColaboradorDtos {
    /**
     * Record para crear colaborador
     */
    public record CrearColaboradorRequest(
        @NotBlank String nombre,
        @NotBlank String apellido,
        @NotBlank String documentoTipo,
        @NotBlank String documentoNumero,
        @NotBlank String paisResidencia,
        @NotNull LocalDate fechaNacimiento,
        @NotBlank String correoPersonal,
        @NotNull LocalDate fechaIngreso,
        @NotBlank String categoria,
        @NotBlank String dedicacion,
        @NotBlank String modalidadTrabajo,
        @NotBlank String rolLaboral,
        String emailCorporativo // opcional
    ) {}

    /**
     * Record para editar colaborador
     */
    public record EditarColaboradorRequest(
        @NotBlank String nombre,
        @NotBlank String apellido,
        @NotBlank String documentoTipo,
        @NotBlank String documentoNumero,
        @NotBlank String paisResidencia,
        @NotNull LocalDate fechaNacimiento,
        @NotBlank String correoPersonal,
        @NotBlank String categoria,
        @NotBlank String dedicacion,
        @NotBlank String modalidadTrabajo,
        @NotBlank String rolLaboral,
        String emailCorporativo // opcional
    ){}

    /**
     * Record de filtro (query params)
     */
    public record FiltroColaboradores(
        String busqueda,
        String categoria,
        String cliente,
        String proyecto,
        String estado
    ) {}

    /**
     * Resumen para el listado
     */
    public record ColaboradorResumen(
        Long id,
        String legajo,
        String nombreCompleto,
        String categoria,
        String cliente,
        String proyecto,
        EstadoColaborador estado
    ) {}

    /**
     * Ficha individual
     */
    public record ColaboradorFicha(
        Long id,
        String legajo,
        String nombre,
        String apellido,
        String documentoTipo,
        String documentoNumero,
        String paisResidencia,
        LocalDate fechaNacimiento,
        String correoPersonal,
        LocalDate fechaIngreso,
        String categoria,
        String dedicacion,
        String modalidadTrabajo,
        String rolLaboral,
        String emailCorporativo,
        EstadoColaborador estado,
        List<MovResumen> asignaciones,
        List<String> beneficios, // dummy
        List<String> documentos, // dummy
        List<String> evaluaciones, // dummy
        List<String> bitacora, // dummy
        List<String> remuneraciones, // dummy
        List<String> bonos // dummy
    ) {}

    /**
     * Asignaciones actuales/históricas (dummy por ahora)
     */
    public record MovResumen(
        String cliente,
        String proyecto,
        String rol,
        LocalDate inicio,
        LocalDate fin
    ){}
}
