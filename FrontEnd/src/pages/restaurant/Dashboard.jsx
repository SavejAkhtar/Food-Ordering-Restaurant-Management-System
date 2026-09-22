import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { formatDate, formatPrice, getErrorMessage } from "../../utils/helpers";

const Dashboard = () => {
    let [restaurant, setRestaurant] = useState(null);
    let [stats, setStats] = useState(null);
    let [orders, setOrders] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    useEffect(() => {
        api.get("/restaurants/my-restaurant")
            .then((res) => {
                setRestaurant(res.data.data);

                return Promise.all([
                    api.get("/orders/restaurant/stats"),
                    api.get("/orders/restaurant")
                ]);
            })
            .then(([statsResponse, ordersResponse]) => {
                setStats(statsResponse.data.data);
                setOrders(ordersResponse.data.data.slice(0, 5));
            })
            .catch((err) => {
                if (err.response && err.response.status !== 404) {
                    setError(getErrorMessage(err));
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader text="Loading dashboard..." />;
    }

    if (!restaurant) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <div className="mt-5">
                    <EmptyState
                        icon="🏪"
                        title="Set up your restaurant"
                        message="Create your restaurant profile to start adding menu items and receiving orders."
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
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {restaurant.name}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        {restaurant.cuisine} · {restaurant.address}
                    </p>
                </div>

                {restaurant.isActive ? (
                    <span className="text-green-600 text-sm">
                        Active
                    </span>
                ) : (
                    <span className="text-red-600 text-sm">
                        Deactivated by admin
                    </span>
                )}
            </div>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <StatCard label="New Orders" value={stats.newOrders} icon="🔔" />
                    <StatCard label="Active Orders" value={stats.activeOrders} icon="🍳" />
                    <StatCard label="Delivered" value={stats.deliveredOrders} icon="✅" />
                    <StatCard
                        label="Total Revenue"
                        value={formatPrice(stats.totalRevenue)}
                        icon="💰"
                    />
                    <StatCard label="Total Orders" value={stats.totalOrders} icon="🧾" />
                    <StatCard label="Cancelled" value={stats.cancelledOrders} icon="❌" />
                    <StatCard
                        label="Rating"
                        value={stats.rating > 0 ? `${stats.rating} ★` : "No rating"}
                        icon="⭐"
                    />
                    <StatCard label="Reviews" value={stats.reviewCount} icon="💬" />
                </div>
            )}

            <div className="flex items-center justify-between mt-10">
                <h2 className="text-xl font-semibold text-gray-800">
                    Recent Orders
                </h2>

                <Link
                    to="/restaurant/orders"
                    className="text-sm text-orange-600 font-semibold"
                >
                    View all
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="🧾"
                        title="No orders yet"
                        message="Orders from customers will show up here."
                    />
                </div>
            ) : (
                <div className="space-y-4 mt-5">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-gray-300 rounded p-4 flex flex-wrap items-start justify-between gap-3"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    #{order._id.slice(-6).toUpperCase()} ·{" "}
                                    {order.customer.name}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    {order.items
                                        .map(
                                            (item) =>
                                                `${item.name} × ${item.quantity}`
                                        )
                                        .join(", ")}
                                </p>

                                <p className="text-xs text-gray-400 mt-2">
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>

                            <div className="text-right">
                                <StatusBadge status={order.orderStatus} />

                                <p className="font-semibold mt-2">
                                    {formatPrice(order.totalAmount)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;