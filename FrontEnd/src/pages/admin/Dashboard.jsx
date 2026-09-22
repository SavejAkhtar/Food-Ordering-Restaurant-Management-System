import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import StatCard from "../../components/StatCard";
import { formatPrice, getErrorMessage } from "../../utils/helpers";

const Dashboard = () => {
    let [stats, setStats] = useState(null);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    useEffect(() => {
        api.get("/admin/stats")
            .then((res) => setStats(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader text="Loading platform stats..." />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-1">
                Overview of the whole platform.
            </p>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            {stats && (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        <StatCard label="Customers" value={stats.customers} icon="👥" />
                        <StatCard label="Restaurant Owners" value={stats.restaurantOwners} icon="🏪" />
                        <StatCard label="Delivery Partners" value={stats.deliveryPartners} icon="🛵" />
                        <StatCard
                            label="Restaurants"
                            value={`${stats.activeRestaurants}/${stats.restaurants}`}
                            icon="🍴"
                        />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <StatCard label="Total Orders" value={stats.totalOrders} icon="🧾" />
                        <StatCard label="Delivered" value={stats.deliveredOrders} icon="✅" />
                        <StatCard label="Cancelled" value={stats.cancelledOrders} icon="❌" />
                        <StatCard
                            label="Revenue"
                            value={formatPrice(stats.totalRevenue)}
                            icon="💰"
                        />
                    </div>
                </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <Link
                    to="/admin/users"
                    className="border border-gray-300 rounded p-4"
                >
                    <h3 className="font-semibold text-gray-800">
                        Manage Users
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        View and deactivate platform users.
                    </p>
                </Link>

                <Link
                    to="/admin/restaurants"
                    className="border border-gray-300 rounded p-4"
                >
                    <h3 className="font-semibold text-gray-800">
                        Manage Restaurants
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Activate or deactivate restaurants.
                    </p>
                </Link>

                <Link
                    to="/admin/orders"
                    className="border border-gray-300 rounded p-4"
                >
                    <h3 className="font-semibold text-gray-800">
                        All Orders
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Track every order on the platform.
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;