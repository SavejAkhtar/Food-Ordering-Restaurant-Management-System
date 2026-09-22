import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Profile from "./pages/Profile";

import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import MyOrders from "./pages/customer/MyOrders";
import OrderDetail from "./pages/customer/OrderDetail";

import OwnerDashboard from "./pages/restaurant/Dashboard";
import OwnerMenu from "./pages/restaurant/Menu";
import OwnerOrders from "./pages/restaurant/Orders";
import RestaurantProfile from "./pages/restaurant/RestaurantProfile";

import DeliveryDashboard from "./pages/delivery/Dashboard";
import MyDeliveries from "./pages/delivery/MyDeliveries";
import DeliveryHistory from "./pages/delivery/History";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRestaurants from "./pages/admin/Restaurants";
import AdminOrders from "./pages/admin/Orders";

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurants/:id" element={<RestaurantDetail />} />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute roles={["customer"]}>
                            <Cart />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute roles={["customer"]}>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute roles={["customer"]}>
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders/:id"
                    element={
                        <ProtectedRoute>
                            <OrderDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/restaurant/dashboard"
                    element={
                        <ProtectedRoute roles={["restaurantOwner"]}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/restaurant/menu"
                    element={
                        <ProtectedRoute roles={["restaurantOwner"]}>
                            <OwnerMenu />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/restaurant/orders"
                    element={
                        <ProtectedRoute roles={["restaurantOwner"]}>
                            <OwnerOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/restaurant/profile"
                    element={
                        <ProtectedRoute roles={["restaurantOwner"]}>
                            <RestaurantProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/delivery/dashboard"
                    element={
                        <ProtectedRoute roles={["deliveryPartner"]}>
                            <DeliveryDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/delivery/orders"
                    element={
                        <ProtectedRoute roles={["deliveryPartner"]}>
                            <MyDeliveries />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/delivery/history"
                    element={
                        <ProtectedRoute roles={["deliveryPartner"]}>
                            <DeliveryHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute roles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute roles={["admin"]}>
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/restaurants"
                    element={
                        <ProtectedRoute roles={["admin"]}>
                            <AdminRestaurants />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute roles={["admin"]}>
                            <AdminOrders />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default App;
