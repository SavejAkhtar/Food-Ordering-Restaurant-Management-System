import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";
import { getErrorMessage } from "../../utils/helpers";

const emptyForm = {
    name: "",
    description: "",
    address: "",
    cuisine: "",
    image: ""
};

const RestaurantProfile = () => {
    let [restaurant, setRestaurant] = useState(null);
    let [form, setForm] = useState(emptyForm);
    let [loading, setLoading] = useState(true);
    let [saving, setSaving] = useState(false);
    let [message, setMessage] = useState("");
    let [error, setError] = useState("");

    useEffect(() => {
        api.get("/restaurants/my-restaurant")
            .then((res) => {
                setRestaurant(res.data.data);

                setForm({
                    name: res.data.data.name,
                    description: res.data.data.description,
                    address: res.data.data.address,
                    cuisine: res.data.data.cuisine,
                    image: res.data.data.image
                });
            })
            .catch(() => setRestaurant(null))
            .finally(() => setLoading(false));
    }, []);

    let handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    let handleSubmit = (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (form.name.trim() === "" || form.address.trim() === "") {
            setError("Restaurant name and address are required");
            return;
        }

        setSaving(true);

        let request = restaurant
            ? api.put(`/restaurants/${restaurant._id}`, form)
            : api.post("/restaurants", form);

        request
            .then((res) => {
                setRestaurant(res.data.data);
                setMessage(res.data.message);
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setSaving(false));
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                {restaurant ? "My Restaurant" : "Create Restaurant"}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
                {restaurant
                    ? "Update your restaurant information."
                    : "Add your restaurant details to start selling."}
            </p>

            {message && (
                <div className="border border-green-300 bg-green-50 text-green-600 p-3 rounded mt-4 text-sm">
                    {message}
                </div>
            )}

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            <div className="border border-gray-300 rounded p-5 mt-5">
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm text-gray-700 mb-1">
                        Restaurant Name
                    </label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Spice Garden"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Cuisine
                    </label>

                    <input
                        name="cuisine"
                        value={form.cuisine}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="North Indian"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Address
                    </label>

                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows="2"
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Shop no, street, city"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="3"
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="What makes your food special?"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Image URL
                    </label>

                    <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="https://example.com/restaurant.jpg"
                    />

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-orange-500 text-white px-3 py-2 rounded mt-5"
                    >
                        {saving
                            ? "Saving..."
                            : restaurant
                            ? "Update Restaurant"
                            : "Create Restaurant"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestaurantProfile;