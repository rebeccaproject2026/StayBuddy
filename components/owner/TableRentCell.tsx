"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { TableRentCellProps } from "./types";

function getCurrency(country?: string) {
  return country === "fr" ? "€" : "₹";
}

export default function TableRentCell({ listing, isDark }: TableRentCellProps) {
  const isPG = listing.propertyType === "PG";
  const isFrTenant = listing.country === "fr" && listing.propertyType === "Tenant";
  const currency = getCurrency(listing.country);

  const bedTypes = isPG && listing.roomDetails ? Object.keys(listing.roomDetails) : [];
  const tenantRooms: any[] = isFrTenant && listing.tenantRooms?.length ? listing.tenantRooms : [];

  const [selectedBed, setSelectedBed] = useState<string>(bedTypes[0] || "");
  const [selectedRoom, setSelectedRoom] = useState<any>(tenantRooms[0] ?? null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayPrice = isPG && selectedBed && listing.roomDetails?.[selectedBed]
    ? parseFloat(listing.roomDetails[selectedBed].monthlyRent) || listing.price
    : isFrTenant && selectedRoom
    ? parseFloat(selectedRoom.rent) || listing.price
    : listing.price;

  const hasDropdown = (isPG && bedTypes.length > 0) || (isFrTenant && tenantRooms.length > 0);

  return (
    <div className="flex flex-col gap-1" ref={ref} onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-bold text-primary">{currency} {displayPrice?.toLocaleString()}</span>
        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>/mo</span>

        {hasDropdown && (
          <div className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:border-primary hover:text-primary bg-gray-800"
                  : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary bg-white"
              }`}
            >
              {isPG ? `${selectedBed} Bed` : selectedRoom?.name ?? "Room"}
              <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className={`absolute top-full left-0 mt-1 rounded-xl border shadow-xl z-50 min-w-[140px] overflow-hidden ${
                isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}>
                {isPG && bedTypes.map(bt => (
                  <button
                    key={bt}
                    onClick={() => { setSelectedBed(bt); setOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                      selectedBed === bt
                        ? "bg-primary/10 text-primary"
                        : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {bt} Bed
                    {listing.roomDetails?.[bt]?.monthlyRent && (
                      <span className="block text-gray-400 font-normal">
                        {currency}{parseFloat(listing.roomDetails[bt].monthlyRent).toLocaleString()}
                      </span>
                    )}
                  </button>
                ))}
                {isFrTenant && tenantRooms.map((room: any) => (
                  <button
                    key={room.id}
                    onClick={() => { setSelectedRoom(room); setOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                      selectedRoom?.id === room.id
                        ? "bg-primary/10 text-primary"
                        : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {room.name}
                    {room.rent && (
                      <span className="block text-gray-400 font-normal">
                        {currency}{parseFloat(room.rent).toLocaleString()}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
