const express = require("express");
const { getFoods, getFoodById, createFood, updateFood, deleteFood } = require("../controllers/foodController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getFoods);
router.get("/:id", getFoodById);
router.post("/", authenticateUser, authorizeRoles("restaurantOwner"), createFood);
router.put("/:id", authenticateUser, authorizeRoles("restaurantOwner"), updateFood);
router.delete("/:id", authenticateUser, authorizeRoles("restaurantOwner"), deleteFood);

module.exports = router;
