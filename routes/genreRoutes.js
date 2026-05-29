const express = require("express");
const router = express.Router();
const { getGenres, getGenre, createGenre, updateGenre, deleteGenre } = require("../controllers/genreController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getGenres);
router.get("/:id", getGenre);
router.post("/", authenticateToken, authorizeRoles("admin"), createGenre);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateGenre);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteGenre);

module.exports = router;
