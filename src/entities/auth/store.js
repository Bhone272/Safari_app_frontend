import { create } from "zustand";
import { getToken, setToken, clearToken } from "../../shared/lib/storage.js";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  hydrateFromStorage: () => {
    const token = getToken();
    if (token) set({ token });
  },
  setAuth: ({ user, token }) => {
    if (token) setToken(token);
    set({ user, token });
  },
  logout: () => {
    clearToken();
    set({ user: null, token: null });
  },
}));
