
// FormField.jsx
export function FormField({ label, children, error }) {
  return (
    <label className="block text-sm mb-2">
      <div className="mb-1">{label}</div>
      {children}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </label>
  );
}