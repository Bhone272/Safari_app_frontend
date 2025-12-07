import { Outlet } from "react-router-dom";
import Navbar from "../../shared/components/layout/Navbar.jsx";

export default function AuthLayout() {
  return (
    //<div className="min-h-screen flex flex-col bg-gray-50">
      //<main className="flex items-center justify-center px-4 py-6">
      <div>
      <Navbar />
        <div className="sm:w-full w-full min-h-screen bg-white shadow-md">
          <Outlet />
        </div>
        </div>
      //</main>
    //</div>
  );
}
