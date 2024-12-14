import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
};

const AuthRoute = ({ isProtected, children }) => {
    const authenticated = isAuthenticated();

    if (isProtected && !authenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isProtected && authenticated) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default AuthRoute;
