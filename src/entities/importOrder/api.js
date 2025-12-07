// src/entities/importOrder/api.js
import http from "../../shared/lib/httpClient.js";

export async function fetchImportsByDate(date) {
  const res = await http.get("/Import", {
    params: { currentdate: date },
  });
  return res.data; // list of ImportResModel
}

export async function createImportFromForm(form) {
  const items = (form.products || []).map((p) => ({
    Product_Name: p.name,
    Product_Count: Number(p.qty || 0),
    Order_count: null, // or derive something if you need
  }));

  const payload = {
    Sender: form.senderName,
    Comment: form.note,
    Items: items,
  };

  const res = await http.post("/Import", payload);
  return res.data;
}

export async function updateImport(importCode, date, form) {
  const items = (form.products || []).map((p) => ({
    Product_Name: p.name,
    Product_Count: Number(p.qty || 0),
    Order_count: null,
  }));

  const payload = {
    Sender: form.senderName,
    Comment: form.note,
    Items: items,
  };

  const res = await http.put(`/Import/${importCode}`, payload, {
    params: { date },
  });
  return res.data;
}

export async function deleteImport(importCode, date) {
  const res = await http.delete("/Import/delete", {
    params: { importCode, date },
  });
  return res.data;
}
