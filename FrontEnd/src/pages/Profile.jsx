import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, roleLabels } from "../utils/helpers";

const Profile = () => {
    let { user, setUser } = useAuth();

    let [name, setName] = useState(user.name);
    let [phone, setPhone] = useState(user.phone || "");
    let [address, setAddress] = useState(user.address || "");
    let [message, setMessage] = useState("");
    let [error, setError] = useState("");
    let [saving, setSaving] = useState(false);

    let handleSave = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (name.trim() === "") {
            setError("Name cannot be empty");
            return;
        }

        setSaving(true);

        api.put("/auth/me", { name: name, phone: phone, address: address })
            .then((res) => {
                setUser(res.data.user);
                setMessage("Profile updated successfully");
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setSaving(false));
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                My Profile
            </h1>

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

            <div className="border border-gray-300 rounded p-5 mt-5">
                <form onSubmit={handleSave}>
                    <label className="block text-sm text-gray-700 mb-1">
                        Name
                    </label>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Email
                    </label>

                    <input
                        value={user.email}
                        disabled
                        className="border border-gray-300 rounded p-2 w-full bg-gray-100"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Role
                    </label>

                    <input
                        value={roleLabels[user.role]}
                        disabled
                        className="border border-gray-300 rounded p-2 w-full bg-gray-100"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Phone
                    </label>

                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="10 digit number"
                    />

                    <label className="block text-sm text-gray-700 mt-4 mb-1">
                        Address
                    </label>

                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows="3"
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Your default delivery address"
                    />

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-orange-500 text-white px-3 py-2 rounded mt-5"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;