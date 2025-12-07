import ToastContainer from "../../shared/components/feedback/ToastContainer.jsx";

export function UIProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
