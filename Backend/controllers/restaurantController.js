const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");
const FoodItem = require("../models/FoodItem");

const getRestaurants = async (req, res, next) => {
    try {
        let { search, cuisine, minRating } = req.query;

        let filter = { isActive: true };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { cuisine: { $regex: search, $options: "i" } }
            ];
        }

        if (cuisine) {
            filter.cuisine = cuisine;
        }

        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        let restaurants = await Restaurant.find(filter).sort({ rating: -1, createdAt: -1 });

        res.status(200).json({ data: restaurants });
    } catch (err) {
        next(err);
    }
};

const getCuisines = async (req, res, next) => {
    try {
        let cuisines = await Restaurant.distinct("cuisine", { isActive: true });

        res.status(200).json({ data: cuisines.sort() });
    } catch (err) {
        next(err);
    }
};

const getRestaurantById = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id).populate("owner", "name phone");

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json({ data: restaurant });
    } catch (err) {
        next(err);
    }
};

const getMyRestaurant = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findOne({ owner: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: "You have not created a restaurant yet" });
        }

        res.status(200).json({ data: restaurant });
    } catch (err) {
        next(err);
    }
};

const createRestaurant = async (req, res, next) => {
    try {
        let { name, description, address, image, cuisine } = req.body;

        if (!name || !address) {
            return res.status(400).json({ message: "Restaurant name and address are required" });
        }

        let alreadyHasOne = await Restaurant.findOne({ owner: req.user._id });

        if (alreadyHasOne) {
            return res.status(400).json({ message: "You already have a restaurant" });
        }

        let restaurant = await Restaurant.create({
            name: name,
            description: description || "",
            address: address,
            image: image || "",
            cuisine: cuisine || "Multi Cuisine",
            owner: req.user._id
        });

        res.status(201).json({ message: "Restaurant created successfully", data: restaurant });
    } catch (err) {
        next(err);
    }
};

const updateRestaurant = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        if (req.user.role !== "admin" && restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "This is not your restaurant" });
        }

        let { name, description, address, image, cuisine } = req.body;

        if (name !== undefined) restaurant.name = name;
        if (description !== undefined) restaurant.description = description;
        if (address !== undefined) restaurant.address = address;
        if (image !== undefined) restaurant.image = image;
        if (cuisine !== undefined) restaurant.cuisine = cuisine;

        await restaurant.save();

        res.status(200).json({ message: "Restaurant updated", data: restaurant });
    } catch (err) {
        next(err);
    }
};

const deleteRestaurant = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        if (req.user.role !== "admin" && restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "This is not your restaurant" });
        }

        await FoodItem.deleteMany({ restaurant: restaurant._id });
        await Category.deleteMany({ restaurant: restaurant._id });
        await restaurant.deleteOne();

        res.status(200).json({ message: "Restaurant deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getRestaurants,
    getCuisines,
    getRestaurantById,
    getMyRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
