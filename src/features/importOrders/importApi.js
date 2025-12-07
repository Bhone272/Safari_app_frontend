// src/features/importOrders/importApi.js
import http from "../../shared/lib/httpClient.js";

const toInt = (value) => {
  const n = parseInt((value ?? "0").toString().trim(), 10);
  return Number.isNaN(n) ? 0 : n;
};

// Build Items[] and payload for create/update
function buildImportPayload(row, includeCreatedBy = true) {
  // Always derive items from the text fields the user edits
  const names = (row.product ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const qtys = (row.productQty ?? "")
    .split(",")
    .map((s) => s.trim());

  const orderCounts = (row.orderCount ?? "")
    .split(",")
    .map((s) => s.trim());

  const items = names
    .map((name, index) => ({
      Product_Name: name,
      Product_Count: toInt(qtys[index]),
      Order_count: toInt(orderCounts[index]),
    }))
    .filter((i) => (i.Product_Name ?? "").trim().length > 0);

  if (!items || items.length === 0) {
    throw new Error("At least one product is required.");
  }

  const payload = {
    Sender: row.senderName,
    Comment: row.note ?? "",
    Items: items,
  };

  // Backend has Created_By and ModifiedBy
  if (includeCreatedBy) {
    payload.Created_By = "WebApp";
  } else {
    payload.ModifiedBy = "WebApp";
  }

  return payload;
}

/**
 * CREATE (POST): add one import row to DB.
 */
export async function saveImportOrderToDb(row) {
  const payload = buildImportPayload(row, true);
  const response = await http.post("/Import", payload);
  return response.data;
}

/**
 * GET: all imports for a specific date (yyyy-MM-dd)
 * Maps backend ImportResModel -> frontend table row.
 */
export async function fetchImportOrdersByDate(date) {
  const response = await http.get("/Import", {
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

    const orderCount = items
      .map((i) =>
        (i.order_count ?? i.Order_count ?? 0).toString()
      )
      .join(", ");

    const created =
      apiRow.create_DateTime ?? apiRow.Create_DateTime ?? "";
    const dateOnly = created ? created.slice(0, 10) : "";

    return {
      // what your table expects
      date: dateOnly,
      senderName: apiRow.sender ?? apiRow.Sender ?? "",
      note: apiRow.comment ?? apiRow.Comment ?? "",
      paymentType: "cash", // not stored in DB, so default
      product,
      productQty,
      orderCount,

      // you can still keep items for the form if needed
      items: items.map((i) => ({
        name: i.product_Name ?? i.Product_Name ?? "",
        qty: i.product_Count ?? i.Product_Count ?? 0,
        orderCount: i.order_count ?? i.Order_count ?? 0,
      })),

      // needed for PUT/DELETE
      importCode: apiRow.import_Code ?? apiRow.Import_Code,
      createdDateTime: created,
    };
  });
}

/**
 * UPDATE (PUT): update an existing import.
 * Needs importCode + date (yyyy-MM-dd) per your controller signature.
 */
export async function updateImportOrderInDb(importCode, date, row) {
  const payload = buildImportPayload(row, false);
  const response = await http.put(
    `/Import/${encodeURIComponent(importCode)}`,
    payload,
    {
      params: { date },
    }
  );
  return response.data;
}

/**
 * DELETE: delete an import.
 */
export async function deleteImportOrderInDb(importCode, date) {
  const response = await http.delete("/Import/delete", {
    params: { importCode, date },
  });
  return response.data;
}
