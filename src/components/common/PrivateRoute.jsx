import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({children, allowedRoutes}){
    const {user} = useSelector((state) => state.Profile);
    const {token} = useSelector((state) => state.Auth);

    if(!token || !user){
        return <Navigate to="/" />;
    }

    return allowedRoutes.includes(user.accountType) ? <>{children}</> : <Navigate to="/" />;
}

export default PrivateRoute