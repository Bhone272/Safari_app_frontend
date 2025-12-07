// Textarea.jsx
export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      rows={3}
      className={
        "w-full border border-gray-300 px-2 py-1 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-400 " +
        className
      }
      {...props}
    />
  );
}
