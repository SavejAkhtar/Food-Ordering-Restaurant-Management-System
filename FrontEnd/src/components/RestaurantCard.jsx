import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link
            to={`/restaurants/${restaurant._id}`}
            className="bg-white rounded border border-gray-300 overflow-hidden"
        >
            <div className="relative h-40 bg-orange-100 flex items-center justify-center text-4xl">
                🍴

                {restaurant.image && (
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                    />
                )}
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-800">
                        {restaurant.name}
                    </h3>

                    <span className="shrink-0 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        {restaurant.rating > 0
                            ? restaurant.rating
                            : "New"}{" "}
                        {restaurant.rating > 0 && "★"}
                    </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                    {restaurant.cuisine}
                </p>

                <p className="text-xs text-gray-500 mt-2 truncate">
                    {restaurant.address}
                </p>
            </div>
        </Link>
    );
};

export default RestaurantCard;