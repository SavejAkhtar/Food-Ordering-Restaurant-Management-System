import { statusLabels, trackingSteps } from "../utils/helpers";

const OrderStatusTracker = ({ status }) => {
    if (status === "Cancelled") {
        return (
            <div className="border border-red-300 bg-red-50 text-red-600 p-3 rounded">
                This order was cancelled.
            </div>
        );
    }

    let currentIndex = trackingSteps.indexOf(status);

    return (
        <div className="flex flex-wrap gap-y-4">
            {trackingSteps.map((step, index) => {
                let isDone = index <= currentIndex;

                return (
                    <div
                        key={step}
                        className="flex-1 flex flex-col items-center text-center"
                    >
                        <div className="flex items-center w-full">
                            <div
                                className={`h-1 flex-1 ${
                                    index === 0
                                        ? "bg-transparent"
                                        : isDone
                                        ? "bg-orange-500"
                                        : "bg-gray-200"
                                }`}
                            ></div>

                            <div
                                className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${
                                    isDone
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                {index + 1}
                            </div>

                            <div
                                className={`h-1 flex-1 ${
                                    index === trackingSteps.length - 1
                                        ? "bg-transparent"
                                        : index < currentIndex
                                        ? "bg-orange-500"
                                        : "bg-gray-200"
                                }`}
                            ></div>
                        </div>

                        <p
                            className={`mt-2 text-xs ${
                                isDone
                                    ? "text-gray-800 font-semibold"
                                    : "text-gray-400"
                            }`}
                        >
                            {statusLabels[step]}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderStatusTracker;