const Payment = require("../models/Payment");
const Order = require("../models/Order");

const createTransactionId = () => {
    return "TXN-" + Math.floor(100000 + Math.random() * 900000);
};

const processPayment = async (req, res, next) => {
    try {
        let { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "Order id is required" });
        }

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "This is not your order" });
        }

        if (order.paymentStatus === "Paid") {
            return res.status(400).json({ message: "This order is already paid" });
        }

        let transactionId = createTransactionId();

        await Payment.create({
            order: order._id,
            customer: req.user._id,
            amount: order.totalAmount,
            paymentMethod: "Online",
            transactionId: transactionId,
            status: "Paid"
        });

        order.paymentStatus = "Paid";
        order.transactionId = transactionId;
        await order.save();

        res.status(200).json({
            success: true,
            transactionId: transactionId,
            status: "Paid",
            message: "Payment successful"
        });
    } catch (err) {
        next(err);
    }
};

const getPaymentByOrder = async (req, res, next) => {
    try {
        let payment = await Payment.findOne({ order: req.params.orderId });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found for this order" });
        }

        if (payment.customer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You cannot view this payment" });
        }

        res.status(200).json({ data: payment });
    } catch (err) {
        next(err);
    }
};

module.exports = { processPayment, getPaymentByOrder };
