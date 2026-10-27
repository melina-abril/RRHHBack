# Gestión de RR.HH – Backend

Plataforma de gestión de Recursos Humanos para TECHFORB.

## Levantamiento en desarrollo

1. Levanta los servicios base:

   ```
   docker compose up -d
   ```

2. Crea el archivo `.env` copiando y editando `.env.example` según corresponda.

3. Inicia la aplicación:

   ```
   ./mvnw spring-boot:run
   ```

- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- Base de datos: PostgreSQL (puerto 5432, usuario/contraseña configurables)
- Correo de prueba: Mailpit ([http://localhost:8025](http://localhost:8025), SMTP en localhost:1025)

## Convención de módulos

- Cada funcionalidad está en `src/main/java/com/techforb/rrhh/modules/{modulo}` (ejemplo: `colaboradores`).
- Capas: domain, application, infrastructure, api.
- Toda entidad de negocio lleva `organizacion_id` (multi-tenant, preparado para SaaS).
- Seguridad: JWT HS256 en cookie HttpOnly 'rrhh_session'.
- Validaciones, manejo de errores y trazabilidad automáticos según arquitectura.
