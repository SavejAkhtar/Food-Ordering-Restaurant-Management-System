import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import DeliveryOrderCard from "../../components/DeliveryOrderCard";
import { getErrorMessage } from "../../utils/helpers";

const Dashboard = () => {
    let [orders, setOrders] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");
    let [acceptingId, setAcceptingId] = useState("");

    let navigate = useNavigate();

    let loadOrders = () => {
        api.get("/orders/delivery/available")
            .then((res) => setOrders(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    let acceptDelivery = (order) => {
        setError("");
        setAcceptingId(order._id);

        api.put(`/orders/${order._id}/accept-delivery`)
            .then(() => navigate("/delivery/orders"))
            .catch((err) => {
                setError(getErrorMessage(err));
                loadOrders();
            })
            .finally(() => setAcceptingId(""));
    };

    if (loading) {
        return <Loader text="Looking for orders..." />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Available Orders
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Orders that are ready for pickup from restaurants.
                    </p>
                </div>

                <button
                    onClick={loadOrders}
                    className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="🛵"
                        title="No orders available"
                        message="Check back in a while, restaurants are still preparing orders."
                    />
                </div>
            ) : (
                <div className="space-y-4 mt-5">
                    {orders.map((order) => (
                        <DeliveryOrderCard
                            key={order._id}
                            order={order}
                        >
                            <button
                                onClick={() => acceptDelivery(order)}
                                disabled={acceptingId === order._id}
                                className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                            >
                                {acceptingId === order._id
                                    ? "Accepting..."
                                    : "Accept Delivery"}
                            </button>
                        </DeliveryOrderCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;