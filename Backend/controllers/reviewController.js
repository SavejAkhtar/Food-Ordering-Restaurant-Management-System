const Review = require("../models/Review");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

const updateRestaurantRating = async (restaurantId) => {
    let reviews = await Review.find({ restaurant: restaurantId });
    let total = reviews.reduce((sum, review) => sum + review.rating, 0);
    let average = reviews.length > 0 ? total / reviews.length : 0;

    await Restaurant.findByIdAndUpdate(restaurantId, {
        rating: Number(average.toFixed(1)),
        reviewCount: reviews.length
    });
};

const createReview = async (req, res, next) => {
    try {
        let { order, rating, comment } = req.body;

        if (!order || !rating) {
            return res.status(400).json({ message: "Order and rating are required" });
        }

        if (Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        let selectedOrder = await Order.findById(order);

        if (!selectedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (selectedOrder.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "This is not your order" });
        }

        if (selectedOrder.orderStatus !== "Delivered") {
            return res.status(400).json({ message: "You can review only after the order is delivered" });
        }

        let alreadyReviewed = await Review.findOne({ order: selectedOrder._id });

        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this order" });
        }

        let review = await Review.create({
            customer: req.user._id,
            restaurant: selectedOrder.restaurant,
            order: selectedOrder._id,
            rating: Number(rating),
            comment: comment || ""
        });

        selectedOrder.isReviewed = true;
        await selectedOrder.save();

        await updateRestaurantRating(selectedOrder.restaurant);

        res.status(201).json({ message: "Thanks for your review", data: review });
    } catch (err) {
        next(err);
    }
};

const getRestaurantReviews = async (req, res, next) => {
    try {
        let reviews = await Review.find({ restaurant: req.params.id })
            .populate("customer", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: reviews });
    } catch (err) {
        next(err);
    }
};

const getMyReviews = async (req, res, next) => {
    try {
        let reviews = await Review.find({ customer: req.user._id })
            .populate("restaurant", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: reviews });
    } catch (err) {
        next(err);
    }
};

module.exports = { createReview, getRestaurantReviews, getMyReviews };
