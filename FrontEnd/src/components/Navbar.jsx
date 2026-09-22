import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const linksByRole = {
    customer: [
        { to: "/restaurants", label: "Restaurants" },
        { to: "/orders", label: "My Orders" },
        { to: "/profile", label: "Profile" }
    ],
    restaurantOwner: [
        { to: "/restaurant/dashboard", label: "Dashboard" },
        { to: "/restaurant/menu", label: "Menu" },
        { to: "/restaurant/orders", label: "Orders" },
        { to: "/restaurant/profile", label: "My Restaurant" }
    ],
    deliveryPartner: [
        { to: "/delivery/dashboard", label: "Available Orders" },
        { to: "/delivery/orders", label: "My Deliveries" },
        { to: "/delivery/history", label: "History" }
    ],
    admin: [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/users", label: "Users" },
        { to: "/admin/restaurants", label: "Restaurants" },
        { to: "/admin/orders", label: "Orders" }
    ]
};

const Navbar = () => {
    let { user, logout } = useAuth();
    let { totalItems } = useCart();
    let navigate = useNavigate();

    let links = user
        ? linksByRole[user.role]
        : [{ to: "/restaurants", label: "Restaurants" }];

    let showCart = !user || user.role === "customer";

    let handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="bg-white border-b border-gray-300">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
                <Link to="/" className="text-xl font-bold text-orange-600">
                    FoodHub
                </Link>

                <nav className="flex items-center gap-4 text-sm flex-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-600 font-semibold"
                                    : "text-gray-600"
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {showCart && (
                        <Link to="/cart" className="relative text-xl">
                            🛒

                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-xs rounded w-4 h-4 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {user ? (
                        <>
                            <span className="text-sm text-gray-600 hidden sm:inline">
                                Hi, {user.name.split(" ")[0]}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="border border-gray-300 px-3 py-1 rounded text-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="border border-gray-300 px-3 py-1 rounded text-sm"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;