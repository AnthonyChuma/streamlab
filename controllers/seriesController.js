const Series = require("../models/Series");

async function getSeries(req, res) {
  try {
    const { search, genre, year } = req.query;
    const filter = {};
    if (genre && genre !== "all") filter.genre = genre;
    if (year) filter.year = Number(year);
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const term = new RegExp(escapedSearch, "i");
      filter.$or = [{ title: term }, { description: term }];
    }

    const series = await Series.find(filter).sort({ rating: -1, year: -1 });
    res.json({ total: series.length, series });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getSerie(req, res) {
  try {
    const serie = await Series.findById(req.params.id);
    if (!serie) return res.status(404).json({ error: "Serie no encontrada" });
    res.json(serie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createSerie(req, res) {
  try {
    const { title, description, genre, year, rating, image } = req.body;
    const serie = await Series.create({ title, description, genre, year, rating, image });
    res.status(201).json(serie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateSerie(req, res) {
  try {
    const serie = await Series.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!serie) return res.status(404).json({ error: "Serie no encontrada" });
    res.json(serie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteSerie(req, res) {
  try {
    const serie = await Series.findByIdAndDelete(req.params.id);
    if (!serie) return res.status(404).json({ error: "Serie no encontrada" });
    res.json({ message: "Serie eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getSeries, getSerie, createSerie, updateSerie, deleteSerie };
