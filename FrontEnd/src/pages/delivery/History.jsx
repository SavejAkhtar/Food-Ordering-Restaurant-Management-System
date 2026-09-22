import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import DeliveryOrderCard from "../../components/DeliveryOrderCard";
import { formatPrice, getErrorMessage } from "../../utils/helpers";

const History = () => {
    let [orders, setOrders] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    useEffect(() => {
        api.get("/orders/delivery/my", { params: { status: "Delivered" } })
            .then((res) => setOrders(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader text="Loading delivery history..." />;
    }

    let totalDelivered = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                Delivery History
            </h1>

            <p className="text-sm text-gray-500 mt-1">
                {orders.length} completed deliveries ·{" "}
                {formatPrice(totalDelivered)} worth of orders
            </p>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="🗂️"
                        title="No completed deliveries"
                        message="Your delivered orders will be listed here."
                    />
                </div>
            ) : (
                <div className="space-y-4 mt-5">
                    {orders.map((order) => (
                        <DeliveryOrderCard
                            key={order._id}
                            order={order}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;