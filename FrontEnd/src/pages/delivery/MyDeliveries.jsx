import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import DeliveryOrderCard from "../../components/DeliveryOrderCard";
import { getErrorMessage } from "../../utils/helpers";

const activeStatuses = ["ReadyForPickup", "OutForDelivery"];

const MyDeliveries = () => {
    let [orders, setOrders] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");
    let [updatingId, setUpdatingId] = useState("");

    let loadOrders = () => {
        api.get("/orders/delivery/my")
            .then((res) =>
                setOrders(
                    res.data.data.filter((order) =>
                        activeStatuses.includes(order.orderStatus)
                    )
                )
            )
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    let updateStatus = (order, status) => {
        setError("");
        setUpdatingId(order._id);

        api.put(`/orders/${order._id}/status`, { status: status })
            .then(() => loadOrders())
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setUpdatingId(""));
    };

    if (loading) {
        return <Loader text="Loading your deliveries..." />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                My Deliveries
            </h1>

            <p className="text-sm text-gray-500 mt-1">
                Orders you have accepted and are delivering now.
            </p>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="📦"
                        title="No active deliveries"
                        message="Accept an order to start delivering."
                    >
                        <Link
                            to="/delivery/dashboard"
                            className="bg-orange-500 text-white px-3 py-2 rounded text-sm"
                        >
                            See Available Orders
                        </Link>
                    </EmptyState>
                </div>
            ) : (
                <div className="space-y-4 mt-5">
                    {orders.map((order) => (
                        <DeliveryOrderCard
                            key={order._id}
                            order={order}
                        >
                            {order.orderStatus === "ReadyForPickup" && (
                                <button
                                    onClick={() =>
                                        updateStatus(
                                            order,
                                            "OutForDelivery"
                                        )
                                    }
                                    disabled={updatingId === order._id}
                                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                                >
                                    Picked Up, Out For Delivery
                                </button>
                            )}

                            {order.orderStatus === "OutForDelivery" && (
                                <button
                                    onClick={() =>
                                        updateStatus(order, "Delivered")
                                    }
                                    disabled={updatingId === order._id}
                                    className="border border-green-500 text-green-600 px-3 py-1 rounded text-sm"
                                >
                                    Mark As Delivered
                                </button>
                            )}
                        </DeliveryOrderCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyDeliveries;