const express = require("express");
const { processPayment, getPaymentByOrder } = require("../controllers/paymentController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/process", authenticateUser, authorizeRoles("customer"), processPayment);
router.get("/order/:orderId", authenticateUser, getPaymentByOrder);

module.exports = router;
