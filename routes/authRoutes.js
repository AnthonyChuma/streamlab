const express = require("express");
const router = express.Router();
const { login, loginLab, signup, profile } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Rutas de producción (seguras)
router.post("/login", login);
router.post("/signup", signup);
router.get("/me", authenticateToken, profile);

// ⚠️ RUTAS DE LABORATORIO - SOLO PARA DEMOSTRACIÓN ACADÉMICA
/**
 * POST /api/auth/login-lab
 * Login vulnerable a NoSQL Injection
 * 
 * Intento normal:
 * { "username": "alice", "password": "user123" }
 * 
 * Intento de bypass con NoSQL Injection:
 * { "username": { "$ne": null }, "password": { "$ne": null } }
 */
router.post("/login-lab", loginLab);

module.exports = router;
