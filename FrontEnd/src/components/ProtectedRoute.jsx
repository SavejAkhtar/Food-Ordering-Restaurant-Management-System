import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import { homePathForRole } from "../utils/helpers";

const ProtectedRoute = ({ children, roles }) => {
    let { user, loading } = useAuth();

    if (loading) {
        return <Loader text="Checking your login..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to={homePathForRole(user.role)} replace />;
    }

    return children;
};

export default ProtectedRoute;
