const express = require("express");
const {
    getStats,
    getUsers,
    getRestaurants,
    getOrders,
    updateRestaurantStatus,
    updateUserStatus
} = require("../controllers/adminController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser, authorizeRoles("admin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/restaurants", getRestaurants);
router.get("/orders", getOrders);
router.put("/restaurants/:id/status", updateRestaurantStatus);
router.put("/users/:id/status", updateUserStatus);

module.exports = router;
