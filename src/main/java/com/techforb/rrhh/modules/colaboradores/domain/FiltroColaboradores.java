package com.techforb.rrhh.modules.colaboradores.domain;

/**
 * Filtros del listado de colaboradores: búsqueda, categoría, cliente, proyecto y estado.
 */
public class FiltroColaboradores {
    private final String busqueda;
    private final String categoria;
    private final String cliente;
    private final String proyecto;
    private final String estado;

    public FiltroColaboradores(String busqueda, String categoria, String cliente, String proyecto, String estado) {
        this.busqueda = busqueda;
        this.categoria = categoria;
        this.cliente = cliente;
        this.proyecto = proyecto;
        this.estado = estado;
    }

    public String getBusqueda() {
        return busqueda;
    }
    public String getCategoria() {
        return categoria;
    }
    public String getCliente() {
        return cliente;
    }
    public String getProyecto() {
        return proyecto;
    }
    public String getEstado() {
        return estado;
    }
}
