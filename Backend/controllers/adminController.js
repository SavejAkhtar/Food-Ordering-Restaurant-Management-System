const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");

const getStats = async (req, res, next) => {
    try {
        let orders = await Order.find().select("orderStatus totalAmount");
        let deliveredOrders = orders.filter((order) => order.orderStatus === "Delivered");

        let stats = {
            customers: await User.countDocuments({ role: "customer" }),
            restaurantOwners: await User.countDocuments({ role: "restaurantOwner" }),
            deliveryPartners: await User.countDocuments({ role: "deliveryPartner" }),
            restaurants: await Restaurant.countDocuments(),
            activeRestaurants: await Restaurant.countDocuments({ isActive: true }),
            totalOrders: orders.length,
            deliveredOrders: deliveredOrders.length,
            cancelledOrders: orders.filter((order) => order.orderStatus === "Cancelled").length,
            totalRevenue: deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
        };

        res.status(200).json({ data: stats });
    } catch (err) {
        next(err);
    }
};

const getUsers = async (req, res, next) => {
    try {
        let filter = {};

        if (req.query.role) {
            filter.role = req.query.role;
        }

        let users = await User.find(filter).select("-password").sort({ createdAt: -1 });

        res.status(200).json({ data: users });
    } catch (err) {
        next(err);
    }
};

const getRestaurants = async (req, res, next) => {
    try {
        let restaurants = await Restaurant.find()
            .populate("owner", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: restaurants });
    } catch (err) {
        next(err);
    }
};

const getOrders = async (req, res, next) => {
    try {
        let filter = {};

        if (req.query.status) {
            filter.orderStatus = req.query.status;
        }

        let orders = await Order.find(filter)
            .populate("customer", "name email")
            .populate("restaurant", "name")
            .populate("deliveryPartner", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: orders });
    } catch (err) {
        next(err);
    }
};

const updateRestaurantStatus = async (req, res, next) => {
    try {
        let { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "isActive must be true or false" });
        }

        let restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        restaurant.isActive = isActive;
        await restaurant.save();

        res.status(200).json({
            message: isActive ? "Restaurant activated" : "Restaurant deactivated",
            data: restaurant
        });
    } catch (err) {
        next(err);
    }
};

const updateUserStatus = async (req, res, next) => {
    try {
        let { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "isActive must be true or false" });
        }

        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "Admin accounts cannot be changed" });
        }

        user.isActive = isActive;
        await user.save();

        res.status(200).json({
            message: isActive ? "User activated" : "User deactivated",
            data: { _id: user._id, isActive: user.isActive }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getStats, getUsers, getRestaurants, getOrders, updateRestaurantStatus, updateUserStatus };
