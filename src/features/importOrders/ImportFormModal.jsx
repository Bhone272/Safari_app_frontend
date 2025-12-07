// src/features/importOrders/ImportFormModal.jsx
import { useEffect, useState } from "react";
import Modal from "../../shared/components/ui/Modal.jsx";
import Input from "../../shared/components/ui/Input.jsx";
import Textarea from "../../shared/components/ui/Textarea.jsx";
import Button from "../../shared/components/ui/Button.jsx";
import IconButton from "../../shared/components/ui/IconButton.jsx";

const baseEmpty = {
  date: "",
  senderName: "",
  note: "",
  paymentType: "cash", // cash | credit
};

const getToday = () => new Date().toISOString().slice(0, 10);

const normalizeNumber = (value) => {
  const trimmed = (value ?? "").toString().trim();
  return trimmed === "" ? "0" : trimmed;
};

export default function ImportFormModal({ open, onClose, initial, onSubmit }) {
  const [base, setBase] = useState({ ...baseEmpty, date: getToday() });

  // rows already added to the table
  const [products, setProducts] = useState([]);

  // inputs on the "Product :" row
  const [productInput, setProductInput] = useState("");
  const [productQtyInput, setProductQtyInput] = useState("");
  const [orderCountInput, setOrderCountInput] = useState("");

  // hydrate when editing / reset when opening
  useEffect(() => {
    if (!open) return;

    if (initial) {
      // split comma-separated fields from the table
      const pNames = (initial.product || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const pQtys = (initial.productQty || "").split(",").map((s) => s.trim());

      const pOrderCounts = (initial.orderCount || "")
        .split(",")
        .map((s) => s.trim());

      const prodRows =
        pNames.length > 0
          ? pNames.map((name, i) => ({
              name,
              qty: pQtys[i] || "",
              orderCount: pOrderCounts[i] || "",
            }))
          : [];

      setBase({
        date: initial.date || getToday(),
        senderName: initial.senderName || "",
        note: initial.note || "",
        paymentType: initial.paymentType || "cash",
      });
      setProducts(prodRows);
      setProductInput("");
      setProductQtyInput("");
      setOrderCountInput("");
    } else {
      handleClearAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  const handleBaseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBase((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ----- product handlers -----

  const addProduct = () => {
    if (!productInput.trim()) return;
    setProducts((prev) => [
      ...prev,
      {
        name: productInput.trim(),
        qty: normalizeNumber(productQtyInput),
        orderCount: normalizeNumber(orderCountInput),
      },
    ]);
    setProductInput("");
    setProductQtyInput("");
    setOrderCountInput("");
  };

  const removeProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setBase({ ...baseEmpty, date: getToday() });
    setProducts([]);
    setProductInput("");
    setProductQtyInput("");
    setOrderCountInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // include anything still typed in the bottom row
    const allProducts = [...products];
    if (productInput.trim()) {
      allProducts.push({
        name: productInput.trim(),
        qty: normalizeNumber(productQtyInput),
        orderCount: normalizeNumber(orderCountInput),
      });
    }

    const productNames = allProducts.map((p) => p.name).join(", ");
    const productQtys = allProducts
      .map((p) => normalizeNumber(p.qty))
      .join(", ");
    const orderCounts = allProducts
      .map((p) => normalizeNumber(p.orderCount || "0"))
      .join(", ");

    // Items array for backend ImportReqModel.Items
    const items = allProducts.map((p) => ({
      Product_Name: p.name,
      Product_Count: parseInt(normalizeNumber(p.qty), 10),
      Order_count: parseInt(normalizeNumber(p.orderCount), 10),
    }));

    onSubmit({
      ...base,
      product: productNames,
      productQty: productQtys,
      orderCount: orderCounts,
      items, // <-- used by importApi.js
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit Import Order" : "New Import Order"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Top info block */}
        <div className="space-y-3">
          <div className="flex gap-6">
            <label className="flex flex-1 items-center gap-2">
              <span className="whitespace-nowrap">Sender Name:</span>
              <Input
                name="senderName"
                value={base.senderName}
                onChange={handleBaseChange}
                placeholder="‌‌ပေးသူအမည်"
                className="h-8"
              />
            </label>

            <label className="flex flex-1 items-center gap-2 justify-end">
              <span className="whitespace-nowrap">Date:</span>
              {/* Auto date, read-only */}
              <Input
                type="text"
                name="date"
                value={base.date}
                readOnly
                className="w-[140px] h-8 bg-gray-100 cursor-not-allowed"
              />
            </label>
          </div>
        </div>

        {/* PRODUCT TABLE (view) */}
        <div className="border border-gray-400">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-r border-gray-400 py-1 text-center font-semibold">
                  Product
                </th>
                <th className="border-b border-r border-gray-400 py-1 text-center font-semibold">
                  Quantity
                </th>
                <th className="border-b border-r border-gray-400 py-1 text-center font-semibold">
                  Order_Count
                </th>
                <th className="border-b border-gray-400 py-1 text-center font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                // one empty row
                <tr>
                  <td className="border-r border-gray-300 h-8">&nbsp;</td>
                  <td className="border-r border-gray-300 h-8">&nbsp;</td>
                  <td className="border-r border-gray-300 h-8">&nbsp;</td>
                  <td className="h-8 text-center align-middle">-</td>
                </tr>
              ) : (
                products.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border-t border-r border-gray-300 px-2 py-1">
                      {row.name}
                    </td>
                    <td className="border-t border-r border-gray-300 px-2 py-1 text-center">
                      {row.qty}
                    </td>
                    <td className="border-t border-r border-gray-300 px-2 py-1 text-center">
                      {row.orderCount}
                    </td>
                    <td className="border-t border-gray-300 px-2 py-1 text-center">
                      <IconButton
                        type="button"
                        onClick={() => removeProduct(idx)}
                        className="h-6 w-6 rounded-md text-xs"
                      >
                        -
                      </IconButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PRODUCT INPUT ROW */}
        <div className="mt-3 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Product :</span>
            <Input
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
              className="h-8 w-[230px]"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Quantity :</span>
            <Input
              type="number"
              value={productQtyInput}
              onChange={(e) => setProductQtyInput(e.target.value)}
              className="h-8 w-[120px]"
            />
          </label>

          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Order_Count :</span>
            <Input
              type="number"
              value={orderCountInput}
              onChange={(e) => setOrderCountInput(e.target.value)}
              className="h-8 w-[120px]"
            />
          </label>

          <IconButton
            type="button"
            onClick={addProduct}
            className="h-8 w-8 rounded-full"
          >
            +
          </IconButton>
        </div>

        {/* NOTE */}
        <div className="space-y-1">
          <div>Note :</div>
          <Textarea
            name="note"
            rows={4}
            value={base.note}
            onChange={handleBaseChange}
            className="bg-white"
          />
        </div>

        {/* CASH / CREDIT + COMPLETE */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex justify-center gap-10">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="paymentType"
                value="cash"
                checked={base.paymentType === "cash"}
                onChange={handleBaseChange}
                className="size-4"
              />
              <span>Full-paid</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="paymentType"
                value="credit"
                checked={base.paymentType === "credit"}
                onChange={handleBaseChange}
                className="size-4"
              />
              <span>Credit</span>
            </label>
          </div>
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={handleClearAll}
            className="rounded-full px-8 border-red-300 text-red-500 hover:bg-red-50"
          >
            Clear
          </Button>
          <Button
            type="submit"
            className="rounded-full border-emerald-300 bg-[#d9efe7] px-8 text-emerald-700 hover:bg-[#29c388]"
          >
            {initial ? "Update on table" : "Add on table"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
