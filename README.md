# Gestión de RR.HH. · Firestore

Estructura inicial de Cloud Firestore. Todavía no hay colecciones, scripts de carga ni índices compuestos de funcionalidades.

## Requisitos

- Node.js 24 o superior.
- Java para ejecutar el emulador de Firestore.

## Desarrollo local

```sh
npm install
npm run emulator
```

El emulador escucha en `127.0.0.1:8085` y su panel está disponible en `http://127.0.0.1:4005`. Cuando se incorporen scripts de carga, ejecútalos en otra terminal:

```sh
npm run seed:emulator
```

El runner aplica los scripts de `firestore/seeds` en orden de versión y registra los aplicados. También puedes comprobarlos con `npm run check` y probarlos con `npm run test:seeds` una vez que existan.

## Administración inicial

Cuando se incorpore el modelo de usuarios y se defina el código del rol administrador, crea la cuenta inicial con el script fijo; no agregues contraseñas a los scripts de carga:

```sh
npm run create-admin:emulator -- --email=admin@example.com --name="Administrador" --role=<CODIGO_ROL_ADMINISTRADOR>
```

Para restablecer su contraseña, repite el comando con `--reset`. En un entorno real, usa `npm run create-admin` con las credenciales de ese entorno. El script toma la contraseña de `ADMIN_PASSWORD` o genera una y la muestra una sola vez.

## Despliegue

Configura un proyecto Firebase real y las credenciales correspondientes antes de ejecutar:

```sh
npm run seed
npm run deploy:firestore
```

Las reglas actuales deniegan todas las lecturas y escrituras desde clientes. El backend con el SDK de administración no está sujeto a estas reglas.

## Scripts y colecciones

| Script | Colecciones |
|---|---|
| Ninguno todavía | Ninguna todavía |

Los pasos posteriores incorporarán los scripts versionados y documentarán sus colecciones en `docs/collections`.
