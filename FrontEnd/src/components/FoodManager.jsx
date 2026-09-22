import { useState } from "react";
import api from "../services/api";
import { formatPrice, getErrorMessage } from "../utils/helpers";

const emptyFood = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: ""
};

const FoodManager = ({ categories, foods, onChanged }) => {
    let [form, setForm] = useState(emptyFood);
    let [editId, setEditId] = useState("");
    let [error, setError] = useState("");
    let [saving, setSaving] = useState(false);

    let handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    let resetForm = () => {
        setForm(emptyFood);
        setEditId("");
    };

    let handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (form.name.trim() === "" || form.price === "" || form.category === "") {
            setError("Name, price and category are required");
            return;
        }

        if (Number(form.price) <= 0) {
            setError("Price must be greater than 0");
            return;
        }

        setSaving(true);

        let request = editId
            ? api.put(`/foods/${editId}`, form)
            : api.post("/foods", form);

        request
            .then(() => {
                resetForm();
                onChanged();
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setSaving(false));
    };

    let startEdit = (food) => {
        setEditId(food._id);

        setForm({
            name: food.name,
            description: food.description,
            price: food.price,
            category: food.category._id || food.category,
            image: food.image
        });
    };

    let toggleAvailability = (food) => {
        setError("");

        api.put(`/foods/${food._id}`, {
            isAvailable: !food.isAvailable
        })
            .then(() => onChanged())
            .catch((err) => setError(getErrorMessage(err)));
    };

    let handleDelete = (food) => {
        if (!window.confirm(`Delete "${food.name}" from your menu?`)) {
            return;
        }

        setError("");

        api.delete(`/foods/${food._id}`)
            .then(() => onChanged())
            .catch((err) => setError(getErrorMessage(err)));
    };

    return (
        <div className="space-y-5">
            <div className="border border-gray-300 rounded p-4">
                <h2 className="font-semibold text-gray-800">
                    {editId ? "Edit Food Item" : "Add Food Item"}
                </h2>

                {error && (
                    <div className="border border-red-300 bg-red-50 text-red-600 p-2 mt-3 rounded text-sm">
                        {error}
                    </div>
                )}

                {categories.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-3">
                        Add at least one category before adding food items.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Name
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-2 w-full"
                                    placeholder="Butter Chicken"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-2 w-full"
                                    placeholder="250"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-2 w-full"
                                >
                                    <option value="">Select category</option>

                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Image URL
                                </label>

                                <input
                                    name="image"
                                    value={form.image}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-2 w-full"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <label className="block text-sm text-gray-700 mt-4 mb-1">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="2"
                            className="border border-gray-300 rounded p-2 w-full"
                            placeholder="Short description of the dish"
                        />

                        <div className="flex gap-2 mt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-orange-500 text-white px-3 py-2 rounded text-sm"
                            >
                                {saving
                                    ? "Saving..."
                                    : editId
                                    ? "Update Item"
                                    : "Add Item"}
                            </button>

                            {editId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="border border-gray-300 px-3 py-2 rounded text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>

            <div className="border border-gray-300 rounded p-4">
                <h2 className="font-semibold text-gray-800">
                    Menu Items ({foods.length})
                </h2>

                {foods.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-4">
                        No food items added yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="text-left p-2">Item</th>
                                    <th className="text-left p-2">Category</th>
                                    <th className="text-left p-2">Price</th>
                                    <th className="text-left p-2">Status</th>
                                    <th className="text-left p-2">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {foods.map((food) => (
                                    <tr
                                        key={food._id}
                                        className="border-b border-gray-200"
                                    >
                                        <td className="p-2 font-medium text-gray-800">
                                            {food.name}
                                        </td>

                                        <td className="p-2 text-gray-500">
                                            {food.category
                                                ? food.category.name
                                                : "-"}
                                        </td>

                                        <td className="p-2">
                                            {formatPrice(food.price)}
                                        </td>

                                        <td className="p-2">
                                            <span className="text-sm">
                                                {food.isAvailable
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>
                                        </td>

                                        <td className="p-2">
                                            <div className="flex gap-3 text-sm">
                                                <button
                                                    onClick={() => startEdit(food)}
                                                    className="text-orange-600"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        toggleAvailability(food)
                                                    }
                                                    className="text-blue-600"
                                                >
                                                    {food.isAvailable
                                                        ? "Mark Unavailable"
                                                        : "Mark Available"}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(food)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodManager;