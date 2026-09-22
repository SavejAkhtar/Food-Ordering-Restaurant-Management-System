const express = require("express");
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCategories);
router.post("/", authenticateUser, authorizeRoles("restaurantOwner"), createCategory);
router.put("/:id", authenticateUser, authorizeRoles("restaurantOwner"), updateCategory);
router.delete("/:id", authenticateUser, authorizeRoles("restaurantOwner"), deleteCategory);

module.exports = router;
