"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { StatusDropdownProps } from "./types";

export default function StatusDropdown({
  value,
  onChange,
  options,
  isDark = false,
}: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  const colorMap: Record<string, string> = {
    new: "bg-blue-100 text-blue-700 border-blue-200",
    contacted: "bg-amber-100 text-amber-700 border-amber-200",
    interested: "bg-violet-100 text-violet-700 border-violet-200",
    booked: "bg-emerald-100 text-emerald-700 border-emerald-200",
    closed: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer select-none ${colorMap[value] || colorMap.new}`}
      >
        {selected.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-1.5 rounded-xl shadow-xl border overflow-hidden z-50 min-w-[140px] ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                opt.value === value
                  ? "bg-primary text-white"
                  : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
