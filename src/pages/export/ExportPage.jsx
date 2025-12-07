// src/pages/export/ExportPage.jsx
import PageHeader from "../../shared/components/layout/PageHeader.jsx";
import ExportTable from "../../features/exportOrders/ExportTable.jsx";

export default function ExportPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Export Orders" />
      <ExportTable />
    </div>
  );
}
