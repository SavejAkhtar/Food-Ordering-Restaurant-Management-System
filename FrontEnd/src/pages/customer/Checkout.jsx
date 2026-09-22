import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import EmptyState from "../../components/EmptyState";
import {
    DELIVERY_FEE,
    formatPrice,
    getErrorMessage
} from "../../utils/helpers";

const Checkout = () => {
    let { user } = useAuth();
    let { cart, subtotal, clearCart } = useCart();
    let navigate = useNavigate();

    let [address, setAddress] = useState(user.address || "");
    let [contactNumber, setContactNumber] = useState(user.phone || "");
    let [paymentMethod, setPaymentMethod] = useState("Online");
    let [status, setStatus] = useState("");
    let [error, setError] = useState("");
    let [placing, setPlacing] = useState(false);

    if (cart.items.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Checkout
                </h1>

                <div className="mt-5">
                    <EmptyState
                        icon="🛒"
                        title="Nothing to checkout"
                        message="Your cart is empty."
                    >
                        <Link
                            to="/restaurants"
                            className="bg-orange-500 text-white px-3 py-2 rounded text-sm"
                        >
                            Browse Restaurants
                        </Link>
                    </EmptyState>
                </div>
            </div>
        );
    }

    let placeOrder = async () => {
        setError("");

        if (address.trim() === "") {
            setError("Please enter a delivery address");
            return;
        }

        setPlacing(true);

        try {
            setStatus("Creating your order...");

            let orderResponse = await api.post("/orders", {
                restaurant: cart.restaurant._id,
                items: cart.items.map((item) => ({
                    foodItem: item.foodItem,
                    quantity: item.quantity
                })),
                deliveryAddress: address,
                contactNumber: contactNumber,
                paymentMethod: paymentMethod
            });

            let order = orderResponse.data.data;

            clearCart();

            if (paymentMethod === "Online") {
                setStatus("Processing payment...");

                await api.post("/payments/process", {
                    orderId: order._id
                });
            }

            navigate(`/orders/${order._id}`);
        } catch (err) {
            setError(getErrorMessage(err));
            setStatus("");
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                Checkout
            </h1>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="border border-gray-300 rounded p-5">
                        <h2 className="font-semibold text-gray-800">
                            Delivery Details
                        </h2>

                        <label className="block text-sm text-gray-700 mt-4 mb-1">
                            Delivery Address
                        </label>

                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows="3"
                            className="border border-gray-300 rounded p-2 w-full"
                            placeholder="House no, street, area, city"
                        />

                        <label className="block text-sm text-gray-700 mt-4 mb-1">
                            Contact Number
                        </label>

                        <input
                            value={contactNumber}
                            onChange={(e) =>
                                setContactNumber(e.target.value)
                            }
                            className="border border-gray-300 rounded p-2 w-full"
                            placeholder="10 digit number"
                        />
                    </div>

                    <div className="border border-gray-300 rounded p-5">
                        <h2 className="font-semibold text-gray-800">
                            Payment Method
                        </h2>

                        <label className="flex items-start gap-3 mt-4">
                            <input
                                type="radio"
                                name="payment"
                                value="Online"
                                checked={paymentMethod === "Online"}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                className="mt-1"
                            />

                            <span>
                                <span className="font-medium text-sm">
                                    Pay Online
                                </span>

                                <span className="block text-xs text-gray-500">
                                    Uses a mock payment API for this project,
                                    no real money is charged.
                                </span>
                            </span>
                        </label>

                        <label className="flex items-start gap-3 mt-4">
                            <input
                                type="radio"
                                name="payment"
                                value="CashOnDelivery"
                                checked={paymentMethod === "CashOnDelivery"}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                className="mt-1"
                            />

                            <span>
                                <span className="font-medium text-sm">
                                    Cash on Delivery
                                </span>

                                <span className="block text-xs text-gray-500">
                                    Pay the delivery partner when the order
                                    arrives.
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="border border-gray-300 rounded p-5 h-fit">
                    <h2 className="font-semibold text-gray-800">
                        {cart.restaurant.name}
                    </h2>

                    <div className="mt-4 space-y-2">
                        {cart.items.map((item) => (
                            <div
                                key={item.foodItem}
                                className="flex justify-between text-sm"
                            >
                                <span className="text-gray-600">
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
                            Subtotal
                        </span>

                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-500">
                            Delivery Fee
                        </span>

                        <span>{formatPrice(DELIVERY_FEE)}</span>
                    </div>

                    <div className="flex justify-between font-semibold mt-3 pt-3 border-t border-gray-200">
                        <span>Total</span>

                        <span>
                            {formatPrice(subtotal + DELIVERY_FEE)}
                        </span>
                    </div>

                    <button
                        onClick={placeOrder}
                        disabled={placing}
                        className="bg-orange-500 text-white px-3 py-2 rounded w-full mt-5"
                    >
                        {placing
                            ? status
                            : `Place Order · ${formatPrice(
                                  subtotal + DELIVERY_FEE
                              )}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;