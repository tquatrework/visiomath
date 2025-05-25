import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../providers/UserContext";

const ProtectedRoute = () => {
    const { connectedUserId: userId, connexionLoading } = useUser();

    if (connexionLoading) return <p>Chargement...</p>;
    //if (!userId) return <p>Utilisateur non authentifié</p>;
    if (!userId) return <Navigate to="/connect" replace />;

    return <Outlet />; // Rend la route protégée si l'utilisateur est connecté
};

export default ProtectedRoute;
