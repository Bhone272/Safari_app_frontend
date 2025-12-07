// src/features/importOrders/ImportTable.jsx
import { useState, useEffect } from "react";
import { useOrdersStore } from "../../store/ordersStore.js";
import Button from "../../shared/components/ui/Button.jsx";
import IconButton from "../../shared/components/ui/IconButton.jsx";
import ImportFormModal from "./ImportFormModal.jsx";
import { downloadCsv } from "../../utils/handleCSV.jsx";
import {
  fetchImportOrdersByDate,
  saveImportOrderToDb,
  updateImportOrderInDb,
  deleteImportOrderInDb,
} from "./importApi.js";

const renderLines = (value, isNumber = false) => {
  const raw = (value ?? "").toString();
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (parts.length === 0) {
    // default 0 for numeric fields
    return isNumber ? <div>0</div> : null;
  }

  return parts.map((part, idx) => <div key={idx}>{part}</div>);
};

export default function ImportTable() {
  const {
    importOrders,
    setImportOrders,
    addImportOrder,
    updateImportOrder,
    deleteImportOrder,
  } = useOrdersStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  // loading state for fetch
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const selectedDate =
    filterDate || new Date().toISOString().slice(0, 10); // default: today

  const reloadFromServer = async (date) => {
    setLoading(true);
    setLoadError("");

    try {
      const rows = await fetchImportOrdersByDate(date);
      setImportOrders(rows);
    } catch (err) {
      console.error("Failed to fetch import orders:", err);
      setLoadError(
        err?.response?.data ??
          err?.message ??
          "Failed to load import orders from server."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load imports from backend whenever the selected date changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const rows = await fetchImportOrdersByDate(selectedDate);
        if (!cancelled) {
          setImportOrders(rows);
        }
      } catch (err) {
        console.error("Failed to fetch import orders:", err);
        if (!cancelled) {
          setLoadError(
            err?.response?.data ??
              err?.message ??
              "Failed to load import orders from server."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, setImportOrders]);

  const openNew = () => {
    setEditingRow(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    const isEdit = Boolean(editingRow);

    try {
      if (isEdit) {
        // If this row came from the BACKEND, it will have importCode + date
        if (editingRow.importCode && editingRow.date) {
          // Update in DB
          await updateImportOrderInDb(
            editingRow.importCode,
            editingRow.date,
            data
          );

          // Update local UI, keeping importCode/date
          updateImportOrder(editingRow.id, {
            ...data,
            importCode: editingRow.importCode,
            date: editingRow.date,
          });
        } else {
          // Local-only row (no importCode yet) – just update UI
          updateImportOrder(editingRow.id, data);
        }
      } else {
        // NEW row → create in DB
        await saveImportOrderToDb(data);

        // Add to local list (no importCode until you re-fetch)
        addImportOrder({
          ...data,
          date: data.date || selectedDate,
        });
      }
    } catch (err) {
      console.error("Failed to save import order:", err);
      const message =
        err?.response?.data ??
        err?.message ??
        "Could not save import order.";
      alert(message);
      return;
    } finally {
      setModalOpen(false);
      setEditingRow(null);
    }

    // Re-sync with backend for the current date
    await reloadFromServer(selectedDate);
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Delete this import order?")) return;

    try {
      if (row.importCode && row.date) {
        await deleteImportOrderInDb(row.importCode, row.date);
      }

      // Remove from local store
      deleteImportOrder(row.id);

      // Re-sync with backend
      await reloadFromServer(selectedDate);
    } catch (err) {
      console.error("Failed to delete import order:", err);
      const message =
        err?.response?.data ??
        err?.message ??
        "Could not delete import order.";
      alert(message);
    }
  };

  const handleExportImportCsv = () => {
    if (!importOrders || importOrders.length === 0) return;

    downloadCsv(importOrders, "import_orders", [
      { header: "No", accessor: (_row, index) => index + 1 },
      { header: "Date", accessor: (row) => row.date },
      { header: "Sender", accessor: (row) => row.senderName },
      { header: "Product_List", accessor: (row) => row.product },
      { header: "Quantity", accessor: (row) => row.productQty || "0" },
      { header: "Order Count", accessor: (row) => row.orderCount || "0" },
      { header: "Note", accessor: (row) => row.note },
      {
        header: "Payment",
        accessor: (row) =>
          row.paymentType === "cash" ? "Full-paid" : "Credit",
      },
    ]);
  };

  const visibleOrders = filterDate
    ? importOrders.filter((o) => o.date === filterDate)
    : importOrders;

  return (
    <>
      {/* Top controls */}
      <div className="mb-4 flex items-center justify-between">
        {/* LEFT: Filter */}
        <div className="relative">
          <Button type="button" onClick={() => setFilterOpen((prev) => !prev)}>
            Filter
          </Button>
          {filterOpen && (
            <div className="absolute left-0 z-20 mt-2 w-64 rounded-md border border-gray-300 bg-white p-3 text-xs shadow">
              <label className="flex items-center gap-2">
                <span>Date :</span>
                <input
                  type="date"
                  className="h-8 flex-1 rounded border border-gray-300 px-2"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </label>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded border border-gray-300 px-3 py-1"
                  onClick={() => {
                    setFilterDate("");
                    setFilterOpen(false);
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="rounded bg-emerald-500 px-3 py-1 text-white"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Add / CSV */}
        <div className="flex gap-2">
          <Button onClick={openNew}>+ Add</Button>
          <Button type="button" onClick={handleExportImportCsv}>
            CSV file report
          </Button>
        </div>
      </div>

      {/* Optional: loading / error messages */}
      {loadError && (
        <div className="mb-2 text-xs text-red-600">{loadError}</div>
      )}
      {loading && (
        <div className="mb-2 text-xs text-gray-500">
          Loading imports...
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 bg-white">
        <table className="min-w-full text-xs">
          <thead className="bg-emerald-50">
            <tr className="border-b border-gray-300">
              <th className="px-2 py-2 text-left">No</th>
              <th className="px-2 py-2 text-left">Date</th>
              <th className="px-2 py-2 text-left">Sender</th>
              <th className="px-2 py-2 text-left">Product_List</th>
              <th className="px-2 py-2 text-left">Quantity</th>
              <th className="px-2 py-2 text-left">Order Count</th>
              <th className="px-2 py-2 text-left">Note</th>
              <th className="px-2 py-2 text-left">Payment</th>
              <th className="px-2 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-2 py-4 text-center text-gray-400"
                >
                  {filterDate
                    ? "No import orders for this date."
                    : 'No import orders yet. Click "Add" to create one.'}
                </td>
              </tr>
            ) : (
              visibleOrders.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-2 py-1 align-top">{index + 1}</td>
                  <td className="px-2 py-1 align-top">{row.date}</td>
                  <td className="px-2 py-1 align-top">{row.senderName}</td>

                  <td className="px-2 py-1 align-top">
                    {renderLines(row.product, false)}
                  </td>
                  <td className="px-2 py-1 align-top">
                    {renderLines(row.productQty, true)}
                  </td>
                  <td className="px-2 py-1 align-top">
                    {renderLines(row.orderCount, true)}
                  </td>

                  <td className="max-w-[140px] truncate px-2 py-1 align-top">
                    {row.note}
                  </td>
                  <td className="px-2 py-1 align-top">
                    {row.paymentType === "cash" ? "Full-paid" : "Credit"}
                  </td>
                  <td className="px-2 py-1 align-top">
                    <div className="flex gap-1">
                      <IconButton onClick={() => openEdit(row)}>✎</IconButton>
                      <IconButton onClick={() => handleDelete(row)}>
                        🗑
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ImportFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editingRow}
        onSubmit={handleSubmit}
      />
    </>
  );
}
