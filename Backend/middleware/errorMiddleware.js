const notFound = (req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

const errorHandler = (err, req, res, next) => {
    console.log(err);

    if (err.name === "ValidationError") {
        let firstError = Object.values(err.errors)[0];
        return res.status(400).json({ message: firstError.message });
    }

    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid id provided" });
    }

    if (err.code === 11000) {
        return res.status(400).json({ message: "This record already exists" });
    }

    res.status(500).json({ message: "Something went wrong on the server" });
};

module.exports = { notFound, errorHandler };
