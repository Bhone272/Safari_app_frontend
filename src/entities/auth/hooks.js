import { useAuthStore } from "./store.js";

export function useCurrentUser() {
  return useAuthStore((s) => s.user);
}
export function useIsAuthenticated() {
  return !!useAuthStore((s) => s.token);
}
