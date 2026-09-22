import StatusBadge from "./StatusBadge";
import { formatDate, formatPrice } from "../utils/helpers";

const DeliveryOrderCard = ({ order, children }) => {
    return (
        <div className="border border-gray-300 rounded p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-gray-800">
                        #{order._id.slice(-6).toUpperCase()}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                        {formatDate(order.createdAt)}
                    </p>
                </div>

                <div className="text-right">
                    <StatusBadge status={order.orderStatus} />

                    <p className="font-semibold mt-2">
                        {formatPrice(order.totalAmount)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="border border-gray-200 rounded p-3">
                    <p className="text-xs font-semibold text-gray-500">
                        PICKUP FROM
                    </p>

                    <p className="text-sm font-medium text-gray-800 mt-1">
                        {order.restaurant.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        {order.restaurant.address}
                    </p>
                </div>

                <div className="border border-gray-200 rounded p-3">
                    <p className="text-xs font-semibold text-gray-500">
                        DELIVER TO
                    </p>

                    <p className="text-sm font-medium text-gray-800 mt-1">
                        {order.customer.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        {order.deliveryAddress}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        Phone: {order.contactNumber || order.customer.phone}
                    </p>
                </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
                {order.items
                    .map((item) => `${item.name} × ${item.quantity}`)
                    .join(", ")}
            </p>

            <p className="text-sm text-gray-500 mt-2">
                {order.paymentMethod === "CashOnDelivery"
                    ? `Collect ${formatPrice(order.totalAmount)} in cash`
                    : "Already paid online"}
            </p>

            {children && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export default DeliveryOrderCard;