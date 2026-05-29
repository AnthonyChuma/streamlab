const express = require("express");
const router = express.Router();
const { getMovies, getMovie, createMovie, updateMovie, deleteMovie } = require("../controllers/movieController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getMovies);
router.get("/:id", getMovie);
router.post("/", authenticateToken, authorizeRoles("manager", "admin"), createMovie);
router.put("/:id", authenticateToken, authorizeRoles("manager", "admin"), updateMovie);
router.delete("/:id", authenticateToken, authorizeRoles("manager", "admin"), deleteMovie);

module.exports = router;
