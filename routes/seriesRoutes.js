const express = require("express");
const router = express.Router();
const { getSeries, getSerie, createSerie, updateSerie, deleteSerie } = require("../controllers/seriesController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getSeries);
router.get("/:id", getSerie);
router.post("/", authenticateToken, authorizeRoles("manager", "admin"), createSerie);
router.put("/:id", authenticateToken, authorizeRoles("manager", "admin"), updateSerie);
router.delete("/:id", authenticateToken, authorizeRoles("manager", "admin"), deleteSerie);

module.exports = router;
