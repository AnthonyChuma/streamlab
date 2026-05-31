const User = require("../models/User");
const { generateToken } = require("../middleware/authMiddleware");

/**
 * LOGIN VULNERABLE - SOLO PARA DEMOSTRACIÓN ACADÉMICA
 * Esta función es DELIBERADAMENTE vulnerable a NoSQL Injection
 * 
 * Ejemplo de ataque:
 * {
 *   "username": { "$ne": null },
 *   "password": { "$ne": null }
 * }
 */
async function loginLab(req, res) {
  try {
    const { username, password } = req.body;
    
    // ⚠️ VULNERABLE: Construcción insegura de query
    // Los parámetros se usan directamente sin validación
    const user = await User.findOne({ username, password });
    
    if (!user) {
      return res.status(401).json({ 
        error: "Credenciales inválidas",
        hint: "💡 Intenta usar operadores MongoDB como { $ne: null }"
      });
    }

    const token = generateToken(user);
    res.json({ 
      message: "✅ Login exitoso",
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

/**
 * BÚSQUEDA VULNERABLE - Solo para usuarios autenticados
 * Permite buscar usuarios después de tener un token
 */
async function searchUsersLab(req, res) {
  try {
    const { username, email, role } = req.body;
    
    // Construir query dinámicamente (vulnerable pero con autenticación)
    const query = {};
    if (username) query.username = username;
    if (email) query.email = email;
    if (role) query.role = role;

    const usuarios = await User.find(query);
    
    if (usuarios.length > 0) {
      res.json({
        status: "✅ BÚSQUEDA EXITOSA",
        total: usuarios.length,
        usuarios: usuarios.map(u => ({
          id: u._id,
          username: u.username,
          email: u.email,
          role: u.role
        }))
      });
    } else {
      res.status(404).json({ status: "No se encontraron usuarios" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * OBTENER TODOS LOS USUARIOS - Solo para usuarios autenticados
 */
async function getUsersLab(req, res) {
  try {
    const usuarios = await User.find({}, "username email role createdAt");
    res.json({ 
      total: usuarios.length, 
      usuarios: usuarios.map(u => ({
        id: u._id,
        username: u.username,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * ACTUALIZACIÓN VULNERABLE - Solo para usuarios autenticados
 * Permite actualizar un usuario usando búsqueda insegura
 */
async function updateUserLab(req, res) {
  try {
    const { username, campo, valor } = req.body;
    
    // ⚠️ VULNERABLE: Campo y valor se usan sin validación
    if (!username || !campo || valor === undefined) {
      return res.status(400).json({ 
        error: "Se requieren: username, campo, valor" 
      });
    }

    const resultado = await User.findOneAndUpdate(
      { username },
      { [campo]: valor },
      { new: true }
    );

    if (resultado) {
      res.json({
        status: "✅ ACTUALIZACIÓN EXITOSA",
        usuario: {
          id: resultado._id,
          username: resultado.username,
          email: resultado.email,
          role: resultado.role
        }
      });
    } else {
      res.status(404).json({ status: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { 
  loginLab, 
  searchUsersLab, 
  getUsersLab, 
  updateUserLab 
};
