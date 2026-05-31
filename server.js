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
const labRoutes = require("./routes/labRoutes");
const { authenticateToken } = require("./middleware/authMiddleware");
const User = require("./models/User");
const Movie = require("./models/Movie");
const Series = require("./models/Series");
const Genre = require("./models/Genre");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ⚠️ RUTAS DE LABORATORIO - SOLO PARA DEMOSTRACIÓN ACADÉMICA
app.use("/api/lab", labRoutes);

app.use("/", pageRoutes);

app.get("/api", (req, res) => {
  res.json({
    app: "Streaming Lab - NoSQL Injection Demo",
    production_endpoints: {
      "POST /api/auth/login": "Iniciar sesión (seguro)",
      "POST /api/auth/signup": "Crear usuario (seguro)",
      "GET /api/auth/me": "Perfil del usuario autenticado",
      "GET /api/movies": "Listar películas",
      "POST /api/movies": "Agregar película (admin)",
      "PUT /api/movies/:id": "Editar película (admin)",
      "DELETE /api/movies/:id": "Eliminar película (admin)",
      "GET /api/series": "Listar series",
      "POST /api/series": "Agregar serie (admin)",
      "PUT /api/series/:id": "Editar serie (admin)",
      "DELETE /api/series/:id": "Eliminar serie (admin)",
      "GET /api/genres": "Listar géneros",
      "POST /api/genres": "Crear género (admin)",
      "PUT /api/genres/:id": "Editar género (admin)",
      "DELETE /api/genres/:id": "Eliminar género (admin)",
      "GET /api/users": "Listar usuarios (admin)",
      "POST /api/users": "Crear usuario (admin)",
      "GET /api/dashboard/stats": "Estadísticas del dashboard (admin)",
      "POST /buscar-usuario": "Búsqueda de usuarios (requiere token)",
      "POST /actualizar": "Actualizar usuario (requiere token)"
    },
    lab_endpoints: {
      "warning": "⚠️ SOLO PARA DEMOSTRACIÓN ACADÉMICA",
      "POST /api/auth/login-lab": "Login VULNERABLE a NoSQL Injection",
      "GET /api/lab/users": "Listar usuarios (requiere token)",
      "POST /api/lab/search-users": "Buscar usuarios (requiere token, vulnerable)",
      "POST /api/lab/update-user": "Actualizar usuario (requiere token, vulnerable)"
    },
    lab_examples: {
      "bypass_login": {
        "description": "Bypass de login sin credenciales válidas",
        "payload": {
          "username": { "$ne": null },
          "password": { "$ne": null }
        }
      },
      "update_role": {
        "description": "Cambiar rol de usuario a admin",
        "endpoint": "POST /api/lab/update-user",
        "payload": {
          "username": "alice",
          "campo": "role",
          "valor": "admin"
        },
        "requires": "Token válido"
      }
    }
  });
});

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await User.find({});
    res.json({ total: usuarios.length, usuarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ⚠️ RUTA DE LABORATORIO - REQUIERE AUTENTICACIÓN
// Antes era pública, ahora está protegida con token
app.post("/buscar-usuario", authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;
    const usuarios = await User.find({ username });
    if (usuarios.length > 0) {
      res.json({
        status: "BÚSQUEDA EXITOSA",
        total: usuarios.length,
        usuarios,
      });
    } else {
      res.status(404).json({ status: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ⚠️ RUTA DE LABORATORIO - REQUIERE AUTENTICACIÓN
// Antes era pública, ahora está protegida con token
app.post("/actualizar", authenticateToken, async (req, res) => {
  try {
    const { username, campo, valor } = req.body;
    const resultado = await User.findOneAndUpdate(
      { username },
      { [campo]: valor },
      { new: true }
    );
    if (resultado) {
      res.json({
        status: "✅ ACTUALIZACIÓN EXITOSA",
        usuario: resultado,
      });
    } else {
      res.status(404).json({ status: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
    console.log("🌱 Usuarios normales de ejemplo creados");
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
    console.log("✅ Conectado a MongoDB");
    seedDatabase();
  })
  .catch((err) => console.error("❌ Error de conexión:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
