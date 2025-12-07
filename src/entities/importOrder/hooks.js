// src/entities/importOrder/hooks.js
import { useQuery } from "@tanstack/react-query";
import { fetchImportsByDate } from "./api.js";
import { queryKeys } from "../../shared/lib/queryKeys.js";

export function useImportOrdersByDate(date) {
  return useQuery({
    queryKey: [...queryKeys.importOrders, date],
    queryFn: () => fetchImportsByDate(date),
    enabled: Boolean(date),
  });
}
