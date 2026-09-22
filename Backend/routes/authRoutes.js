const express = require("express");
const { register, login, getMe, updateProfile } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateUser, getMe);
router.put("/me", authenticateUser, updateProfile);

module.exports = router;
