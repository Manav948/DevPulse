import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hasToken = !!localStorage.getItem("token");

  if (!isAuthenticated && !hasToken) {
    // Redirect to sign-in, preserving the page they tried to visit
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
