# Arquitectura de Gestión de RR.HH

## Estructura modular

- **Monolito modular:** Cada dominio funcional es un módulo bajo `modules/{modulo}`.
- **Capas por módulo:**
  - `domain`: modelo, enums y puertos sin dependencias externas.
  - `application`: servicios, casos de uso y DTOs (records).
  - `infrastructure`: entidades JPA, adaptadores, repositorios Spring Data, integraciones externas.
  - `api`: controladores REST y contratos HTTP.

## Multi-organización (SaaS-ready)

- Cada tabla de negocio tiene `organizacion_id` (UUID).
- Organizacion obtenida siempre de `TenantContext` (claim 'org' del JWT).
- No se permite cross-organization.

## Seguridad

- JWT firmado HS256 en cookie HttpOnly 'rrhh_session'.
- Un rol principal: ADMIN_RRHH.
- Solo `/api/public/**`, `/api/auth/login` y `/actuator/health` son anónimos.

## Trazabilidad

- No se borra información de negocio.
- Cambios publican eventos que el módulo auditoría almacena con valores anterior/nuevo, responsable y fecha.

## Límites y dependencias

- Un módulo no accede directamente a las entidades de infraestructura de otro módulo.
- La comunicación es vía servicios de application, eventos de Spring o puertos compartidos.
- Validado por tests ArchUnit.
