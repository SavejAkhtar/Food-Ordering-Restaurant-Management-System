const EmptyState = ({ icon = "📭", title, message, children }) => {
    return (
        <div className="bg-white border border-dashed border-gray-300 rounded p-8 text-center">
            <div className="text-3xl">{icon}</div>

            <h3 className="mt-3 font-semibold text-gray-800">
                {title}
            </h3>

            {message && (
                <p className="mt-1 text-sm text-gray-500">
                    {message}
                </p>
            )}

            {children && (
                <div className="mt-4 flex justify-center">
                    {children}
                </div>
            )}
        </div>
    );
};

export default EmptyState;