-- V2_1__seed_auth.sql
-- Datos de ejemplo para auth_session_logs (accesos y sesiones de Recursos Humanos)

INSERT INTO auth_session_logs (employee_id, login_at, logout_at, ip_address, user_agent, note) VALUES
  (
    (SELECT id FROM employees WHERE email = 'sofia.gomez@example.com'),
    '2024-06-27 08:12:10',
    '2024-06-27 16:41:30',
    '192.168.0.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Inicio de jornada habitual'
  ),
  (
    (SELECT id FROM employees WHERE email = 'sofia.gomez@example.com'),
    '2024-06-26 07:55:42',
    '2024-06-26 17:00:12',
    '192.168.0.9',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Cierre habitual'
  ),
  (
    (SELECT id FROM employees WHERE email = 'sofia.gomez@example.com'),
    '2024-06-25 09:10:11',
    NULL,
    '192.168.0.10',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'Sesión no cerrada (pendiente cierre)'
  );
