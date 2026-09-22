const express = require("express");
const {
    placeOrder,
    getMyOrders,
    getRestaurantOrders,
    getRestaurantStats,
    getAvailableDeliveries,
    getMyDeliveries,
    acceptDelivery,
    getOrderById,
    updateOrderStatus
} = require("../controllers/orderController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser);

router.post("/", authorizeRoles("customer"), placeOrder);
router.get("/my-orders", authorizeRoles("customer"), getMyOrders);

router.get("/restaurant", authorizeRoles("restaurantOwner"), getRestaurantOrders);
router.get("/restaurant/stats", authorizeRoles("restaurantOwner"), getRestaurantStats);

router.get("/delivery/available", authorizeRoles("deliveryPartner"), getAvailableDeliveries);
router.get("/delivery/my", authorizeRoles("deliveryPartner"), getMyDeliveries);
router.put("/:id/accept-delivery", authorizeRoles("deliveryPartner"), acceptDelivery);

router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
