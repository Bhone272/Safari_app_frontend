// src/pages/home/HomePage.jsx
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-140px)] bg-[#f7faf9] overflow-hidden">
      {/* Top-right gradient blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-100px] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#c9f7ea] via-[#a8f0de] to-[#7ce0c3] opacity-100 shadow-2xl"
      />

      <div className="items-center flex flex-col relative max-w-6xl mx-auto pt-34 mt-34 pb-30">
        {/* Hero text */}
        <header className="mb-14">
          <h1 className="text-[32px] md:text-[36px] font-mono font-bold text-gray-900 mb-10">
            Import. Export. Explore the Data
          </h1>
          <p className="max-w-xl text-[14px]font-semibold leading-relaxed mb-20 text-gray-700">
            Import products you need, export what you sell, and explore all the
            order data in one clean, minimal dashboard.
          </p>
        </header>

        {/* Folder cards row */}
        <section className="flex flex-wrap gap-8">
          {/* Imported Report */}
          <FolderCard
            title="Imported Report"
            subtitle="View and manage import orders."
            onClick={() => navigate("/import")}
            active
          />
        
          {/* Exported Report */}
          <FolderCard
            title="Exported Report"
            subtitle="View and manage export orders."
            onClick={() => navigate("/export")}
            active
          />
        </section>
      </div>
    </div>
  );
}

/**
 * Folder-style card to match the design:
 * - Top left tab
 * - Soft shadow
 * - Active (green) or muted (light mint)
 */
function FolderCard({ title, subtitle, onClick, active, muted }) {
  const baseColor = active
    ? "bg-[#35c97a] text-white"
    : muted
    ? "bg-[#e5f8f0] text-[#7a9b89]"
    : "bg-[#6ad39f] text-white";

  const shadow = active
    ? "shadow-md hover:shadow-lg"
    : "shadow-sm";

  const isClickable = Boolean(onClick) && !muted;

  return (
    <button
      type="button"
      onClick={isClickable ? onClick : undefined}
      className={`
        relative w-[230px] h-[140px] text-left rounded-xl ${baseColor} ${shadow}
        transition-all duration-150 px-5 pt-7 pb-4
        ${isClickable ? "cursor-pointer hover:-translate-y-[2px]" : "cursor-default"}
      `}
    >
      {/* Folder tab */}
      <div
        className={`
          absolute -top-3 left-4 h-4 w-16 rounded-t-md rounded-b-sm
          ${active ? "bg-[#35c97a]" : "bg-[#c9ecde]"}
        `}
      />

      <div className="font-semibold text-[16px] mb-2 leading-snug">
        {title}
      </div>
      <div
        className={`text-[11px] leading-snug ${
          active ? "text-white/90" : "text-[#7a9b89]"
        }`}
      >
        {subtitle}
      </div>
    </button>
  );
}
