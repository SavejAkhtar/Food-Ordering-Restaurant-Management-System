const Category = require("../models/Category");
const Restaurant = require("../models/Restaurant");
const FoodItem = require("../models/FoodItem");

const getCategories = async (req, res, next) => {
    try {
        let restaurantId = req.query.restaurant;

        if (!restaurantId) {
            return res.status(400).json({ message: "Restaurant id is required" });
        }

        let categories = await Category.find({ restaurant: restaurantId }).sort({ name: 1 });

        res.status(200).json({ data: categories });
    } catch (err) {
        next(err);
    }
};

const createCategory = async (req, res, next) => {
    try {
        let { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        let restaurant = await Restaurant.findOne({ owner: req.user._id });

        if (!restaurant) {
            return res.status(400).json({ message: "Create your restaurant first" });
        }

        let duplicate = await Category.findOne({ name: name, restaurant: restaurant._id });

        if (duplicate) {
            return res.status(400).json({ message: "This category already exists" });
        }

        let category = await Category.create({ name: name, restaurant: restaurant._id });

        res.status(201).json({ message: "Category created", data: category });
    } catch (err) {
        next(err);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        let { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        let category = await Category.findById(req.params.id).populate("restaurant", "owner");

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (category.restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "This category belongs to another restaurant" });
        }

        category.name = name;
        await category.save();

        res.status(200).json({ message: "Category updated", data: category });
    } catch (err) {
        next(err);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        let category = await Category.findById(req.params.id).populate("restaurant", "owner");

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (category.restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "This category belongs to another restaurant" });
        }

        let foodCount = await FoodItem.countDocuments({ category: category._id });

        if (foodCount > 0) {
            return res.status(400).json({ message: "Delete the food items in this category first" });
        }

        await category.deleteOne();

        res.status(200).json({ message: "Category deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
