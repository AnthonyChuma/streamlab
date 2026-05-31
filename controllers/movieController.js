const Movie = require("../models/Movie");

async function getMovies(req, res) {
  try {
    const { search, genre, year } = req.query;
    const filter = {};

    if (genre && genre !== "all") {
      filter.genre = genre;
    }
    if (year) {
      filter.year = Number(year);
    }
    if (search) {
      const term = new RegExp(search, "i");
      filter.$or = [
        { title: term },
        { description: term },
      ];
    }

    const movies = await Movie.find(filter).sort({ rating: -1, year: -1 });
    res.json({ total: movies.length, movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function searchMovies(req, res) {
  try {
    const title = req.method === "GET" ? req.query.title : req.body.title;
    const genre = req.method === "GET" ? req.query.genre : req.body.genre;
    const filter = {};

    if (title !== undefined) {
      if (req.method === "GET") {
        filter.title = new RegExp(title, "i");
      } else {
        filter.title = title;
      }
    }

    if (genre && genre !== "all") {
      filter.genre = genre;
    }

    const movies = await Movie.find(filter).sort({ rating: -1, year: -1 });
    res.json({ total: movies.length, movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMovie(req, res) {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createMovie(req, res) {
  try {
    const { title, description, genre, year, rating, image } = req.body;
    const movie = await Movie.create({ title, description, genre, year, rating, image });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateMovie(req, res) {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteMovie(req, res) {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json({ message: "Película eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getMovies, searchMovies, getMovie, createMovie, updateMovie, deleteMovie };
