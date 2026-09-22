import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import FoodCard from "../components/FoodCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StarRating from "../components/StarRating";
import { useCart } from "../context/CartContext";
import { formatDate, formatPrice, getErrorMessage } from "../utils/helpers";

const RestaurantDetail = () => {
    let { id } = useParams();
    let { cart, subtotal } = useCart();

    let [restaurant, setRestaurant] = useState(null);
    let [categories, setCategories] = useState([]);
    let [reviews, setReviews] = useState([]);
    let [foods, setFoods] = useState([]);
    let [selectedCategory, setSelectedCategory] = useState("");
    let [menuSearch, setMenuSearch] = useState("");
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);

        api.get(`/restaurants/${id}`)
            .then((res) => setRestaurant(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));

        api.get("/categories", { params: { restaurant: id } })
            .then((res) => setCategories(res.data.data))
            .catch(() => setCategories([]));

        api.get(`/restaurants/${id}/reviews`)
            .then((res) => setReviews(res.data.data))
            .catch(() => setReviews([]));
    }, [id]);

    useEffect(() => {
        let timer = setTimeout(() => {
            api.get("/foods", {
                params: {
                    restaurant: id,
                    category: selectedCategory,
                    search: menuSearch
                }
            })
                .then((res) => setFoods(res.data.data))
                .catch((err) => setError(getErrorMessage(err)));
        }, 300);

        return () => clearTimeout(timer);
    }, [id, selectedCategory, menuSearch]);

    if (loading) {
        return <Loader text="Loading restaurant..." />;
    }

    if (!restaurant) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded">
                    {error || "Restaurant not found"}
                </div>
            </div>
        );
    }

    let cartBelongsHere =
        cart.restaurant && cart.restaurant._id === restaurant._id;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="border border-gray-300 rounded overflow-hidden">
                <div className="relative h-48 bg-orange-100 flex items-center justify-center text-5xl">
                    🍴

                    {restaurant.image && (
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    )}
                </div>

                <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {restaurant.name}
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                {restaurant.cuisine} · {restaurant.address}
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded inline-block">
                                {restaurant.rating > 0
                                    ? `${restaurant.rating} ★`
                                    : "New"}
                            </div>

                            <p className="text-xs text-gray-500 mt-1">
                                {restaurant.reviewCount} reviews
                            </p>
                        </div>
                    </div>

                    {restaurant.description && (
                        <p className="text-sm text-gray-600 mt-3">
                            {restaurant.description}
                        </p>
                    )}

                    {!restaurant.isActive && (
                        <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4">
                            This restaurant is currently not accepting orders.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
                <input
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search in menu"
                    className="border border-gray-300 rounded p-2 w-full sm:w-64"
                />

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory("")}
                        className={
                            selectedCategory === ""
                                ? "bg-orange-500 text-white px-3 py-2 rounded text-sm"
                                : "border border-gray-300 px-3 py-2 rounded text-sm"
                        }
                    >
                        All
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => setSelectedCategory(category._id)}
                            className={
                                selectedCategory === category._id
                                    ? "bg-orange-500 text-white px-3 py-2 rounded text-sm"
                                    : "border border-gray-300 px-3 py-2 rounded text-sm"
                            }
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {foods.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="🍽️"
                        title="No dishes here"
                        message="This category has no matching food items."
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                    {foods.map((food) => (
                        <FoodCard
                            key={food._id}
                            food={food}
                            restaurant={restaurant}
                        />
                    ))}
                </div>
            )}

            <h2 className="text-xl font-semibold text-gray-800 mt-10">
                Ratings & Reviews
            </h2>

            {reviews.length === 0 ? (
                <p className="text-sm text-gray-500 mt-3">
                    No reviews yet. Order and be the first to review.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="border border-gray-300 rounded p-4"
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-gray-800">
                                    {review.customer.name}
                                </p>

                                <StarRating
                                    value={review.rating}
                                    size="text-sm"
                                />
                            </div>

                            {review.comment && (
                                <p className="text-sm text-gray-600 mt-2">
                                    {review.comment}
                                </p>
                            )}

                            <p className="text-xs text-gray-500 mt-2">
                                {formatDate(review.createdAt)}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {cartBelongsHere && cart.items.length > 0 && (
                <div className="mt-8">
                    <div className="bg-gray-800 text-white rounded px-4 py-3 flex items-center justify-between">
                        <span className="text-sm">
                            {cart.items.length} item(s) ·{" "}
                            {formatPrice(subtotal)}
                        </span>

                        <Link
                            to="/cart"
                            className="bg-orange-500 text-white px-3 py-2 rounded text-sm"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantDetail;