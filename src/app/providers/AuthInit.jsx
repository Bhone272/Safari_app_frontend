import { useEffect } from "react";
import { useAuthStore } from "../../entities/auth/store.js";

export function AuthInit({ children }) {
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return children;
}
