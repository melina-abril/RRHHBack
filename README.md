# Gestión de RR.HH. — Firestore

Base Cloud Firestore en modo nativo. Esta estructura inicial no contiene colecciones, datos de ejemplo ni índices compuestos. Los scripts de carga versionados se incorporarán con las funcionalidades.

## Requisitos

- Node.js 24 o posterior
- npm

Instala las dependencias con `npm install`.

## Emulador y carga de datos

Inicia el emulador con `npm run emulator`. Firestore estará en `127.0.0.1:8085` y el panel del emulador en el puerto `4005`.

En otra terminal, ejecuta `npm run seed:emulator` para aplicar los scripts de `firestore/seeds` cuando existan. El runner los aplica en orden de versión y registra cuáles se aplicaron. También puedes ejecutar `npm run test:seeds` para iniciar el emulador, aplicar los scripts y detenerlo al finalizar.

| Scripts versionados | Colecciones |
|---|---|
| Ninguno todavía | Ninguna todavía |

## Proyecto real

Configura `FIREBASE_PROJECT_ID` con el identificador de tu proyecto y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a un archivo de credenciales autorizado. No incluyas ese archivo en el repositorio. Ejecuta `npm run seed` para aplicar los scripts disponibles y `npm run deploy:firestore` para desplegar las reglas y los índices.

Cuando se incorpore la colección de usuarios, crea la cuenta administradora inicial con `npm run create-admin -- --email=admin@example.com --name="Administrador" --role=CODIGO_DEL_ROL_ADMINISTRADOR`, sustituyendo el correo y el código del rol por los aprobados para el entorno. Puedes proporcionar la contraseña mediante `ADMIN_PASSWORD` o dejar que la herramienta genere una y la muestre una sola vez. Para restablecerla, vuelve a ejecutar el comando con `--reset`. En el emulador, usa `npm run create-admin:emulator -- --email=admin@example.com --name="Administrador" --role=CODIGO_DEL_ROL_ADMINISTRADOR` después de cargar los datos necesarios.

Las reglas rechazan todo acceso directo desde clientes. El backend accede mediante el SDK de administración, que no está sujeto a estas reglas.
