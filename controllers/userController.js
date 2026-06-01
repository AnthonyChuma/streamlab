const User = require("../models/User");

async function getUsers(req, res) {
  try {
    const users = await User.find({}, "username email role createdAt").sort({ createdAt: -1 });
    res.json({ total: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id, "username email role createdAt");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password, role } = req.body;
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(409).json({ error: "Usuario o email ya existe" });
    }
    const user = await User.create({ username, email, password, role: role || "user" });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const allowedUpdates = ['password', 'email'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        updates[field] = req.body[field];
      }
    });
    
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true, select: "username email role createdAt" });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
