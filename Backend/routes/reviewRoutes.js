const express = require("express");
const { createReview, getMyReviews } = require("../controllers/reviewController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, authorizeRoles("customer"), createReview);
router.get("/my-reviews", authenticateUser, authorizeRoles("customer"), getMyReviews);

module.exports = router;
