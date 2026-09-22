const express = require("express");
const {
    getRestaurants,
    getCuisines,
    getRestaurantById,
    getMyRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require("../controllers/restaurantController");
const { getRestaurantReviews } = require("../controllers/reviewController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getRestaurants);
router.get("/cuisines", getCuisines);
router.get("/my-restaurant", authenticateUser, authorizeRoles("restaurantOwner"), getMyRestaurant);
router.post("/", authenticateUser, authorizeRoles("restaurantOwner"), createRestaurant);
router.get("/:id", getRestaurantById);
router.get("/:id/reviews", getRestaurantReviews);
router.put("/:id", authenticateUser, authorizeRoles("restaurantOwner", "admin"), updateRestaurant);
router.delete("/:id", authenticateUser, authorizeRoles("restaurantOwner", "admin"), deleteRestaurant);

module.exports = router;
