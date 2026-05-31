const express = require("express");
const router = express.Router();
const { login, signup, profile } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/signup", signup);
router.get("/me", authenticateToken, profile);

module.exports = router;
