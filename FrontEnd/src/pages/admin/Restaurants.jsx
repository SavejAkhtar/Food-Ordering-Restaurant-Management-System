import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { getErrorMessage } from "../../utils/helpers";

const Restaurants = () => {
    let [restaurants, setRestaurants] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");
    let [message, setMessage] = useState("");

    let loadRestaurants = () => {
        api.get("/admin/restaurants")
            .then((res) => setRestaurants(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadRestaurants();
    }, []);

    let toggleStatus = (restaurant) => {
        setError("");
        setMessage("");

        api.put(`/admin/restaurants/${restaurant._id}/status`, {
            isActive: !restaurant.isActive
        })
            .then((res) => {
                setMessage(res.data.message);
                loadRestaurants();
            })
            .catch((err) => setError(getErrorMessage(err)));
    };

    if (loading) {
        return <Loader text="Loading restaurants..." />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                Restaurants
            </h1>

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

            {restaurants.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="🏪"
                        title="No restaurants yet"
                        message="Restaurants created by owners will appear here."
                    />
                </div>
            ) : (
                <div className="border border-gray-300 rounded mt-5 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-300">
                            <tr>
                                <th className="text-left p-3">Restaurant</th>
                                <th className="text-left p-3">Cuisine</th>
                                <th className="text-left p-3">Owner</th>
                                <th className="text-left p-3">Rating</th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-left p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {restaurants.map((restaurant) => (
                                <tr
                                    key={restaurant._id}
                                    className="border-b border-gray-200"
                                >
                                    <td className="p-3 font-medium text-gray-800">
                                        <Link to={`/restaurants/${restaurant._id}`}>
                                            {restaurant.name}
                                        </Link>

                                        <p className="text-xs text-gray-400 font-normal">
                                            {restaurant.address}
                                        </p>
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {restaurant.cuisine}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {restaurant.owner
                                            ? restaurant.owner.name
                                            : "-"}

                                        <p className="text-xs text-gray-400">
                                            {restaurant.owner
                                                ? restaurant.owner.email
                                                : ""}
                                        </p>
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {restaurant.rating > 0
                                            ? `${restaurant.rating} ★ (${restaurant.reviewCount})`
                                            : "No rating"}
                                    </td>

                                    <td className="p-3">
                                        {restaurant.isActive ? (
                                            <span className="text-green-600 text-sm">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-red-600 text-sm">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3">
                                        <button
                                            onClick={() =>
                                                toggleStatus(restaurant)
                                            }
                                            className={
                                                restaurant.isActive
                                                    ? "border border-red-500 text-red-600 px-3 py-1 rounded text-sm"
                                                    : "border border-green-500 text-green-600 px-3 py-1 rounded text-sm"
                                            }
                                        >
                                            {restaurant.isActive
                                                ? "Deactivate"
                                                : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Restaurants;