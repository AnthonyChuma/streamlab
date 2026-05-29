const express = require("express");
const path = require("path");
const router = express.Router();

function sendView(res, fileName) {
  res.sendFile(path.join(__dirname, "..", "views", fileName));
}

router.get("/", (req, res) => sendView(res, "home.html"));
router.get("/login", (req, res) => sendView(res, "login.html"));
router.get("/signup", (req, res) => sendView(res, "signup.html"));
router.get("/admin", (req, res) => sendView(res, "admin.html"));
router.get("/admin.html", (req, res) => sendView(res, "admin.html"));
router.get("/catalog", (req, res) => sendView(res, "catalog.html"));
router.get("/catalog.html", (req, res) => sendView(res, "catalog.html"));
router.get("/manager", (req, res) => sendView(res, "manager.html"));
router.get("/manager.html", (req, res) => sendView(res, "manager.html"));
router.get("/series", (req, res) => sendView(res, "series.html"));
router.get("/series.html", (req, res) => sendView(res, "series.html"));
router.get("/genres", (req, res) => sendView(res, "genres.html"));
router.get("/genres.html", (req, res) => sendView(res, "genres.html"));
router.get("/profile", (req, res) => sendView(res, "profile.html"));

module.exports = router;
