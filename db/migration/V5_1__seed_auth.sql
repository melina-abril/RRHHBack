-- Datos de ejemplo para usuarios (ficticio: cuenta admin de RRHH TECHFORB).
-- Se insertan con UUID de ejemplo, no usar en producción.
INSERT INTO usuarios (id, organizacion_id, email, password_hash, nombre, rol, activo)
VALUES (
  UNHEX(REPLACE('11111111-2222-3333-4444-555555555555','-','')),
  NULL,
  'rh.admin@techforb.com',
  '$2a$10$EjemploHash1234567890123456789012345', -- hash ficticio (debe reemplazarse)
  'Administrador RRHH',
  'ADMIN',
  1
);
