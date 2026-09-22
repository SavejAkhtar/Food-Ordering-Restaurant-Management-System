import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import EmptyState from "../../components/EmptyState";
import { DELIVERY_FEE, formatPrice } from "../../utils/helpers";

const Cart = () => {
    let {
        cart,
        subtotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    let navigate = useNavigate();

    if (cart.items.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Your Cart
                </h1>

                <div className="mt-5">
                    <EmptyState
                        icon="🛒"
                        title="Your cart is empty"
                        message="Add some dishes to get started."
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

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                Your Cart
            </h1>

            <p className="text-sm text-gray-500 mt-1">
                Ordering from {cart.restaurant.name}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item.foodItem}
                            className="border border-gray-300 rounded p-4 flex items-center justify-between gap-4"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {item.name}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    {formatPrice(item.price)} each
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 border border-gray-300 rounded px-3 py-1">
                                    <button
                                        onClick={() =>
                                            decreaseQuantity(item.foodItem)
                                        }
                                        className="text-orange-600 font-bold"
                                    >
                                        −
                                    </button>

                                    <span className="text-sm font-semibold">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            increaseQuantity(item.foodItem)
                                        }
                                        className="text-orange-600 font-bold"
                                    >
                                        +
                                    </button>
                                </div>

                                <span className="font-semibold w-16 text-right">
                                    {formatPrice(item.price * item.quantity)}
                                </span>

                                <button
                                    onClick={() =>
                                        removeFromCart(item.foodItem)
                                    }
                                    className="text-sm text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="border border-gray-300 rounded p-5 h-fit">
                    <h2 className="font-semibold text-gray-800">
                        Bill Summary
                    </h2>

                    <div className="flex justify-between text-sm mt-4">
                        <span className="text-gray-500">Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-500">Delivery Fee</span>
                        <span>{formatPrice(DELIVERY_FEE)}</span>
                    </div>

                    <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-gray-200">
                        <span>Total</span>
                        <span>{formatPrice(subtotal + DELIVERY_FEE)}</span>
                    </div>

                    <button
                        onClick={() => navigate("/checkout")}
                        className="bg-orange-500 text-white px-3 py-2 rounded w-full mt-5"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;