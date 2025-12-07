export default function PageHeader({ title, description }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold mb-1">{title}</h1>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
}
