export const DELIVERY_FEE = 30;

export const trackingSteps = ["Placed", "Accepted", "Preparing", "ReadyForPickup", "OutForDelivery", "Delivered"];

export const statusLabels = {
    Placed: "Placed",
    Accepted: "Accepted",
    Preparing: "Preparing",
    ReadyForPickup: "Ready For Pickup",
    OutForDelivery: "Out For Delivery",
    Delivered: "Delivered",
    Cancelled: "Cancelled"
};

export const statusColors = {
    Placed: "bg-blue-100 text-blue-700",
    Accepted: "bg-indigo-100 text-indigo-700",
    Preparing: "bg-amber-100 text-amber-700",
    ReadyForPickup: "bg-purple-100 text-purple-700",
    OutForDelivery: "bg-orange-100 text-orange-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700"
};

export const roleLabels = {
    customer: "Customer",
    restaurantOwner: "Restaurant Owner",
    deliveryPartner: "Delivery Partner",
    admin: "Admin"
};

export const getErrorMessage = (err) => {
    if (err.response && err.response.data && err.response.data.message) {
        return err.response.data.message;
    }

    return "Something went wrong. Please try again.";
};

export const formatPrice = (amount) => {
    return "₹" + Number(amount || 0).toFixed(0);
};

export const formatDate = (value) => {
    return new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const homePathForRole = (role) => {
    if (role === "restaurantOwner") return "/restaurant/dashboard";
    if (role === "deliveryPartner") return "/delivery/dashboard";
    if (role === "admin") return "/admin/dashboard";
    return "/restaurants";
};
