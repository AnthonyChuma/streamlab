const User = require("../models/User");
const { generateToken } = require("../middleware/authMiddleware");

/**
 * Sanitizar entrada para prevenir NoSQL injection
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[{\"$}]/g, '').substring(0, 100);
}

/**
 * LOGIN
 * Esta ruta recibe username y password y busca el usuario en la base de datos.
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    // Validar entrada
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: "Username y password requeridos" });
    }
    
    // Sanitizar entrada
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);
    
    const user = await User.findOne({ username: sanitizedUsername, password: sanitizedPassword });
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

async function signup(req, res) {
  try {
    const { username, password, email } = req.body;
    
    // Validar entrada
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    if (typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string') {
      return res.status(400).json({ error: "Campos inválidos" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);

    const existingUser = await User.findOne({ $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }] });
    if (existingUser) {
      return res.status(409).json({ error: "El usuario o el email ya existen" });
    }

    const user = await User.create({ username: sanitizedUsername, password, email: sanitizedEmail, role: "user" });
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

module.exports = { login, signup, profile };
