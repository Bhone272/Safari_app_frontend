// src/entities/importOrder/model.js

// Shape used by the Import table/UI
export const emptyImportOrder = {
  date: "",
  senderName: "",
  product: "",
  productQty: "",
  orderCount: "",
  note: "",
  paymentType: "cash", // "cash" -> Full-paid, "credit" -> Credit
};

const getField = (obj, ...names) => {
  if (!obj) return undefined;
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(obj, name)) {
      const value = obj[name];
      if (value !== undefined && value !== null) return value;
    }
  }
  return undefined;
};

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `import-${Math.random().toString(36).slice(2)}`;
}

// Map backend ImportResModel -> frontend row used by ImportTable
export function mapImportResToRow(res) {
  // Date
  const created = getField(
    res,
    "create_DateTime",
    "Create_DateTime",
    "created_DateTime",
    "Created_DateTime"
  );
  const rawDate = created ? String(created) : "";
  const date = rawDate ? rawDate.slice(0, 10) : "";

  // Items from backend
  const items = getField(res, "items", "Items") || [];

  const productNames = items.map(
    (it) =>
      getField(
        it,
        "product_Name",
        "Product_Name",
        "productName",
        "ProductName"
      ) || ""
  );

  const productCounts = items.map(
    (it) =>
      getField(
        it,
        "product_Count",
        "Product_Count",
        "productCount",
        "ProductCount"
      ) ?? ""
  );

  const orderCounts = items.map(
    (it) =>
      getField(
        it,
        "order_count",
        "Order_count",
        "orderCount",
        "OrderCount"
      ) ?? ""
  );

  const senderName = getField(res, "sender", "Sender") || "";
  const note = getField(res, "comment", "Comment") || "";

  const id =
    getField(res, "import_Id", "Import_Id", "importId", "ImportId") ||
    getField(res, "import_Code", "Import_Code", "importCode", "ImportCode") ||
    cryptoRandomId();

  return {
    id,
    date,
    senderName,
    product: productNames.filter(Boolean).join(", "),
    productQty: productCounts
      .filter((x) => x !== "" && x !== null && x !== undefined)
      .join(", "),
    orderCount: orderCounts
      .filter((x) => x !== "" && x !== null && x !== undefined)
      .join(", "),
    note,
    paymentType: "cash",
  };
}
