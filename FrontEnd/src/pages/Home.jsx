import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import RestaurantCard from "../components/RestaurantCard";
import Loader from "../components/Loader";
import { getErrorMessage } from "../utils/helpers";

const Home = () => {
    let [restaurants, setRestaurants] = useState([]);
    let [search, setSearch] = useState("");
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    let navigate = useNavigate();

    useEffect(() => {
        api.get("/restaurants")
            .then((res) => {
                setRestaurants(res.data.data.slice(0, 6));
            })
            .catch((err) => {
                setError(getErrorMessage(err));
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    let handleSearch = (e) => {
        e.preventDefault();
        navigate(`/restaurants?search=${search}`);
    };

    return (
        <div>
            <div className="border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Food you love, delivered fast
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Order from restaurants near you and track your order.
                    </p>

                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2 mt-5 max-w-xl"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search restaurants or cuisines"
                            className="border border-gray-300 rounded p-2 flex-1"
                        />

                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-4 py-2 rounded"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Popular Restaurants
                    </h2>

                    <Link
                        to="/restaurants"
                        className="text-orange-600 text-sm"
                    >
                        View all
                    </Link>
                </div>

                {error && (
                    <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <Loader />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                        {restaurants.map((restaurant) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        How it works
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border border-gray-300 rounded p-4">
                            <h3 className="font-semibold">
                                Browse & Order
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Pick your dishes and place your order.
                            </p>
                        </div>

                        <div className="border border-gray-300 rounded p-4">
                            <h3 className="font-semibold">
                                Freshly Prepared
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Restaurant prepares your order.
                            </p>
                        </div>

                        <div className="border border-gray-300 rounded p-4">
                            <h3 className="font-semibold">
                                Track Order
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Track your order until delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;