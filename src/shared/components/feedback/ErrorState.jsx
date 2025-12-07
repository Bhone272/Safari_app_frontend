// ErrorState.jsx
export default function ErrorState({ message }) {
  return (
    <div className="py-4 text-center text-red-500 text-sm">
      {message || "Something went wrong."}
    </div>
  );
}
