import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, homePathForRole } from "../utils/helpers";

const Login = () => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [error, setError] = useState("");
    let [saving, setSaving] = useState(false);

    let { login } = useAuth();
    let navigate = useNavigate();

    let handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        api.post("/auth/login", { email: email, password: password })
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
        <div className="max-w-md mx-auto px-4 py-12">
            <div className="border border-gray-300 rounded p-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Login
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Welcome back to FoodHub
                </p>

                {error && (
                    <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-5 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="mt-6">
                    <label className="block text-sm text-gray-700 mb-1">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="block w-full border border-gray-300 rounded p-2"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="block w-full border border-gray-300 rounded p-2"
                    />

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-orange-500 text-white w-full px-3 py-2 rounded mt-6"
                    >
                        {saving ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-5">
                    New here?{" "}
                    <Link
                        to="/register"
                        className="text-orange-600 font-semibold"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;