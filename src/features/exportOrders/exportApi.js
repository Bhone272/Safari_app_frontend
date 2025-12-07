import http from "../../shared/lib/httpClient.js";

// helper – always return a number
const toInt = (value) => {
  const n = parseInt((value ?? "0").toString().trim(), 10);
  return Number.isNaN(n) ? 0 : n;
};

function buildExportPayload(row, includeCreatedBy = true) {
  // Build Items[] from the text fields the user edits
  const names = (row.product ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const qtys = (row.productQty ?? "")
    .split(",")
    .map((s) => s.trim());

  const items = names
    .map((name, index) => ({
      Product_Name: name,
      Product_Count: toInt(qtys[index]),
    }))
    .filter((i) => (i.Product_Name ?? "").trim().length > 0);

  if (!items || items.length === 0) {
    throw new Error("At least one product is required.");
  }

  const payload = {
    CusName: row.receiverName,
    CusPh: row.phoneNumber,
    City: row.cityName,
    Gate: row.gateName,
    PackageCount: (row.packageQty ?? "").toString(),
    Comment: row.note ?? "",
    Items: items,
  };

  if (includeCreatedBy) {
    payload.CreatedBy = "WebApp";
  } else {
    payload.ModifiedBy = "WebApp";
  }

  return payload;
}

/**
 * CREATE (POST): add export order to DB.
 */
export async function saveExportOrderToDb(row) {
  const payload = buildExportPayload(row, true);
  const response = await http.post("/Order", payload);
  return response.data;
}

/**
 * GET all export orders for a date (yyyy-MM-dd).
 * Maps OrderResModel -> frontend table row.
 */
export async function fetchExportOrdersByDate(date) {
  const response = await http.get("/Order", {
    params: { currentdate: date },
  });

  const list = response.data || [];

  return list.map((apiRow) => {
    const items = apiRow.items || apiRow.Items || [];

    const product = items
      .map((i) => i.product_Name ?? i.Product_Name ?? "")
      .filter(Boolean)
      .join(", ");

    const productQty = items
      .map((i) =>
        (i.product_Count ?? i.Product_Count ?? 0).toString()
      )
      .join(", ");

    const created =
      apiRow.created_DateTime ??
      apiRow.Created_DateTime ??
      apiRow.create_DateTime ??
      apiRow.Create_DateTime ??
      "";
    const dateOnly = created ? created.slice(0, 10) : "";

    return {
      date: dateOnly,

      // ✅ handle cus_Name / cus_Ph from backend as well
      receiverName:
        apiRow.cusName ??
        apiRow.CusName ??
        apiRow.cus_Name ??
        apiRow.Cus_Name ??
        "",

      phoneNumber:
        apiRow.cusPh ??
        apiRow.CusPh ??
        apiRow.cus_Ph ??
        apiRow.Cus_Ph ??
        "",

      cityName: apiRow.city ?? apiRow.City ?? "",
      gateName: apiRow.gate ?? apiRow.Gate ?? "",

      // package type is optional – will be filled if backend has it
      packageType:
        apiRow.packageType ??
        apiRow.PackageType ??
        apiRow.package_Type ??
        apiRow.Package_Type ??
        "",

      packageQty:
        apiRow.packageCount ??
        apiRow.PackageCount ??
        apiRow.package_Count ??
        apiRow.Package_Count ??
        "0",

      note: apiRow.comment ?? apiRow.Comment ?? "",
      product,
      productQty,
      items: items.map((i) => ({
        name: i.product_Name ?? i.Product_Name ?? "",
        qty: i.product_Count ?? i.Product_Count ?? 0,
      })),
      orderCode: apiRow.order_Code ?? apiRow.Order_Code,
      createdDateTime: created,
      isComplete: apiRow.isComplete ?? apiRow.IsComplete,
      // no real payment field in DB; default to "credit" for now
      paymentType: apiRow.paymentType ?? apiRow.PaymentType ?? "credit",
    };
  });
}

/**
 * UPDATE export order.
 */
export async function updateExportOrderInDb(orderCode, date, row) {
  const payload = buildExportPayload(row, false);
  const response = await http.put(
    `/Order/${encodeURIComponent(orderCode)}`,
    payload,
    {
      params: { date },
    }
  );
  return response.data;
}

/**
 * DELETE export order.
 */
export async function deleteExportOrderInDb(orderCode, date) {
  const response = await http.delete("/Order/delete", {
    params: { orderCode, date },
  });
  return response.data;
}
