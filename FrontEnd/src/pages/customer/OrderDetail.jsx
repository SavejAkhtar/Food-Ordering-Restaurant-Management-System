import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import StarRating from "../../components/StarRating";
import OrderStatusTracker from "../../components/OrderStatusTracker";
import { useAuth } from "../../context/AuthContext";
import { formatDate, formatPrice, getErrorMessage } from "../../utils/helpers";

const OrderDetail = () => {
    let { id } = useParams();
    let { user } = useAuth();

    let [order, setOrder] = useState(null);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");
    let [message, setMessage] = useState("");
    let [rating, setRating] = useState(0);
    let [comment, setComment] = useState("");
    let [saving, setSaving] = useState(false);

    let loadOrder = () => {
        api.get(`/orders/${id}`)
            .then((res) => setOrder(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadOrder();
    }, [id]);

    let cancelOrder = () => {
        if (!window.confirm("Do you want to cancel this order?")) {
            return;
        }

        setError("");
        setSaving(true);

        api.put(`/orders/${id}/status`, {
            status: "Cancelled",
            cancelReason: "Cancelled by customer"
        })
            .then(() => {
                setMessage("Your order has been cancelled");
                loadOrder();
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setSaving(false));
    };

    let submitReview = (e) => {
        e.preventDefault();
        setError("");

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setSaving(true);

        api.post("/reviews", {
            order: id,
            rating: rating,
            comment: comment
        })
            .then(() => {
                setMessage("Thanks for your feedback");
                loadOrder();
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setSaving(false));
    };

    if (loading) {
        return <Loader text="Loading order..." />;
    }

    if (!order) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded text-sm">
                    {error || "Order not found"}
                </div>
            </div>
        );
    }

    let isMyOrder = user.role === "customer";
    let canCancel =
        isMyOrder &&
        (order.orderStatus === "Placed" ||
            order.orderStatus === "Accepted");

    let canReview =
        isMyOrder &&
        order.orderStatus === "Delivered" &&
        !order.isReviewed;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Order #{order._id.slice(-6).toUpperCase()}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Placed on {formatDate(order.createdAt)}
                    </p>
                </div>

                <StatusBadge status={order.orderStatus} />
            </div>

            {message && (
                <div className="border border-green-300 bg-green-50 text-green-600 p-3 rounded mt-4 text-sm">
                    {message}
                </div>
            )}

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            <div className="border border-gray-300 rounded p-5 mt-6">
                <h2 className="font-semibold text-gray-800 mb-5">
                    Order Tracking
                </h2>

                <OrderStatusTracker status={order.orderStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 border border-gray-300 rounded p-5">
                    <h2 className="font-semibold text-gray-800">
                        {order.restaurant.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {order.restaurant.address}
                    </p>

                    <div className="mt-5 space-y-3">
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
                                        item.price * item.quantity
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between text-sm mt-4 pt-4 border-t border-gray-200">
                        <span className="text-gray-500">
                            Items Total
                        </span>

                        <span>{formatPrice(order.itemsTotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-500">
                            Delivery Fee
                        </span>

                        <span>{formatPrice(order.deliveryFee)}</span>
                    </div>

                    <div className="flex justify-between font-semibold mt-3 pt-3 border-t border-gray-200">
                        <span>Total Paid</span>

                        <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="border border-gray-300 rounded p-5">
                        <h2 className="font-semibold text-gray-800">
                            Delivery
                        </h2>

                        <p className="text-sm text-gray-600 mt-3">
                            {order.deliveryAddress}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Contact:{" "}
                            {order.contactNumber || "Not provided"}
                        </p>

                        {order.deliveryPartner ? (
                            <p className="text-sm text-gray-600 mt-3">
                                Delivery partner:{" "}
                                {order.deliveryPartner.name} (
                                {order.deliveryPartner.phone})
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 mt-3">
                                Delivery partner not assigned yet
                            </p>
                        )}
                    </div>

                    <div className="border border-gray-300 rounded p-5">
                        <h2 className="font-semibold text-gray-800">
                            Payment
                        </h2>

                        <p className="text-sm text-gray-600 mt-3">
                            Method:{" "}
                            {order.paymentMethod === "Online"
                                ? "Paid Online (Mock)"
                                : "Cash on Delivery"}
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                            Status: {order.paymentStatus}
                        </p>

                        {order.transactionId && (
                            <p className="text-sm text-gray-600 mt-1">
                                Transaction: {order.transactionId}
                            </p>
                        )}
                    </div>

                    {canCancel && (
                        <button
                            onClick={cancelOrder}
                            disabled={saving}
                            className="border border-red-500 text-red-600 px-3 py-2 rounded w-full"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>

            {order.orderStatus === "Cancelled" &&
                order.cancelReason && (
                    <p className="text-sm text-gray-500 mt-4">
                        Reason: {order.cancelReason}
                    </p>
                )}

            {canReview && (
                <div className="border border-gray-300 rounded p-5 mt-6">
                    <h2 className="font-semibold text-gray-800">
                        Rate {order.restaurant.name}
                    </h2>

                    <form onSubmit={submitReview} className="mt-4">
                        <StarRating
                            value={rating}
                            onChange={setRating}
                            size="text-3xl"
                        />

                        <label className="block text-sm text-gray-700 mt-4 mb-1">
                            Your Review (optional)
                        </label>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="3"
                            className="border border-gray-300 rounded p-2 w-full"
                            placeholder="How was the food and delivery?"
                        />

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-orange-500 text-white px-3 py-2 rounded mt-4"
                        >
                            {saving
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>
                    </form>
                </div>
            )}

            {isMyOrder && order.isReviewed && (
                <div className="border border-green-300 bg-green-50 text-green-600 p-3 rounded mt-6 text-sm">
                    You have already reviewed this order.
                </div>
            )}
        </div>
    );
};

export default OrderDetail;