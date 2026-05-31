const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "streaming-lab-secret";

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers["x-auth-token"];
  let token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token && req.headers.cookie) {
    const cookieHeader = req.headers.cookie.split(";").map(part => part.trim());
    const authCookie = cookieHeader.find((cookie) => cookie.startsWith("auth_token="));
    if (authCookie) {
      token = authCookie.split("=")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };
}

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
}

module.exports = { authenticateToken, authorizeRoles, generateToken };
