# Arquitectura de Gestión de RR.HH - Backend

## Monolito Modular

El proyecto implementa un monolito modular bajo el paquete raíz `com.techforb.rrhh`. Cada módulo reside bajo `modules/{modulo}` y a su vez organiza sus capas en:
- `domain`: modelos y puertos (sin dependencias a Spring ni a otros dominios)
- `application`: servicios transaccionales, reglas de negocio, DTOs
- `infrastructure`: entidades JPA, repositorios Spring Data, adaptadores
- `api`: controladores REST (REST bajo `/api/{modulo}`)

### Límites y acceso
- Un módulo nunca accede directamente a entidades o repositorios de otro: en tal caso usa el servicio de aplicación o eventos de Spring.
- ArchUnit (tests) valida los límites.
- Ejemplo: el módulo `colaboradores` muestra el patrón a seguir.

## Multi-organización

- Toda entidad relevante lleva `organizacion_id` (`UUID`)
- La organización actual proviene únicamente del JWT (claim `org`), JAMÁS de la request ni del body; se obtiene desde `TenantContext`.
- El filtro Hibernate `organizacionFilter` se activa en cada transacción y limita el acceso a los datos de la organización actual.

## Seguridad

- Login único (USERNAME: email corporativo, contraseña) via `/api/auth/login`, emite JWT firmado (HS256) almacenado en cookie HttpOnly Secure SameSite=Lax con nombre `rrhh_session`
- Rol único: `ADMIN_RRHH`
- Panel administrativo: sólo para administradores internos. Los colaboradores gestionan ausencias y datos personales vía formularios externos `public`+token

## Trazabilidad

- Todos los cambios relevantes (altas, edición de datos, egresos, renovaciones, liquidaciones, solicitudes, beneficios, etc.) publican eventos y son auditados por el módulo de auditoría (`append-only`)
- Nada de negocio se elimina físicamente

## Decisiones de seguridad

- JWT HS256 firmado con secreto de entorno
- No se permite el paso de `organizacionId` por body ni query
- CORS restringido al frontend configurado vía `FRONT_URL`

## Base de datos
- PostgreSQL 16
- Migraciones con Flyway: toda tabla/grupo funcional agrega migración bajo `db/migration/Vn__{nombre}.sql`
- Convención sobre nombres en español y snake_case
- DDL válido sólo con scripts Flyway; `ddl-auto: validate`
