import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/helpers";

const FoodCard = ({ food, restaurant, showRestaurant = false }) => {
    let { user } = useAuth();
    let { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
    let navigate = useNavigate();

    let foodRestaurant = restaurant || food.restaurant;
    let cartItem = cart.items.find((item) => item.foodItem === food._id);
    let canOrder = !user || user.role === "customer";

    let handleAdd = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        addToCart(food, foodRestaurant);
    };

    return (
        <div className="bg-white rounded border border-gray-200 overflow-hidden flex">
            <div className="relative w-28 shrink-0 bg-orange-100 flex items-center justify-center text-3xl">
                🍛

                {food.image && (
                    <img
                        src={food.image}
                        alt={food.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                    />
                )}
            </div>

            <div className="p-4 flex-1">
                <h3 className="font-semibold text-gray-800">
                    {food.name}
                </h3>

                {showRestaurant && foodRestaurant && (
                    <p className="text-xs text-orange-600 mt-1">
                        {foodRestaurant.name}
                    </p>
                )}

                {food.description && (
                    <p className="text-sm text-gray-500 mt-1">
                        {food.description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-gray-800">
                        {formatPrice(food.price)}
                    </span>

                    {!food.isAvailable ? (
                        <span className="text-xs font-semibold text-red-600">
                            Unavailable
                        </span>
                    ) : (
                        canOrder &&
                        (cartItem ? (
                            <div className="flex items-center gap-3 border border-gray-300 rounded px-2 py-1">
                                <button
                                    onClick={() => decreaseQuantity(food._id)}
                                    className="text-orange-600 font-bold"
                                >
                                    −
                                </button>

                                <span className="text-sm font-semibold">
                                    {cartItem.quantity}
                                </span>

                                <button
                                    onClick={() => increaseQuantity(food._id)}
                                    className="text-orange-600 font-bold"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAdd}
                                className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Add
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodCard;