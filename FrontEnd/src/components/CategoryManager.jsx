import { useState } from "react";
import api from "../services/api";
import { getErrorMessage } from "../utils/helpers";

const CategoryManager = ({ categories, onChanged }) => {
    let [name, setName] = useState("");
    let [editId, setEditId] = useState("");
    let [error, setError] = useState("");
    let [saving, setSaving] = useState(false);

    let handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (name.trim() === "") {
            setError("Category name is required");
            return;
        }

        setSaving(true);

        let request = editId
            ? api.put(`/categories/${editId}`, { name: name })
            : api.post("/categories", { name: name });

        request
            .then(() => {
                setName("");
                setEditId("");
                onChanged();
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setSaving(false));
    };

    let handleDelete = (category) => {
        if (!window.confirm(`Delete category "${category.name}"?`)) {
            return;
        }

        setError("");

        api.delete(`/categories/${category._id}`)
            .then(() => onChanged())
            .catch((err) => setError(getErrorMessage(err)));
    };

    return (
        <div className="border border-gray-300 rounded p-4">
            <h2 className="font-semibold text-gray-800">Categories</h2>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-2 mt-3 rounded text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    placeholder="e.g. Starters"
                />

                <div className="flex gap-2 mt-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-orange-500 text-white px-3 py-2 rounded text-sm"
                    >
                        {editId ? "Update" : "Add Category"}
                    </button>

                    {editId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditId("");
                                setName("");
                            }}
                            className="border border-gray-300 px-3 py-2 rounded text-sm"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {categories.length === 0 ? (
                <p className="text-sm text-gray-500 mt-5">
                    No categories yet.
                </p>
            ) : (
                <ul className="mt-5">
                    {categories.map((category) => (
                        <li
                            key={category._id}
                            className="flex items-center justify-between border-b border-gray-200 py-2"
                        >
                            <span className="text-sm text-gray-700">
                                {category.name}
                            </span>

                            <div className="flex gap-3 text-sm">
                                <button
                                    onClick={() => {
                                        setEditId(category._id);
                                        setName(category.name);
                                    }}
                                    className="text-orange-600"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(category)}
                                    className="text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CategoryManager;