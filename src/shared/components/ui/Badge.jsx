// Badge.jsx
export function Badge({ children }) {
  return (
    <span className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-700">
      {children}
    </span>
  );
}

