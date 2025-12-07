import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "../ui/LogoutButton.jsx";

const base = "px-4 py-2 text-sm font-medium transition-colors";
const active = "border-b-2 border-emerald-400 text-emerald-600";
const inactive = "text-gray-700 hover:text-emerald-600";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="font-serif text-3xl font-bold tracking-widest ">
          SAFARI
        </div>

        {/* Navigation links */}
        <nav className="flex gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              base + " " + (isActive ? active : inactive)
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/import"
            className={({ isActive }) =>
              base + " " + (isActive ? active : inactive)
            }
          >
            Import
          </NavLink>
          <NavLink
            to="/export"
            className={({ isActive }) =>
              base + " " + (isActive ? active : inactive)
            }
          >
            Export
          </NavLink>
        </nav>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full p-2 hover:bg-gray-100 transition"
          >
            <FaUserCircle className="text-3xl text-gray-600" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-md z-50">
              <NavLink
                to="/account/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile
              </NavLink>
              <NavLink
                to="/settings"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Settings
              </NavLink>
              <div className="border-t border-gray-200 my-1"></div>
              <div className="px-2 pb-2">
                <LogoutButton
                  label="Logout"
                  className="w-full bg-emerald-600 hover:bg-emerald-300 text-white py-1.5 text-sm rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
