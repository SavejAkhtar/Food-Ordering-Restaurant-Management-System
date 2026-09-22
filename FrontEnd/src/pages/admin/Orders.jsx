import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const Orders = () => {
    let [orders, setOrders] = useState([]);
    let [statusFilter, setStatusFilter] = useState("");
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);

        api.get("/admin/orders", { params: { status: statusFilter } })
            .then((res) => setOrders(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    }, [statusFilter]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-gray-800">
                    All Orders
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
                <div className="border border-gray-300 rounded mt-5 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-300">
                            <tr>
                                <th className="text-left p-3">Order</th>
                                <th className="text-left p-3">Customer</th>
                                <th className="text-left p-3">Restaurant</th>
                                <th className="text-left p-3">Delivery Partner</th>
                                <th className="text-left p-3">Amount</th>
                                <th className="text-left p-3">Payment</th>
                                <th className="text-left p-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b border-gray-200">
                                    <td className="p-3 font-medium text-gray-800">
                                        <Link to={`/orders/${order._id}`}>
                                            #{order._id.slice(-6).toUpperCase()}
                                        </Link>

                                        <p className="text-xs text-gray-400 font-normal">
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {order.customer ? order.customer.name : "-"}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {order.restaurant ? order.restaurant.name : "-"}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {order.deliveryPartner
                                            ? order.deliveryPartner.name
                                            : "Not assigned"}
                                    </td>

                                    <td className="p-3">
                                        {formatPrice(order.totalAmount)}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {order.paymentStatus}

                                        <p className="text-xs text-gray-400">
                                            {order.paymentMethod === "Online"
                                                ? "Online"
                                                : "Cash on Delivery"}
                                        </p>
                                    </td>

                                    <td className="p-3">
                                        <StatusBadge status={order.orderStatus} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Orders;