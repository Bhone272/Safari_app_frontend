// Table.jsx
export default function Table({ children, className = "" }) {
  return (
    <table className={"min-w-full text-xs " + className}>
      {children}
    </table>
  );
}

