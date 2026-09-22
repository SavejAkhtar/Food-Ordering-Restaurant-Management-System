import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, homePathForRole } from "../utils/helpers";

const Register = () => {
    let [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "customer"
    });

    let [error, setError] = useState("");
    let [saving, setSaving] = useState(false);

    let { login } = useAuth();
    let navigate = useNavigate();

    let handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    let handleRegister = (e) => {
        e.preventDefault();
        setError("");

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setSaving(true);

        api.post("/auth/register", form)
            .then((res) => {
                login(res.data.token, res.data.user);
                navigate(homePathForRole(res.data.user.role));
            })
            .catch((err) => {
                setError(getErrorMessage(err));
            })
            .finally(() => {
                setSaving(false);
            });
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-10">
            <div className="border border-gray-300 rounded p-5">
                <h1 className="text-2xl font-bold text-gray-800">
                    Create Account
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Join FoodHub as a customer, restaurant owner or delivery
                    partner
                </p>

                {error && (
                    <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="mt-5">
                    <label className="block text-sm text-gray-700 mb-1">
                        Full Name
                    </label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Your name"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="you@gmail.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                Phone
                            </label>

                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="10 digit number"
                            />
                        </div>
                    </div>

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="At least 6 characters"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Register As
                    </label>

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        <option value="customer">Customer</option>
                        <option value="restaurantOwner">
                            Restaurant Owner
                        </option>
                        <option value="deliveryPartner">
                            Delivery Partner
                        </option>
                    </select>

                    {form.role === "customer" && (
                        <>
                            <label className="block text-sm text-gray-700 mt-4 mb-1">
                                Delivery Address
                            </label>

                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows="2"
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="House no, street, city"
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-orange-500 text-white px-3 py-2 rounded w-full mt-5"
                    >
                        {saving ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-5">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-orange-600 font-semibold"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;