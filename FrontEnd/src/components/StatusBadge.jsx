import { statusColors, statusLabels } from "../utils/helpers";

const StatusBadge = ({ status }) => {
    let colorClass = statusColors[status] || "bg-gray-100 text-gray-700";

    return (
        <span
            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${colorClass}`}
        >
            {statusLabels[status] || status}
        </span>
    );
};

export default StatusBadge;