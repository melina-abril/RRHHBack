-- Datos de ejemplo para autenticación: cuenta única de RH ADMIN

INSERT INTO admin_accounts (email, password_hash, nombre, rol, status)
VALUES ('rh@techforb.com', '$2y$10$vQOfDemoHashForThePurposeOfExampleQqDf31uZBypVfKe', 'RH ADMIN', 'ADMIN_RRHH', 'ACTIVE');

-- NOTA: El password_hash es ficticio. Se recomienda cambiarlo antes de pasar a producción.
