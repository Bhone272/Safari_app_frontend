// Button.jsx
export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center px-4 py-2 rounded-full text-sm border border-gray-300 bg-white hover:bg-gray-50 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
