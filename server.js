require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const genreRoutes = require("./routes/genreRoutes");
const pageRoutes = require("./routes/pageRoutes");
const { authenticateToken } = require("./middleware/authMiddleware");
const { profile } = require("./controllers/authController");
const User = require("./models/User");
const Movie = require("./models/Movie");
const Series = require("./models/Series");
const Genre = require("./models/Genre");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/profile", authenticateToken, profile);
app.use("/", pageRoutes);
app.use(express.static(path.join(__dirname, "public")));


app.get("/api", (req, res) => {
  res.json({
    app: "StreamLab",
    status: "online",
    message: "API activa"
  });
});

async function seedDatabase() {
  const adminExists = await User.exists({ role: "admin" });
  if (!adminExists) {
    await User.create({ username: "admin", password: "admin0101001", email: "admin01@gmail.com", role: "admin" });
    console.log("🔐 Administrador inicial creado");
  }

  const userCount = await User.countDocuments();
  if (userCount === 1) {
    await User.insertMany([
      { username: "alice", password: "user123", email: "alice@streamlab.com", role: "user" },
      { username: "carlos", password: "carlos123", email: "carlos@streamlab.com", role: "user" },
    ]);
    console.log("Usuarios normales de ejemplo creados");
  }

  const movieCount = await Movie.countDocuments();
  if (movieCount === 0) {
    await Movie.insertMany([
      {
        title: "Nebula Drift",
        description: "Un piloto audaz lucha para salvar una estación espacial en el borde de la galaxia.",
        genre: "Ciencia ficción",
        year: 2023,
        rating: 8.3,
        image: "/images/movie1.svg",
      },
      {
        title: "Crimson City",
        description: "Un detective busca justicia en una metrópolis nocturna llena de secretos.",
        genre: "Thriller",
        year: 2022,
        rating: 7.9,
        image: "/images/movie2.svg",
      },
      {
        title: "Rising Sun",
        description: "Una joven bailarina descubre su voz y su destino en un mundo de luces y música.",
        genre: "Drama",
        year: 2024,
        rating: 8.6,
        image: "/images/movie3.svg",
      },
      {
        title: "Midnight Run",
        description: "Amigos se enfrentan a aventuras peligrosas en una noche de fuga urbana.",
        genre: "Acción",
        year: 2021,
        rating: 7.5,
        image: "/images/movie4.svg",
      },
      {
        title: "Echoes of Tomorrow",
        description: "Una periodista encuentra una conspiración que cambia el futuro de la ciudad.",
        genre: "Suspenso",
        year: 2023,
        rating: 8.1,
        image: "/images/movie5.svg",
      },
      {
        title: "Moonlight Drive",
        description: "Un road trip romántico con viajes, risas y decisiones inolvidables.",
        genre: "Romance",
        year: 2022,
        rating: 7.8,
        image: "/images/movie6.svg",
      },
    ]);
    console.log("🎬 Películas de ejemplo creadas");
  }
}

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/streamlab";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    seedDatabase();
  })
  .catch((err) => console.error("❌ Error de conexión:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
