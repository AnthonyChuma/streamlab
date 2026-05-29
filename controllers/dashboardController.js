const User = require("../models/User");
const Movie = require("../models/Movie");
const Series = require("../models/Series");
const Genre = require("../models/Genre");

async function getDashboardStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalSeries = await Series.countDocuments();
    const totalGenres = await Genre.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const movies = await Movie.find({}, "title genre year rating image").sort({ rating: -1, year: -1 });
    const series = await Series.find({}, "title genre year rating image").sort({ rating: -1, year: -1 });
    const genres = await Genre.find({}, "name description").sort({ name: 1 });
    const users = await User.find({}, "username email role createdAt").sort({ createdAt: -1 });

    res.json({ totalUsers, totalMovies, totalSeries, totalGenres, totalAdmins, users, movies, series, genres });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getDashboardStats };
