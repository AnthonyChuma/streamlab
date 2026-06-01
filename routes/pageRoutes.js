const express = require("express");
const path = require("path");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

function sendView(res, fileName) {
  res.sendFile(path.join(__dirname, "..", "views", fileName));
}

router.get("/", (req, res) => sendView(res, "home.html"));
router.get("/login", (req, res) => sendView(res, "login.html"));
router.get("/signup", (req, res) => sendView(res, "signup.html"));
router.get("/admin", authenticateToken, authorizeRoles("admin"), (req, res) => sendView(res, "admin.html"));
router.get("/admin.html", authenticateToken, authorizeRoles("admin"), (req, res) => sendView(res, "admin.html"));
router.get("/catalog", authenticateToken, (req, res) => sendView(res, "catalog.html"));
router.get("/catalog.html", authenticateToken, (req, res) => sendView(res, "catalog.html"));
router.get("/manager", authenticateToken, authorizeRoles("manager", "admin"), (req, res) => sendView(res, "manager.html"));
router.get("/manager.html", authenticateToken, authorizeRoles("manager", "admin"), (req, res) => sendView(res, "manager.html"));
router.get("/series", authenticateToken, (req, res) => sendView(res, "series.html"));
router.get("/series.html", authenticateToken, (req, res) => sendView(res, "series.html"));
router.get("/genres", authenticateToken, (req, res) => sendView(res, "genres.html"));
router.get("/genres.html", authenticateToken, (req, res) => sendView(res, "genres.html"));
router.get("/profile", authenticateToken, (req, res) => sendView(res, "profile.html"));

module.exports = router;
