import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { formatDate, formatPrice, getErrorMessage } from "../../utils/helpers";

const MyOrders = () => {
    let [orders, setOrders] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    useEffect(() => {
        api.get("/orders/my-orders")
            .then((res) => setOrders(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader text="Loading your orders..." />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                My Orders
            </h1>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="🧾"
                        title="No orders yet"
                        message="Your order history will appear here."
                    >
                        <Link
                            to="/restaurants"
                            className="bg-orange-500 text-white px-3 py-2 rounded text-sm"
                        >
                            Order Now
                        </Link>
                    </EmptyState>
                </div>
            ) : (
                <div className="space-y-4 mt-5">
                    {orders.map((order) => (
                        <Link
                            key={order._id}
                            to={`/orders/${order._id}`}
                            className="border border-gray-300 rounded p-4 block"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {order.restaurant.name}
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
                                        {formatDate(order.createdAt)} · Order #
                                        {order._id.slice(-6).toUpperCase()}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <StatusBadge
                                        status={order.orderStatus}
                                    />

                                    <p className="font-semibold mt-2">
                                        {formatPrice(order.totalAmount)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;