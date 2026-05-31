const User = require("../models/User");
const { generateToken } = require("../middleware/authMiddleware");

/**
 * LOGIN
 * Esta ruta recibe username y password y busca el usuario en la base de datos.
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;
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

module.exports = { login, signup, profile };
