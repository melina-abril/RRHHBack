-- Datos de ejemplo: cuenta administrativa RRHH.
-- Contraseña: Demo1234! (hash bcrypt ejemplo, no usar fuera de pruebas)
-- El UUID de organizacion_id debe pertenecer a la organización TECHFORB en ambiente real, aquí es uno de ejemplo (se recomienda cambiarlo).
INSERT INTO usuarios (organizacion_id, email, password_hash, nombre, rol, activo, created_at, created_by, updated_at, updated_by) VALUES
  (UNHEX(REPLACE('86bebb30-9373-44ba-b0ac-ffd7400eadb1','-','')),
   'admin.rrhh@example.com',
   '$2a$10$9AUdMo6RBfpxzRLfrxdQXucbXGPUNKmg.wBNdwquULzzE7612QhGO',
   'Administrador RRHH', 'ADMIN_RRHH', 1,
   CURRENT_TIMESTAMP(3), 'system', CURRENT_TIMESTAMP(3), 'system');
