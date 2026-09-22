const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const signupRoles = ["customer", "restaurantOwner", "deliveryPartner"];

const createToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const formatUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address
    };
};

const register = async (req, res, next) => {
    try {
        let { name, email, password, phone, role, address } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        let selectedRole = role || "customer";

        if (!signupRoles.includes(selectedRole)) {
            return res.status(400).json({
                message: "Invalid role selected"
            });
        }

        let alreadyExists = await User.findOne({
            email: email.toLowerCase()
        });

        if (alreadyExists) {
            return res.status(400).json({
                message: "This email is already registered"
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.create({
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone: phone || "",
            role: selectedRole,
            address: address || ""
        });

        res.status(201).json({
            message: "Account created successfully",
            token: createToken(user),
            user: formatUser(user)
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        let user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        let passwordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatched) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account has been deactivated"
            });
        }

        res.status(200).json({
            message: "Login successful",
            token: createToken(user),
            user: formatUser(user)
        });
    } catch (err) {
        next(err);
    }
};

const getMe = (req, res) => {
    res.status(200).json({
        user: formatUser(req.user)
    });
};

const updateProfile = async (req, res, next) => {
    try {
        let { name, phone, address } = req.body;

        if (name !== undefined && name.trim() === "") {
            return res.status(400).json({
                message: "Name cannot be empty"
            });
        }

        let user = await User.findById(req.user._id);

        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;

        await user.save();

        res.status(200).json({
            message: "Profile updated",
            user: formatUser(user)
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile
};