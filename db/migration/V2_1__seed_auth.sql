-- Datos de ejemplo para autenticación administrativa (usuarios ficticios, contraseñas NO reales, solo hash de ejemplo)
-- Admin RRHH principal (relacionado a empleado de ejemplo, email y hash de contraseña dummy)
INSERT INTO admin_users (employee_id, email, password_hash, role, enabled, created_at, updated_at) VALUES
  ((SELECT id FROM employees WHERE employee_number = 'E-0001'), 'rh@techforb.com', '$2a$12$hashdemoejemplo1234567890HashForb', 'ADMIN_RRHH', 1, NOW(3), NOW(3));

-- Sesión activa (dummy) para usuario admin, token de ejemplo
INSERT INTO admin_sessions (user_id, session_token, issued_at, expires_at, created_at, updated_at)
SELECT id, 'token-demo-123456', NOW(3), DATE_ADD(NOW(3), INTERVAL 8 HOUR), NOW(3), NOW(3)
FROM admin_users WHERE email = 'rh@techforb.com';

-- Historial de acceso (un login exitoso y uno fallido)
INSERT INTO admin_login_history (user_id, login_at, success, ip_address, user_agent, fail_reason, created_at)
SELECT id, DATE_SUB(NOW(3), INTERVAL 1 DAY), 1, '192.168.1.10', 'Mozilla/5.0', NULL, DATE_SUB(NOW(3), INTERVAL 1 DAY)
FROM admin_users WHERE email = 'rh@techforb.com';

INSERT INTO admin_login_history (user_id, login_at, success, ip_address, user_agent, fail_reason, created_at)
SELECT id, DATE_SUB(NOW(3), INTERVAL 2 DAY), 0, '192.168.1.10', 'Mozilla/5.0', 'Wrong password', DATE_SUB(NOW(3), INTERVAL 2 DAY)
FROM admin_users WHERE email = 'rh@techforb.com';
