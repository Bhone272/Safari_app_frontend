import { useEffect, useRef, useState } from "react";

export default function Modal({ open, title, children, onClose }) {
  const modalRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Set initial position when opened
  useEffect(() => {
    if (open) {
      // small timeout so offsetWidth is available
      setTimeout(() => {
        const width = modalRef.current?.offsetWidth || 800;
        const initialX = (window.innerWidth - width) / 2;
        const initialY = 40;
        setPos({
          x: Math.max(20, initialX),
          y: Math.max(20, initialY),
        });
      }, 0);
    }
  }, [open]);

  // Handle dragging with global mouse events
  useEffect(() => {
    function handleMouseMove(e) {
      if (!dragging || !modalRef.current) return;

      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;

      const rawX = e.clientX - offset.x;
      const rawY = e.clientY - offset.y;

      // Keep window inside viewport (with small margin)
      const minX = 10;
      const minY = 10;
      const maxX = window.innerWidth - modalWidth - 10;
      const maxY = window.innerHeight - 40; // keep header visible

      const x = Math.min(Math.max(minX, rawX), Math.max(minX, maxX));
      const y = Math.min(Math.max(minY, rawY), Math.max(minY, maxY));

      setPos({ x, y });
    }

    function handleMouseUp() {
      if (dragging) setDragging(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  if (!open) return null;

  const startDrag = (e) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    setDragging(true);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const stopClickBubble = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose} // click on backdrop closes
    >
      {/* Backdrop (click-through disabled for window) */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Draggable window */}
      <div
        ref={modalRef}
        onClick={stopClickBubble}
        style={{ left: pos.x, top: pos.y }}
        className="absolute bg-white w-full max-w-4xl shadow-2xl border border-gray-200"
      >
        {/* Window header = drag handle */}
        <div
          className="cursor-move flex items-center justify-between px-3 py-1 border-b bg-gray-50 text-xs select-none"
          onMouseDown={startDrag}
        >
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center truncate px-2">{title || ""}</div>
          <button
            className="px-2 text-gray-500 hover:text-gray-800 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 bg-[#f9fffb] max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
