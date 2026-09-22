import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import RestaurantCard from "../components/RestaurantCard";
import FoodCard from "../components/FoodCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getErrorMessage } from "../utils/helpers";

const Restaurants = () => {
    let [params] = useSearchParams();

    let [tab, setTab] = useState("restaurants");
    let [search, setSearch] = useState(params.get("search") || "");
    let [cuisine, setCuisine] = useState("");
    let [minRating, setMinRating] = useState("");
    let [minPrice, setMinPrice] = useState("");
    let [maxPrice, setMaxPrice] = useState("");

    let [cuisines, setCuisines] = useState([]);
    let [restaurants, setRestaurants] = useState([]);
    let [foods, setFoods] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    useEffect(() => {
        api.get("/restaurants/cuisines")
            .then((res) => setCuisines(res.data.data))
            .catch(() => setCuisines([]));
    }, []);

    useEffect(() => {
        let loadRestaurants = () => {
            api.get("/restaurants", {
                params: {
                    search: search,
                    cuisine: cuisine,
                    minRating: minRating
                }
            })
                .then((res) => setRestaurants(res.data.data))
                .catch((err) => setError(getErrorMessage(err)))
                .finally(() => setLoading(false));
        };

        let loadFoods = () => {
            api.get("/foods", {
                params: {
                    search: search,
                    minPrice: minPrice,
                    maxPrice: maxPrice,
                    available: true
                }
            })
                .then((res) => setFoods(res.data.data))
                .catch((err) => setError(getErrorMessage(err)))
                .finally(() => setLoading(false));
        };

        setLoading(true);
        setError("");

        let timer = setTimeout(() => {
            if (tab === "restaurants") {
                loadRestaurants();
            } else {
                loadFoods();
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [tab, search, cuisine, minRating, minPrice, maxPrice]);

    let clearFilters = () => {
        setSearch("");
        setCuisine("");
        setMinRating("");
        setMinPrice("");
        setMaxPrice("");
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                Browse Food
            </h1>

            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => setTab("restaurants")}
                    className={
                        tab === "restaurants"
                            ? "bg-orange-500 text-white px-3 py-2 rounded text-sm"
                            : "border border-gray-300 px-3 py-2 rounded text-sm"
                    }
                >
                    Restaurants
                </button>

                <button
                    onClick={() => setTab("dishes")}
                    className={
                        tab === "dishes"
                            ? "bg-orange-500 text-white px-3 py-2 rounded text-sm"
                            : "border border-gray-300 px-3 py-2 rounded text-sm"
                    }
                >
                    Dishes
                </button>
            </div>

            <div className="border border-gray-300 rounded p-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                        <label className="block text-sm text-gray-700 mb-1">
                            Search
                        </label>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            placeholder={
                                tab === "restaurants"
                                    ? "Restaurant name or cuisine"
                                    : "Dish name"
                            }
                        />
                    </div>

                    {tab === "restaurants" ? (
                        <>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Cuisine
                                </label>

                                <select
                                    value={cuisine}
                                    onChange={(e) => setCuisine(e.target.value)}
                                    className="border border-gray-300 rounded p-2 w-full"
                                >
                                    <option value="">All cuisines</option>

                                    {cuisines.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Minimum Rating
                                </label>

                                <select
                                    value={minRating}
                                    onChange={(e) => setMinRating(e.target.value)}
                                    className="border border-gray-300 rounded p-2 w-full"
                                >
                                    <option value="">Any rating</option>
                                    <option value="4">4 stars and above</option>
                                    <option value="3">3 stars and above</option>
                                    <option value="2">2 stars and above</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Min Price
                                </label>

                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="border border-gray-300 rounded p-2 w-full"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Max Price
                                </label>

                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="border border-gray-300 rounded p-2 w-full"
                                    placeholder="500"
                                />
                            </div>
                        </>
                    )}
                </div>

                <button
                    onClick={clearFilters}
                    className="border border-gray-300 px-3 py-2 rounded text-sm mt-4"
                >
                    Clear Filters
                </button>
            </div>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4">
                    {error}
                </div>
            )}

            {loading ? (
                <Loader />
            ) : tab === "restaurants" ? (
                restaurants.length === 0 ? (
                    <div className="mt-5">
                        <EmptyState
                            icon="🔍"
                            title="No restaurants found"
                            message="Try a different search or clear the filters."
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                        {restaurants.map((restaurant) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                            />
                        ))}
                    </div>
                )
            ) : foods.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="🍽️"
                        title="No dishes found"
                        message="Try another dish name or price range."
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                    {foods.map((food) => (
                        <FoodCard
                            key={food._id}
                            food={food}
                            showRestaurant={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Restaurants;