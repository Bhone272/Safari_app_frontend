import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../entities/auth/store.js";
import { clearToken } from "../../lib/storage.js";

export default function LogoutButton({
  label = "Logout",
  redirectTo = "/login",
  className = "",
  floating = false,
}) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    try {
      // 1. Clear token from localStorage
      clearToken();

      // 2. Reset Zustand auth state
      logout();

      // 3. Redirect user to login page
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Base button style
  const baseStyle =
    "rounded-full bg-red-500 px-4 py-2 text-white font-semibold shadow-md hover:bg-red-600 transition duration-200";

  // Optional floating positioning for global visibility
  const floatingStyle = floating
    ? "fixed bottom-5 right-5 z-50"
    : "";

  return (
    <button
      onClick={handleLogout}
      className={`${baseStyle} ${floatingStyle} ${className}`}
      title="Log out"
    >
      {label}
    </button>
  );
}
