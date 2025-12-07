import { Outlet } from "react-router-dom";
import Navbar from "../../shared/components/layout/Navbar.jsx";
import Footer from "../../shared/components/layout/Footer.jsx";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <main className="flex-1  ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
