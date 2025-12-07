// src/entities/exportOrder/model.js
export const emptyExportOrder = {
  date: "",
  receiverName: "",
  phoneNumber: "",
  cityName: "",
  gateName: "",
  product: "",
  productQty: "",
  packageType: "",
  packageQty: "",
  note: "",
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
  return `order-${Math.random().toString(36).slice(2)}`;
}

// Map backend OrderResModel -> frontend row
export function mapOrderResToRow(res) {
  const created = getField(
    res,
    "created_DateTime",
    "Created_DateTime",
    "create_DateTime",
    "Create_DateTime"
  );
  const rawDate = created ? String(created) : "";
  const date = rawDate ? rawDate.slice(0, 10) : "";

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

  const receiverName =
    getField(
      res,
      "cusName",
      "CusName",
      "cus_Name",
      "Cus_Name",
      "receiverName",
      "ReceiverName"
    ) || "";

  const phoneNumber =
    getField(res, "cusPh", "CusPh", "phoneNumber", "PhoneNumber") || "";

  const cityName = getField(res, "city", "City", "cityName", "CityName") || "";

  const gateName = getField(res, "gate", "Gate", "gateName", "GateName") || "";

  const packageQty =
    getField(
      res,
      "package_Count",
      "Package_Count",
      "packageQty",
      "PackageQty"
    ) || "";

  const note = getField(res, "comment", "Comment", "note", "Note") || "";

  const id =
    getField(res, "order_Id", "Order_Id", "orderId", "OrderId") ||
    getField(res, "order_Code", "Order_Code", "orderCode", "OrderCode") ||
    cryptoRandomId();

  return {
    id,
    date,
    receiverName,
    phoneNumber,
    cityName,
    gateName,
    product: productNames.filter(Boolean).join(", "),
    productQty: productCounts
      .filter((x) => x !== "" && x !== null && x !== undefined)
      .join(", "),
    packageType: "",
    packageQty,
    note,
  };
}
