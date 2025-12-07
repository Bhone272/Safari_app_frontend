// src/store/ordersStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

let nextId = 1;

// Helper: add a local "id" for rendering, but keep backend fields untouched
const withClientIds = (rows) =>
  (rows || []).map((row) => ({
    id: row.id ?? nextId++,
    ...row,
  }));

export const useOrdersStore = create(
  persist(
    (set) => ({
      importOrders: [],
      exportOrders: [],

      // IMPORT
      setImportOrders: (rows) =>
        set(() => ({
          importOrders: withClientIds(rows),
        })),

      addImportOrder: (order) =>
        set((state) => ({
          importOrders: [
            ...state.importOrders,
            { id: nextId++, ...order },
          ],
        })),

      updateImportOrder: (id, patch) =>
        set((state) => ({
          importOrders: state.importOrders.map((row) =>
            row.id === id ? { ...row, ...patch } : row
          ),
        })),

      deleteImportOrder: (id) =>
        set((state) => ({
          importOrders: state.importOrders.filter(
            (row) => row.id !== id
          ),
        })),

      // EXPORT
      setExportOrders: (rows) =>
        set(() => ({
          exportOrders: withClientIds(rows),
        })),

      addExportOrder: (order) =>
        set((state) => ({
          exportOrders: [
            ...state.exportOrders,
            { id: nextId++, ...order },
          ],
        })),

      updateExportOrder: (id, patch) =>
        set((state) => ({
          exportOrders: state.exportOrders.map((row) =>
            row.id === id ? { ...row, ...patch } : row
          ),
        })),

      deleteExportOrder: (id) =>
        set((state) => ({
          exportOrders: state.exportOrders.filter(
            (row) => row.id !== id
          ),
        })),

      clearAll: () => set({ importOrders: [], exportOrders: [] }),
    }),
    {
      name: "safari-orders", // localStorage key
    }
  )
);
