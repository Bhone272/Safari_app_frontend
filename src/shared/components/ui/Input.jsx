// Input.jsx
export default function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 " +
        className
      }
      {...props}
    />
  );
}
