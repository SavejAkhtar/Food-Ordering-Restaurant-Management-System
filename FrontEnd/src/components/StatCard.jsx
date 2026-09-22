const StatCard = ({ label, value, icon }) => {
    return (
        <div className="border border-gray-300 rounded p-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{label}</p>

                {icon && <span className="text-xl">{icon}</span>}
            </div>

            <p className="text-2xl font-bold text-gray-800 mt-2">
                {value}
            </p>
        </div>
    );
};

export default StatCard;