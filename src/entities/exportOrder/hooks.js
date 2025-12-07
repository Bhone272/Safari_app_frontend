// src/entities/exportOrder/hooks.js
import { useQuery } from "@tanstack/react-query";
import { fetchOrdersByDate } from "./api.js";
import { queryKeys } from "../../shared/lib/queryKeys.js";

export function useExportOrdersByDate(date) {
  return useQuery({
    queryKey: [...queryKeys.exportOrders, date],
    queryFn: () => fetchOrdersByDate(date),
    enabled: Boolean(date),
  });
}
