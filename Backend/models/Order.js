const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        foodItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodItem",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"]
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },

        items: {
            type: [orderItemSchema],
            required: true
        },

        itemsTotal: {
            type: Number,
            required: true
        },

        deliveryFee: {
            type: Number,
            default: 0
        },

        totalAmount: {
            type: Number,
            required: true
        },

        deliveryAddress: {
            type: String,
            required: [true, "Delivery address is required"]
        },

        contactNumber: {
            type: String,
            default: ""
        },

        paymentMethod: {
            type: String,
            enum: ["Online", "CashOnDelivery"],
            default: "Online"
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid"],
            default: "Pending"
        },

        transactionId: {
            type: String,
            default: ""
        },

        orderStatus: {
            type: String,
            enum: ["Placed", "Accepted", "Preparing", "ReadyForPickup", "OutForDelivery", "Delivered", "Cancelled"],
            default: "Placed"
        },

        deliveryPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        cancelReason: {
            type: String,
            default: ""
        },

        isReviewed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
