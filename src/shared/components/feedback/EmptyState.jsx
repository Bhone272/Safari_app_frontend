// EmptyState.jsx
export default function EmptyState({ message }) {
  return (
    <div className="py-8 text-center text-gray-400 text-sm">
      {message || "No data to display."}
    </div>
  );
}

