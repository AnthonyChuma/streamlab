const User = require("../models/User");
const { generateToken } = require("../middleware/authMiddleware");

/**
 * LOGIN SEGURO - Producción
 * Validación e inyección de consulta protegidas
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ error: "Username y password son requeridos" });
    }
    
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = generateToken(user);
    res.json({ token, user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * LOGIN VULNERABLE - LABORATORIO ACADÉMICO
 * ⚠️ DELIBERADAMENTE INSEGURO PARA DEMOSTRACIÓN DE NOSQL INJECTION
 * 
 * Vulnerable a ataques como:
 * {
 *   "username": { "$ne": null },
 *   "password": { "$ne": null }
 * }
 * 
 * Esto bypasea el login retornando el primer usuario.
 */
async function loginLab(req, res) {
  try {
    const { username, password } = req.body;
    
    // ⚠️ VULNERABLE: Sin validación de tipos en la consulta
    // Los parámetros van directamente a la base de datos
    const user = await User.findOne({ username, password });
    
    if (!user) {
      return res.status(401).json({ 
        error: "Credenciales inválidas",
        hint: "💡 Intenta usar operadores NoSQL como { $ne: null }"
      });
    }

    const token = generateToken(user);
    res.json({ 
      message: "✅ Login exitoso (Laboratorio)",
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function signup(req, res) {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: "El usuario o el email ya existen" });
    }

    const user = await User.create({ username, password, email, role: "user" });
    const token = generateToken(user);
    res.status(201).json({ token, user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function profile(req, res) {
  try {
    const user = req.user;
    res.json({ user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { login, loginLab, signup, profile };
