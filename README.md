# Gestión de RR.HH - Backend

## Puesta en marcha

1. **Arranque de servicios requeridos**
   
   Levanta la base de datos y el servidor de correos de prueba:
   
   ```bash
   docker compose up -d
   ```
   
   (Esto inicia PostgreSQL 16 y Mailpit en los puertos correspondientes).

2. **Variables de entorno**
   
   Copia `.env.example` a `.env` y edita los valores según tu entorno local.

3. **Ejecución**

   Ejecuta la aplicación con Maven Wrapper (Java 21 requerido):
   
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Perfiles**

   Por defecto utiliza el perfil de desarrollo (`application-dev.yml`). 
   Apunta al frontend en `FRONT_URL` para CORS correctos.

5. **Convención de módulos**

   Cada funcionalidad reside en `src/main/java/com/techforb/rrhh/modules/{modulo}`. 
   Las capas son: `domain`, `application`, `infrastructure` y `api` según el patrón ejemplo (`colaboradores`).

---

## Otros

- Migraciones Flyway en `src/main/resources/db/migration`.
- Documentación Swagger: http://localhost:8080/swagger-ui.html
- Mailpit UI: http://localhost:8025

