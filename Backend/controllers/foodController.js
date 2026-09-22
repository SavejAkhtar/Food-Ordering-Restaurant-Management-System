const FoodItem = require("../models/FoodItem");
const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");

const getFoods = async (req, res, next) => {
    try {
        let { restaurant, category, search, minPrice, maxPrice, available } = req.query;

        let filter = {};

        if (restaurant) {
            filter.restaurant = restaurant;
        } else {
            let activeIds = await Restaurant.find({ isActive: true }).distinct("_id");
            filter.restaurant = { $in: activeIds };
        }

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (available === "true") {
            filter.isAvailable = true;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let foods = await FoodItem.find(filter)
            .populate("category", "name")
            .populate("restaurant", "name cuisine rating")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: foods });
    } catch (err) {
        next(err);
    }
};

const getFoodById = async (req, res, next) => {
    try {
        let food = await FoodItem.findById(req.params.id)
            .populate("category", "name")
            .populate("restaurant", "name cuisine rating isActive");

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.status(200).json({ data: food });
    } catch (err) {
        next(err);
    }
};

const createFood = async (req, res, next) => {
    try {
        let { name, description, price, image, category, isAvailable } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: "Name, price and category are required" });
        }

        if (Number(price) <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        let restaurant = await Restaurant.findOne({ owner: req.user._id });

        if (!restaurant) {
            return res.status(400).json({ message: "Create your restaurant first" });
        }

        let selectedCategory = await Category.findOne({ _id: category, restaurant: restaurant._id });

        if (!selectedCategory) {
            return res.status(400).json({ message: "Selected category does not belong to your restaurant" });
        }

        let food = await FoodItem.create({
            name: name,
            description: description || "",
            price: Number(price),
            image: image || "",
            category: selectedCategory._id,
            restaurant: restaurant._id,
            isAvailable: isAvailable === undefined ? true : isAvailable
        });

        res.status(201).json({ message: "Food item added", data: food });
    } catch (err) {
        next(err);
    }
};

const updateFood = async (req, res, next) => {
    try {
        let food = await FoodItem.findById(req.params.id).populate("restaurant", "owner");

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        if (food.restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "This food item belongs to another restaurant" });
        }

        let { name, description, price, image, category, isAvailable } = req.body;

        if (price !== undefined && Number(price) <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        if (category !== undefined) {
            let selectedCategory = await Category.findOne({ _id: category, restaurant: food.restaurant._id });

            if (!selectedCategory) {
                return res.status(400).json({ message: "Selected category does not belong to your restaurant" });
            }

            food.category = selectedCategory._id;
        }

        if (name !== undefined) food.name = name;
        if (description !== undefined) food.description = description;
        if (price !== undefined) food.price = Number(price);
        if (image !== undefined) food.image = image;
        if (isAvailable !== undefined) food.isAvailable = isAvailable;

        await food.save();

        res.status(200).json({ message: "Food item updated", data: food });
    } catch (err) {
        next(err);
    }
};

const deleteFood = async (req, res, next) => {
    try {
        let food = await FoodItem.findById(req.params.id).populate("restaurant", "owner");

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        if (food.restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "This food item belongs to another restaurant" });
        }

        await food.deleteOne();

        res.status(200).json({ message: "Food item deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = { getFoods, getFoodById, createFood, updateFood, deleteFood };
