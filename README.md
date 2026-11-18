# Base de datos de Gestión de RR.HH

Cloud Firestore almacena los datos de RH smart. El backend accede mediante el SDK de administración; las reglas deniegan el acceso directo de clientes. La configuración de Firebase, el runner de carga y la herramienta para crear administradores ya forman parte del proyecto.

## Desarrollo local

Se requieren Node.js 24 o posterior y npm. Ejecuta `npm install` y, en una terminal, `npm run emulator`. Firestore estará en `127.0.0.1:8085` y el panel del emulador en el puerto `4005`. En otra terminal, ejecuta `npm run seed:emulator` para aplicar los scripts pendientes en orden de versión. El runner registra los scripts aplicados en `_seedHistory`; no modifiques un script que ya se haya aplicado. `npm run test:seeds` permite comprobar la carga en un emulador temporal.

El backend utiliza `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085` para conectarse al emulador. Su API escucha en el puerto 8080 con el prefijo `/api`. El frontend escucha en el puerto 4200 y dirige `/api` al backend. Estas variables se configuran en el entorno del backend; no se necesitan credenciales de servicio para el emulador.

## Colecciones y carga

| Script | Colecciones | Propósito |
|---|---|---|
| `firestore/seeds/V1__core.js` | `users` | Cuenta administradora de demostración |
| `firestore/seeds/V4__employees.js` | `employees` | Colaboradores de ejemplo |

El esquema de cada colección está en `docs/collections/`. Los módulos de inicio de sesión, pantalla principal, ficha individual y alta de colaborador no crean colecciones propias. Por ahora, el backend aprobado solo expone salud y autenticación; la existencia de datos de empleados no implica que ya haya endpoints para consultarlos.

La cuenta ficticia cargada en `users` es `rrhh@example.com`, con contraseña `Demo1234!` y rol `ADMIN`. Úsala solo para demostración. Para crear la cuenta inicial de un entorno real o restablecer su contraseña, ejecuta `npm run create-admin -- --email=admin@example.com --name="Administración de Recursos Humanos" --role=ADMIN` y usa `--reset` para restablecerla. Proporciona `ADMIN_PASSWORD` mediante una variable de entorno o deja que la herramienta genere una contraseña y la muestre una sola vez. La herramienta equivalente para el emulador es `npm run create-admin:emulator -- --email=admin@example.com --name="Administración de Recursos Humanos" --role=ADMIN`. No conserves activa la cuenta ficticia en producción.

## Proyecto real

Configura `FIREBASE_PROJECT_ID` con el identificador del proyecto y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a las credenciales de servicio, sin publicarlas en el repositorio. `npm run check` comprueba el estado de las cargas; `npm run seed` aplica los scripts pendientes. Ten en cuenta que V1 carga una cuenta de demostración: antes de usar un entorno real, planifica cómo deshabilitarla o eliminarla y crea la cuenta administradora mediante `npm run create-admin`. `npm run deploy:firestore` despliega las reglas y los índices. El archivo de índices está vacío porque las colecciones generadas hasta ahora no especifican consultas que combinen un filtro y un ordenamiento por otro campo.
