const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="text-center py-8 text-gray-500">
            <p>{text}</p>
        </div>
    );
};

export default Loader;