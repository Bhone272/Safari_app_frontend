import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../entities/auth/store.js";

export function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => !!s.token);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
