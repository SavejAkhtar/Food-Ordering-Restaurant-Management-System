const StarRating = ({ value = 0, onChange, size = "text-xl" }) => {
    let stars = [1, 2, 3, 4, 5];

    return (
        <div className={`flex gap-1 ${size}`}>
            {stars.map((star) => (
                <span
                    key={star}
                    onClick={() => onChange && onChange(star)}
                    className={
                        star <= value
                            ? "text-amber-500"
                            : "text-gray-300"
                    }
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;