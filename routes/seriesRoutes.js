const express = require("express");
const router = express.Router();
const { getSeries, getSerie, createSerie, updateSerie, deleteSerie } = require("../controllers/seriesController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getSeries);
router.get("/:id", getSerie);
router.post("/", authenticateToken, authorizeRoles("admin"), createSerie);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateSerie);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteSerie);

module.exports = router;
