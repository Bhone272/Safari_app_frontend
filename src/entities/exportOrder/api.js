// src/entities/exportOrder/api.js
import http from "../../shared/lib/httpClient.js";

// date: "yyyy-MM-dd"
export async function fetchOrdersByDate(date) {
  const res = await http.get("/Order", {
    params: { currentdate: date },
  });
  return res.data; // backend returns a list of OrderResModel
}

export async function createOrderFromForm(form) {
  // form comes from ExportFormModal, you already have:
  // form.ReceiverName, form.phoneNumber, form.cityName, form.gateName,
  // plus arrays of products / packages etc.

  // Build Items list from your products array
  const items = (form.products || []).map((p) => ({
    Product_Name: p.name,
    Product_Count: Number(p.qty || 0),
  }));

  // For PackageCount, you might sum package qtys:
  const totalPackages = (form.packages || []).reduce(
    (sum, p) => sum + (Number(p.qty || 0) || 0),
    0
  );

  const payload = {
    CusName: form.ReceiverName,
    CusPh: form.phoneNumber,
    City: form.cityName,
    Gate: form.gateName,
    PackageCount: String(totalPackages),
    Comment: form.note,
    Items: items,
  };

  const res = await http.post("/Order", payload);
  return res.data; // created order
}

export async function updateOrder(orderCode, date, form) {
  const items = (form.products || []).map((p) => ({
    Product_Name: p.name,
    Product_Count: Number(p.qty || 0),
  }));

  const totalPackages = (form.packages || []).reduce(
    (sum, p) => sum + (Number(p.qty || 0) || 0),
    0
  );

  const payload = {
    CusName: form.ReceiverName,
    CusPh: form.phoneNumber,
    City: form.cityName,
    Gate: form.gateName,
    PackageCount: String(totalPackages),
    Comment: form.note,
    Items: items,
  };

  const res = await http.put(`/Order/${orderCode}`, payload, {
    params: { date }, // "yyyy-MM-dd"
  });
  return res.data;
}

export async function deleteOrder(orderCode, date) {
  const res = await http.delete("/Order/delete", {
    params: { orderCode, date },
  });
  return res.data;
}

export async function completeOrder(orderCode, date) {
  const res = await http.put("/Order/complete", null, {
    params: { orderCode, date },
  });
  return res.data;
}
