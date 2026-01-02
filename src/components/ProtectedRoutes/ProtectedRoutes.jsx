import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoutes;
