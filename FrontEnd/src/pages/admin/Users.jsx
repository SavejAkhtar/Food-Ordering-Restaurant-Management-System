import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { formatDate, getErrorMessage, roleLabels } from "../../utils/helpers";

const roleTabs = [
    { value: "", label: "All Users" },
    { value: "customer", label: "Customers" },
    { value: "restaurantOwner", label: "Restaurant Owners" },
    { value: "deliveryPartner", label: "Delivery Partners" }
];

const Users = () => {
    let [users, setUsers] = useState([]);
    let [role, setRole] = useState("");
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");

    let loadUsers = () => {
        api.get("/admin/users", { params: { role: role } })
            .then((res) => setUsers(res.data.data))
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        loadUsers();
    }, [role]);

    let toggleStatus = (user) => {
        setError("");

        api.put(`/admin/users/${user._id}/status`, {
            isActive: !user.isActive
        })
            .then(() => loadUsers())
            .catch((err) => setError(getErrorMessage(err)));
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800">
                Users
            </h1>

            <div className="flex flex-wrap gap-2 mt-4">
                {roleTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setRole(tab.value)}
                        className={
                            role === tab.value
                                ? "bg-orange-500 text-white px-3 py-1 rounded text-sm"
                                : "border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                        }
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <Loader />
            ) : users.length === 0 ? (
                <div className="mt-5">
                    <EmptyState
                        icon="👥"
                        title="No users found"
                        message="There are no users in this category."
                    />
                </div>
            ) : (
                <div className="border border-gray-300 rounded mt-5 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-300">
                            <tr>
                                <th className="text-left p-3">Name</th>
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">Phone</th>
                                <th className="text-left p-3">Role</th>
                                <th className="text-left p-3">Joined</th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-left p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-b border-gray-200"
                                >
                                    <td className="p-3 font-medium text-gray-800">
                                        {user.name}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {user.email}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {user.phone || "-"}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {roleLabels[user.role]}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {formatDate(user.createdAt)}
                                    </td>

                                    <td className="p-3">
                                        {user.isActive ? (
                                            <span className="text-green-600 text-sm">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-red-600 text-sm">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3">
                                        {user.role === "admin" ? (
                                            <span className="text-xs text-gray-400">
                                                Protected
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => toggleStatus(user)}
                                                className={
                                                    user.isActive
                                                        ? "border border-red-500 text-red-600 px-3 py-1 rounded text-sm"
                                                        : "border border-green-500 text-green-600 px-3 py-1 rounded text-sm"
                                                }
                                            >
                                                {user.isActive
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;