const Order = require("../models/Order");
const FoodItem = require("../models/FoodItem");
const Restaurant = require("../models/Restaurant");

const DELIVERY_FEE = 30;

const allowedTransitions = {
    restaurantOwner: {
        Placed: ["Accepted", "Cancelled"],
        Accepted: ["Preparing"],
        Preparing: ["ReadyForPickup"]
    },
    deliveryPartner: {
        ReadyForPickup: ["OutForDelivery"],
        OutForDelivery: ["Delivered"]
    },
    customer: {
        Placed: ["Cancelled"],
        Accepted: ["Cancelled"]
    },
    admin: {
        Placed: ["Cancelled"],
        Accepted: ["Cancelled"],
        Preparing: ["Cancelled"]
    }
};

const placeOrder = async (req, res, next) => {
    try {
        let { restaurant, items, deliveryAddress, contactNumber, paymentMethod } = req.body;

        if (!restaurant || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Restaurant and at least one item are required" });
        }

        if (!deliveryAddress || deliveryAddress.trim() === "") {
            return res.status(400).json({ message: "Delivery address is required" });
        }

        let selectedRestaurant = await Restaurant.findById(restaurant);

        if (!selectedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        if (!selectedRestaurant.isActive) {
            return res.status(400).json({ message: "This restaurant is not accepting orders right now" });
        }

        let foodIds = items.map((item) => item.foodItem);
        let foods = await FoodItem.find({ _id: { $in: foodIds }, restaurant: selectedRestaurant._id });

        if (foods.length !== items.length) {
            return res.status(400).json({ message: "Some items are not available in this restaurant" });
        }

        let orderItems = [];

        for (let item of items) {
            let food = foods.find((one) => one._id.toString() === item.foodItem);
            let quantity = Number(item.quantity);

            if (!quantity || quantity < 1) {
                return res.status(400).json({ message: `Invalid quantity for ${food.name}` });
            }

            if (!food.isAvailable) {
                return res.status(400).json({ message: `${food.name} is currently unavailable` });
            }

            orderItems.push({
                foodItem: food._id,
                name: food.name,
                price: food.price,
                quantity: quantity
            });
        }

        let itemsTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let order = await Order.create({
            customer: req.user._id,
            restaurant: selectedRestaurant._id,
            items: orderItems,
            itemsTotal: itemsTotal,
            deliveryFee: DELIVERY_FEE,
            totalAmount: itemsTotal + DELIVERY_FEE,
            deliveryAddress: deliveryAddress,
            contactNumber: contactNumber || req.user.phone,
            paymentMethod: paymentMethod === "CashOnDelivery" ? "CashOnDelivery" : "Online"
        });

        res.status(201).json({ message: "Order placed successfully", data: order });
    } catch (err) {
        next(err);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        let orders = await Order.find({ customer: req.user._id })
            .populate("restaurant", "name image cuisine")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: orders });
    } catch (err) {
        next(err);
    }
};

const getRestaurantOrders = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findOne({ owner: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: "You have not created a restaurant yet" });
        }

        let filter = { restaurant: restaurant._id };

        if (req.query.status) {
            filter.orderStatus = req.query.status;
        }

        let orders = await Order.find(filter)
            .populate("customer", "name phone")
            .populate("deliveryPartner", "name phone")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: orders });
    } catch (err) {
        next(err);
    }
};

const getRestaurantStats = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findOne({ owner: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: "You have not created a restaurant yet" });
        }

        let orders = await Order.find({ restaurant: restaurant._id });

        let deliveredOrders = orders.filter((order) => order.orderStatus === "Delivered");
        let activeStatuses = ["Placed", "Accepted", "Preparing", "ReadyForPickup", "OutForDelivery"];

        let stats = {
            totalOrders: orders.length,
            newOrders: orders.filter((order) => order.orderStatus === "Placed").length,
            activeOrders: orders.filter((order) => activeStatuses.includes(order.orderStatus)).length,
            deliveredOrders: deliveredOrders.length,
            cancelledOrders: orders.filter((order) => order.orderStatus === "Cancelled").length,
            totalRevenue: deliveredOrders.reduce((sum, order) => sum + order.itemsTotal, 0),
            rating: restaurant.rating,
            reviewCount: restaurant.reviewCount
        };

        res.status(200).json({ data: stats });
    } catch (err) {
        next(err);
    }
};

const getAvailableDeliveries = async (req, res, next) => {
    try {
        let orders = await Order.find({ orderStatus: "ReadyForPickup", deliveryPartner: null })
            .populate("restaurant", "name address")
            .populate("customer", "name phone")
            .sort({ createdAt: 1 });

        res.status(200).json({ data: orders });
    } catch (err) {
        next(err);
    }
};

const getMyDeliveries = async (req, res, next) => {
    try {
        let filter = { deliveryPartner: req.user._id };

        if (req.query.status) {
            filter.orderStatus = req.query.status;
        }

        let orders = await Order.find(filter)
            .populate("restaurant", "name address")
            .populate("customer", "name phone")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: orders });
    } catch (err) {
        next(err);
    }
};

const acceptDelivery = async (req, res, next) => {
    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.orderStatus !== "ReadyForPickup") {
            return res.status(400).json({ message: "This order is not ready for pickup yet" });
        }

        if (order.deliveryPartner) {
            return res.status(400).json({ message: "Another delivery partner already accepted this order" });
        }

        order.deliveryPartner = req.user._id;
        await order.save();

        res.status(200).json({ message: "Delivery accepted", data: order });
    } catch (err) {
        next(err);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        let order = await Order.findById(req.params.id)
            .populate("restaurant", "name address image cuisine owner")
            .populate("customer", "name phone email")
            .populate("deliveryPartner", "name phone");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        let userId = req.user._id.toString();

        let canView =
            req.user.role === "admin" ||
            order.customer._id.toString() === userId ||
            order.restaurant.owner.toString() === userId ||
            (order.deliveryPartner && order.deliveryPartner._id.toString() === userId);

        if (!canView) {
            return res.status(403).json({ message: "You cannot view this order" });
        }

        res.status(200).json({ data: order });
    } catch (err) {
        next(err);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        let { status, cancelReason } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        let order = await Order.findById(req.params.id).populate("restaurant", "owner");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        let userId = req.user._id.toString();
        let role = req.user.role;

        if (role === "customer" && order.customer.toString() !== userId) {
            return res.status(403).json({ message: "This is not your order" });
        }

        if (role === "restaurantOwner" && order.restaurant.owner.toString() !== userId) {
            return res.status(403).json({ message: "This order is not from your restaurant" });
        }

        if (role === "deliveryPartner") {
            if (!order.deliveryPartner || order.deliveryPartner.toString() !== userId) {
                return res.status(403).json({ message: "This delivery is not assigned to you" });
            }
        }

        let nextStatuses = allowedTransitions[role][order.orderStatus] || [];

        if (!nextStatuses.includes(status)) {
            return res.status(400).json({
                message: `Order cannot be changed from ${order.orderStatus} to ${status}`
            });
        }

        order.orderStatus = status;

        if (status === "Cancelled") {
            order.cancelReason = cancelReason || "No reason provided";
        }

        if (status === "Delivered" && order.paymentMethod === "CashOnDelivery") {
            order.paymentStatus = "Paid";
        }

        await order.save();

        res.status(200).json({ message: `Order marked as ${status}`, data: order });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getRestaurantOrders,
    getRestaurantStats,
    getAvailableDeliveries,
    getMyDeliveries,
    acceptDelivery,
    getOrderById,
    updateOrderStatus
};
