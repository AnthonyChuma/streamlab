const express = require("express");
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/userController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, authorizeRoles("admin"), getUsers);
router.get("/:id", authenticateToken, authorizeRoles("admin"), getUser);
router.post("/", authenticateToken, authorizeRoles("admin"), createUser);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);

module.exports = router;
