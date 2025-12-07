// IconButton.jsx
export default function IconButton({ children, className = "", ...props }) {
  return (
    <button
      className={
        "w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md text-xs hover:bg-gray-100 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
