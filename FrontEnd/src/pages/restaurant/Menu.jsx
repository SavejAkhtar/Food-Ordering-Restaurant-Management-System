import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import CategoryManager from "../../components/CategoryManager";
import FoodManager from "../../components/FoodManager";
import { getErrorMessage } from "../../utils/helpers";

const Menu = () => {
    let [restaurant, setRestaurant] = useState(null);
    let [categories, setCategories] = useState([]);
    let [foods, setFoods] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    let loadMenu = (restaurantId) => {
        api.get("/categories", { params: { restaurant: restaurantId } })
            .then((res) => setCategories(res.data.data))
            .catch((err) => setError(getErrorMessage(err)));

        api.get("/foods", { params: { restaurant: restaurantId } })
            .then((res) => setFoods(res.data.data))
            .catch((err) => setError(getErrorMessage(err)));
    };

    useEffect(() => {
        api.get("/restaurants/my-restaurant")
            .then((res) => {
                setRestaurant(res.data.data);
                loadMenu(res.data.data._id);
            })
            .catch(() => setRestaurant(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader text="Loading menu..." />;
    }

    if (!restaurant) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Menu
                </h1>

                <div className="mt-5">
                    <EmptyState
                        icon="🏪"
                        title="No restaurant found"
                        message="Create your restaurant before managing the menu."
                    >
                        <Link
                            to="/restaurant/profile"
                            className="bg-orange-500 text-white px-3 py-2 rounded text-sm"
                        >
                            Create Restaurant
                        </Link>
                    </EmptyState>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                Manage Menu
            </h1>

            <p className="text-sm text-gray-500 mt-1">
                {restaurant.name}
            </p>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <CategoryManager
                    categories={categories}
                    onChanged={() => loadMenu(restaurant._id)}
                />

                <div className="lg:col-span-2">
                    <FoodManager
                        categories={categories}
                        foods={foods}
                        onChanged={() => loadMenu(restaurant._id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Menu;