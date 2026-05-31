# StreamLab

StreamLab es una aplicación de muestra construida con Node.js, Express y MongoDB.
Provee un catálogo de películas, series y géneros, junto con autenticación de usuarios y un panel administrativo.

## 📦 Características principales

- Inicio de sesión y registro de usuarios
- Catálogo de películas, series y géneros
- Búsqueda de películas
- Panel administrativo para gestión de usuarios, películas, series y géneros
- Autenticación basada en JWT
- Compatible con MongoDB Atlas y despliegue en Railway

## 🛠️ Instalación local

### Requisitos
- Node.js 14+
- npm o yarn

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone <url-repo>
   cd DB_MONGO
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env`
   -Editar los valores de `MONGO_URI`, `JWT_SECRET` y `PORT`

4. Iniciar el servidor:
   ```bash
   npm start
   ```

El servidor iniciará en `http://localhost:3000`.

## 🔧 Variables de entorno

El proyecto usa las siguientes variables de entorno:

| Variable | Descripción |
|----------|-------------|
| `MONGO_URI` | Cadena de conexión de MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para tokens JWT |
| `PORT` | Puerto del servidor |

> No incluyas tu `.env` en el repositorio. Usa `.env.example` como referencia.

## 🚀 Despliegue en Railway

1. Conecta tu repositorio a Railway.
2. Añade las variables de entorno en el proyecto Railway.
3. Despliega la aplicación.

## 🧩 Notas

- Mantén `MONGO_URI` en tu `.env` o en las variables de Railway.
- El archivo `.env` no debe subirse a GitHub.
- La aplicación usa JWT para proteger rutas sensibles.
