// src/pages/import/ImportPage.jsx
import PageHeader from "../../shared/components/layout/PageHeader.jsx";
import ImportTable from "../../features/importOrders/ImportTable.jsx";

export default function ImportPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Import Orders" />
      <ImportTable />
    </div>
  );
}
