import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import {
    formatDate,
    formatPrice,
    getErrorMessage,
    statusLabels
} from "../../utils/helpers";

const nextActions = {
    Placed: [
        { status: "Accepted", label: "Accept Order", style: "success" },
        { status: "Cancelled", label: "Reject Order", style: "danger" }
    ],
    Accepted: [
        { status: "Preparing", label: "Start Preparing", style: "primary" }
    ],
    Preparing: [
        {
            status: "ReadyForPickup",
            label: "Mark Ready For Pickup",
            style: "primary"
        }
    ]
};

const Orders = () => {
    let [orders, setOrders] = useState([]);
    let [statusFilter, setStatusFilter] = useState("");
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");
    let [updatingId, setUpdatingId] = useState("");

    let loadOrders = () => {
        api.get("/orders/restaurant", { params: { status: statusFilter } })
            .then((res) => setOrders(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        loadOrders();
    }, [statusFilter]);

    let updateStatus = (order, status) => {
        if (
            status === "Cancelled" &&
            !window.confirm("Reject this order?")
        ) {
            return;
        }

        setError("");
        setUpdatingId(order._id);

        api.put(`/orders/${order._id}/status`, {
            status: status,
            cancelReason:
                status === "Cancelled"
                    ? "Rejected by restaurant"
                    : ""
        })
            .then(() => loadOrders())
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setUpdatingId(""));
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-gray-800">
                    Incoming Orders
                </h1>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                >
                    <option value="">All statuses</option>

                    {Object.keys(statusLabels).map((status) => (
                        <option key={status} value={status}>
                            {statusLabels[status]}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <Loader />
            ) : orders.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="🧾"
                        title="No orders found"
                        message="Orders matching this filter will appear here."
                    />
                </div>
            ) : (
                <div className="space-y-4 mt-5">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-gray-300 rounded p-4"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        #{order._id.slice(-6).toUpperCase()} ·{" "}
                                        {order.customer.name}
                                    </h3>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatDate(order.createdAt)}
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

                            <div className="mt-4 space-y-1">
                                {order.items.map((item) => (
                                    <div
                                        key={item.foodItem}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-gray-700">
                                            {item.name} × {item.quantity}
                                        </span>

                                        <span>
                                            {formatPrice(
                                                item.price *
                                                    item.quantity
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                                <p>
                                    Deliver to: {order.deliveryAddress}
                                </p>

                                <p className="mt-1">
                                    Contact:{" "}
                                    {order.contactNumber ||
                                        order.customer.phone ||
                                        "Not provided"}{" "}
                                    ·{" "}
                                    {order.paymentMethod === "Online"
                                        ? `Paid Online (${order.paymentStatus})`
                                        : "Cash on Delivery"}
                                </p>

                                {order.deliveryPartner && (
                                    <p className="mt-1">
                                        Delivery partner:{" "}
                                        {order.deliveryPartner.name} (
                                        {order.deliveryPartner.phone})
                                    </p>
                                )}
                            </div>

                            {nextActions[order.orderStatus] && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {nextActions[order.orderStatus].map(
                                        (action) => (
                                            <button
                                                key={action.status}
                                                onClick={() =>
                                                    updateStatus(
                                                        order,
                                                        action.status
                                                    )
                                                }
                                                disabled={
                                                    updatingId ===
                                                    order._id
                                                }
                                                className={
                                                    action.style ===
                                                    "danger"
                                                        ? "border border-red-500 text-red-600 px-3 py-1 rounded text-sm"
                                                        : "bg-orange-500 text-white px-3 py-1 rounded text-sm"
                                                }
                                            >
                                                {action.label}
                                            </button>
                                        )
                                    )}
                                </div>
                            )}

                            {order.orderStatus ===
                                "ReadyForPickup" && (
                                <p className="text-xs text-gray-400 mt-3">
                                    Waiting for a delivery partner to pick
                                    this up.
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;