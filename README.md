# Gestión de RR.HH - Backend

Backend monolítico modular Java 21 + Spring Boot 3.5 para Gestión de Recursos Humanos (TECHFORB): gestión de colaboradores, legajos, asignaciones, beneficios, ausencias, evaluaciones, remuneraciones, bonos, solicitudes, comunicados y horas extras.

## Cómo levantar el proyecto

### 1. Base de datos MySQL y migraciones

La base de datos y las migraciones (Flyway) están en la capa database, en la raíz de este repo. Levanta MySQL y aplica las migraciones ejecutando:

```sh
docker compose up -d
```

Esto crea una base `rrhh` en MySQL 8.4, usuario `rrhh`/`rrhh2024`.

### 2. Backend (Spring Boot)

#### Configura las variables de entorno necesarias:

- `DB_URL` — JDBC de la base (por defecto: jdbc:mysql://localhost:3306/rrhh?allowPublicKeyRetrieval=true&useSSL=false)
- `DB_USER` — Usuario de la base (por defecto: rrhh)
- `DB_PASSWORD` — Contraseña de la base (por defecto: rrhh2024)
- `JWT_SECRET` — Secreto HS256 de al menos 32 bytes para firmar JWT (por defecto: 9c16f299421141fcb0667adad2123a0d6bee0650012736b8eec4e41c8f17e5c3)
- `FRONT_URL` — Origen del frontend para CORS (por defecto: http://localhost:4200)
- `MAIL_HOST` — Host de SMTP para envío de mails (por defecto: localhost)
- `MAIL_PORT` — Puerto SMTP (por defecto: 1025)
- `MAIL_USER` — Usuario de SMTP (por defecto: rrhh)
- `MAIL_PASS` — Contraseña SMTP (por defecto: rrhhcorreo)
- `STORAGE_PATH` — Carpeta donde se guardan documentos y archivos (por defecto: ./storage)
- `ENLACE_AUSENCIA_HORAS` — Validez de enlaces públicos de solicitudes externas, en horas (por defecto: 48)

Valores por defecto ya configurados en `application.yml` y `application-dev.yml`. Usa un entorno de desarrollo (`spring.profiles.active=dev`) o ajusta según tus necesidades.

#### Para correr la aplicación:

```sh
mvn spring-boot:run
```

La app arranca en http://localhost:8080

Accede a la documentación de la API en http://localhost:8080/swagger-ui.html

---

## Estructura del proyecto

- `src/main/java/com/techforb/rrhh` — Paquete raíz y módulos (uno por funcionalidad)
- `modules/{modulo}` — Módulos por tema (colaboradores, solicitudes, beneficios, etc.)
- Cada módulo tiene sus capas: `domain`, `application`, `infrastructure`, `api`
- `shared/` — Código transversal: configuración, seguridad, auditoría, excepciones
- `src/main/resources` — Configuración Spring: `application.yml`, perfiles, mail, y recursos
- `docs/` — Documentación técnica y de arquitectura
- `src/test/` — Pruebas automatizadas (unitarias, integraciones, ArchUnit)

---

## Notas adicionales
- El backend NO ejecuta migraciones, ni crea la base: debes aplicar las migraciones con Flyway desde la capa database.
- **Importante:** la clase principal es `com.techforb.rrhh.RrhhApplication`. Si elimina este archivo, la app no arranca.
- El backend filtra todo por `organizacion_id` (multiempresa, listo para SaaS), extraído siempre del JWT (nunca de la request).
- Configura correctamente CORS según el dominio donde levantes el frontend (`FRONT_URL`).