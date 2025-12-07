// src/features/exportOrders/ExportFormModal.jsx (path may differ in your app)
import { useEffect, useState } from "react";
import Modal from "../../shared/components/ui/Modal.jsx";
import Input from "../../shared/components/ui/Input.jsx";
import Textarea from "../../shared/components/ui/Textarea.jsx";
import Button from "../../shared/components/ui/Button.jsx";
import IconButton from "../../shared/components/ui/IconButton.jsx";

const baseEmpty = {
  date: "",
  receiverName: "",
  phoneNumber: "",
  cityName: "",
  gateName: "",
  note: "",
  paymentType: "cash", // cash | credit
};

const getToday = () => new Date().toISOString().slice(0, 10);

const normalizeNumber = (value) => {
  const trimmed = (value ?? "").toString().trim();
  return trimmed === "" ? "0" : trimmed;
};

export default function ExportFormModal({ open, onClose, initial, onSubmit }) {
  const [base, setBase] = useState({ ...baseEmpty, date: getToday() });

  // rows already added to the tables
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);

  // inputs on the "Product :" row
  const [productInput, setProductInput] = useState("");
  const [productQtyInput, setProductQtyInput] = useState("");

  // inputs on the "Package type :" row
  const [packageInput, setPackageInput] = useState("");
  const [packageQtyInput, setPackageQtyInput] = useState("");

  // hydrate when editing / reset when opening
  useEffect(() => {
    if (!open) return;

    if (initial) {
      // product rows
      const pNames = (initial.product || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const pQtys = (initial.productQty || "").split(",").map((s) => s.trim());

      const prodRows =
        pNames.length > 0
          ? pNames.map((name, i) => ({
              name,
              qty: pQtys[i] || "",
            }))
          : [];

      // package rows
      const pkTypes = (initial.packageType || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const pkQtys = (initial.packageQty || "").split(",").map((s) => s.trim());

      const pkgRows =
        pkTypes.length > 0
          ? pkTypes.map((type, i) => ({
              type,
              qty: pkQtys[i] || "",
            }))
          : [];

      setBase({
        date: initial.date || getToday(),
        receiverName: initial.receiverName || "",
        phoneNumber: initial.phoneNumber || "",
        cityName: initial.cityName || "",
        gateName: initial.gateName || "",
        note: initial.note || "",
        paymentType: initial.paymentType || "cash",
      });
      setProducts(prodRows);
      setPackages(pkgRows);
      setProductInput("");
      setProductQtyInput("");
      setPackageInput("");
      setPackageQtyInput("");
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

  // ----- product & package handlers -----

  const addProduct = () => {
    if (!productInput.trim()) return;
    setProducts((prev) => [
      ...prev,
      {
        name: productInput.trim(),
        qty: normalizeNumber(productQtyInput),
      },
    ]);
    setProductInput("");
    setProductQtyInput("");
  };

  const removeProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const addPackage = () => {
    if (!packageInput.trim()) return;
    setPackages((prev) => [
      ...prev,
      {
        type: packageInput.trim(),
        qty: normalizeNumber(packageQtyInput),
      },
    ]);
    setPackageInput("");
    setPackageQtyInput("");
  };

  const removePackage = (index) => {
    setPackages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setBase({ ...baseEmpty, date: getToday() });
    setProducts([]);
    setPackages([]);
    setProductInput("");
    setProductQtyInput("");
    setPackageInput("");
    setPackageQtyInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // include anything still typed in the bottom rows
    const allProducts = [...products];
    if (productInput.trim()) {
      allProducts.push({
        name: productInput.trim(),
        qty: normalizeNumber(productQtyInput),
      });
    }

    const allPackages = [...packages];
    if (packageInput.trim()) {
      allPackages.push({
        type: packageInput.trim(),
        qty: normalizeNumber(packageQtyInput),
      });
    }

    // Strings for table + CSV
    const productNames = allProducts.map((p) => p.name).join(", ");
    const productQtys = allProducts
      .map((p) => normalizeNumber(p.qty))
      .join(", ");
    const packageTypes = allPackages.map((p) => p.type).join(", ");
    const packageQtys = allPackages
      .map((p) => normalizeNumber(p.qty))
      .join(", ");

    // Items array for backend OrderReqModel.Items
    const items = allProducts.map((p) => ({
      Product_Name: p.name,
      Product_Count: parseInt(normalizeNumber(p.qty), 10),
    }));

    onSubmit({
      ...base,
      product: productNames,
      productQty: productQtys,
      packageType: packageTypes,
      packageQty: packageQtys,
      items, // <-- used by exportApi.js
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit Export Order" : "New Export Order"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Top info block */}
        <div className="space-y-3">
          <div className="flex gap-6">
            <label className="flex flex-1 items-center gap-2">
              <span className="whitespace-nowrap">Receiver Name:</span>
              <Input
                name="receiverName"
                value={base.receiverName}
                onChange={handleBaseChange}
                placeholder="‌‌လက်ခံသူအမည်"
                className="h-8"
              />
            </label>

            <label className="flex flex-1 items-center gap-2">
              <span className="whitespace-nowrap">Ph No :</span>
              <Input
                name="phoneNumber"
                value={base.phoneNumber}
                onChange={handleBaseChange}
                className="h-8"
              />
            </label>
          </div>

          <div className="flex gap-6">
            <label className="flex flex-1 items-center gap-2">
              <span className="whitespace-nowrap">City Name :</span>
              <Input
                name="cityName"
                value={base.cityName}
                onChange={handleBaseChange}
                className="h-8"
              />
            </label>

            <label className="flex flex-1 items-center gap-2">
              <span className="whitespace-nowrap">Gate Name :</span>
              <Input
                name="gateName"
                value={base.gateName}
                onChange={handleBaseChange}
                className="h-8"
              />
            </label>
          </div>

          <div className="flex flex-col items-end">
            {/* Auto date, read-only like ImportFormModal */}
            <label className="flex items-center gap-2">
              <span>Date:</span>
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

        {/* PRODUCT TABLE */}
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
                <th className="border-b border-gray-400 py-1 text-center font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
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
          <IconButton
            type="button"
            onClick={addProduct}
            className="h-8 w-8 rounded-full"
          >
            +
          </IconButton>
        </div>

        {/* PACKAGE TABLE */}
        <div className="mt-1">
          <div className="border border-gray-400">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b border-r border-gray-400 py-1 text-center font-semibold">
                    Package Type
                  </th>
                  <th className="border-b border-r border-gray-400 py-1 text-center font-semibold">
                    Quantity
                  </th>
                  <th className="border-b border-gray-400 py-1 text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {packages.length === 0 ? (
                  <tr>
                    <td className="border-r border-gray-300 h-8">&nbsp;</td>
                    <td className="border-r border-gray-300 h-8">&nbsp;</td>
                    <td className="h-8 text-center align-middle">-</td>
                  </tr>
                ) : (
                  packages.map((row, idx) => (
                    <tr key={idx}>
                      <td className="border-t border-r border-gray-300 px-2 py-1">
                        {row.type}
                      </td>
                      <td className="border-t border-r border-gray-300 px-2 py-1 text-center">
                        {row.qty}
                      </td>
                      <td className="border-t border-gray-300 px-2 py-1 text-center">
                        <IconButton
                          type="button"
                          onClick={() => removePackage(idx)}
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

          {/* PACKAGE INPUT ROW */}
          <div className="mt-3 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">Package type :</span>
              <Input
                value={packageInput}
                onChange={(e) => setPackageInput(e.target.value)}
                className="h-8 w-[230px]"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">Quantity :</span>
              <Input
                type="number"
                value={packageQtyInput}
                onChange={(e) => setPackageQtyInput(e.target.value)}
                className="h-8 w-[120px]"
              />
            </label>
            <IconButton
              type="button"
              onClick={addPackage}
              className="h-8 w-8 rounded-full"
            >
              +
            </IconButton>
          </div>
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

        {/* CASH / CREDIT */}
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
