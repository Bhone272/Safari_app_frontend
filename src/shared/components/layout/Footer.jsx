import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-600">
        {/* Brand & socials */}
        <div>
          <div className="font-serif font-bold text-lg tracking-widest">SAFARI</div>
          <div className="text-xs mt-2 space-x-2">
            <a href="mailto:info@safari.com" className="hover:text-emerald-600">Gmail</a> |
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">GitHub</a> |
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">Facebook</a> |
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">Instagram</a>
          </div>
        </div>

        {/* Main navigation */}
        <div>
          <div className="font-semibold text-gray-800 mb-1">Main</div>
          <ul className="space-y-1">
            <li>
              <NavLink to="/" className="hover:text-emerald-600">Home</NavLink>
            </li>
            <li>
              <NavLink to="/import" className="hover:text-emerald-600">Import</NavLink>
            </li>
            <li>
              <NavLink to="/export" className="hover:text-emerald-600">Export</NavLink>
            </li>
            <li>
              <NavLink to="/account/profile" className="hover:text-emerald-600">Profile</NavLink>
            </li>
          </ul>
        </div>

        {/* Support & policies */}
        <div>
          <div className="font-semibold text-gray-800 mb-1">Support</div>
          <ul className="space-y-1">
            <li>
              <NavLink to="/terms" className="hover:text-emerald-600">Terms &amp; Conditions</NavLink>
            </li>
            <li>
              <NavLink to="/privacy" className="hover:text-emerald-600">Privacy Policy</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-emerald-600">Contact</NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright line */}
      <div className="border-t border-gray-200 text-center text-xs py-3 text-gray-500">
        © {new Date().getFullYear()} SAFARI — All rights reserved.
      </div>
    </footer>
  );
}
