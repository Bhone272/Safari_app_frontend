// src/utils/handleCSV.jsx   <-- adjust path to wherever this file is

// Escape one value so commas / quotes / newlines don't break CSV
const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";
  const str = String(value).replace(/"/g, '""');
  return /[",\n]/.test(str) ? `"${str}"` : str;
};

/**
 * Generic CSV download helper.
 *
 * @param {Array} rows - data rows (objects from your table)
 * @param {string} filename - base name of the CSV file (without .csv)
 * @param {Array} columns - array of { header: string, accessor: (row, index) => any }
 */
export const downloadCsv = (rows, filename, columns) => {
  if (!rows || rows.length === 0) return;

  // header row
  const headerLine = columns
    .map((c) => escapeCsvValue(c.header))
    .join(",");

  // data rows
  const bodyLines = rows.map((row, index) => {
    const values = columns.map((c) => escapeCsvValue(c.accessor(row, index)));
    return values.join(",");
  });

  const csvContent = [headerLine, ...bodyLines].join("\r\n");

  // create blob + auto-download
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  link.href = url;
  link.download = `${filename}_${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
