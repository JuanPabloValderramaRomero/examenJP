# examenjp

Este archivo es la guía rápida de ejecución (igual que `README.md`).

Este repositorio tiene 3 partes:

- `db/`: script de base de datos MySQL (`api-crud.sql`)
- `api_basic/`: API (Node.js + Express + MySQL)
- `ejemplo2/`: app Flutter (consume la API)

## Requisitos (una sola vez)

- **Node.js (LTS)** y **npm**
- **Flutter SDK**
- **MySQL** (o XAMPP/WAMP/Laragon con MySQL)

## 1) Descargar el proyecto (ZIP)

1. En GitHub: botón **Code** → **Download ZIP**
2. Descomprime el ZIP en tu PC
3. Abre una terminal en la carpeta descomprimida (donde están `api_basic/`, `db/`, `ejemplo2/`)

## 2) Base de datos (MySQL)

1. Inicia MySQL
2. Crea una base de datos llamada: `api-crud`
3. Importa el archivo: `db/api-crud.sql`

> Si usas XAMPP: entra a **phpMyAdmin** → crea `api-crud` → pestaña **Importar** → selecciona `db/api-crud.sql`.

## 3) Backend (API)

En la terminal:

```bash
cd api_basic
npm install
npm run dev
```

- La API queda en: `http://127.0.0.1:3000`
- Configuración en `api_basic/.env` (por defecto usa MySQL en `root` sin contraseña)

## 4) App Flutter

En otra terminal:

```bash
cd ejemplo2
flutter pub get
flutter run -d chrome
```

Notas rápidas:
- En **Android emulador** la app usa `http://10.0.2.2:3000` automáticamente.
- En **celular físico**, ejecuta así (reemplaza `TU_IP` por la IP de tu PC en la red):

```bash
flutter run --dart-define=API_BASE_URL=http://TU_IP:3000
```

## Problemas comunes

- Si en **PowerShell** `npm` da error de “scripts deshabilitados”, usa **CMD** o ejecuta `npm.cmd` (ej: `npm.cmd install`).
