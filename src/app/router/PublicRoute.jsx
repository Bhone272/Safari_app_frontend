import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../entities/auth/store.js";

export function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => !!s.token);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
