const Genre = require("../models/Genre");

async function getGenres(req, res) {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.json({ total: genres.length, genres });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getGenre(req, res) {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ error: "Género no encontrado" });
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createGenre(req, res) {
  try {
    const { name, description } = req.body;
    const existing = await Genre.findOne({ name });
    if (existing) return res.status(409).json({ error: "El género ya existe" });
    const genre = await Genre.create({ name, description });
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateGenre(req, res) {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!genre) return res.status(404).json({ error: "Género no encontrado" });
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteGenre(req, res) {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).json({ error: "Género no encontrado" });
    res.json({ message: "Género eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getGenres, getGenre, createGenre, updateGenre, deleteGenre };
