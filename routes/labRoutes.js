const express = require("express");
const router = express.Router();
const { searchUsersLab, getUsersLab, updateUserLab } = require("../controllers/labController");
const { authenticateToken } = require("../middleware/authMiddleware");

// ⚠️ RUTAS DE LABORATORIO - SOLO PARA DEMOSTRACIÓN ACADÉMICA
// Estas rutas requieren autenticación para acceder a los datos vulnerables

/**
 * GET /api/lab/users
 * Obtiene la lista de todos los usuarios (requiere token)
 * 
 * Uso:
 * curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/lab/users
 */
router.get("/users", authenticateToken, getUsersLab);

/**
 * POST /api/lab/search-users
 * Busca usuarios de forma vulnerable (requiere token)
 * 
 * Ejemplo vulnerable:
 * {
 *   "username": { "$ne": null },
 *   "role": "admin"
 * }
 */
router.post("/search-users", authenticateToken, searchUsersLab);

/**
 * POST /api/lab/update-user
 * Actualiza un usuario (requiere token)
 * 
 * Cuerpo esperado:
 * {
 *   "username": "alice",
 *   "campo": "role",
 *   "valor": "admin"
 * }
 */
router.post("/update-user", authenticateToken, updateUserLab);

module.exports = router;
