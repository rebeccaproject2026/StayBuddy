"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Eye, Edit, Trash2, ChevronUp } from "lucide-react";
import type { OwnerListingCardProps } from "./types";

function getCurrency(country?: string) {
  return country === "fr" ? "€" : "₹";
}

export default function OwnerListingCard({
  listing,
  isDark,
  tc,
  language,
  onView,
  onEdit,
  onDelete,
}: OwnerListingCardProps) {
  const isPG = listing.propertyType === "PG";
  const isFrTenant = listing.country === "fr" && listing.propertyType === "Tenant";
  const currencySymbol = getCurrency(listing.country);

  const bedTypes = isPG && listing.roomDetails ? Object.keys(listing.roomDetails) : [];
  const [selectedBed, setSelectedBed] = useState<string>(bedTypes[0] || "");
  const [bedOpen, setBedOpen] = useState(false);
  const bedRef = useRef<HTMLDivElement>(null);

  const tenantRooms: any[] = isFrTenant && listing.tenantRooms?.length ? listing.tenantRooms : [];
  const [selectedRoom, setSelectedRoom] = useState<any>(tenantRooms[0] ?? null);
  const [roomOpen, setRoomOpen] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bedRef.current && !bedRef.current.contains(e.target as Node)) setBedOpen(false);
      if (roomRef.current && !roomRef.current.contains(e.target as Node)) setRoomOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayPrice = isPG && listing.roomDetails && selectedBed && listing.roomDetails[selectedBed]
    ? parseFloat(listing.roomDetails[selectedBed].monthlyRent) || listing.price
    : isFrTenant && selectedRoom
    ? parseFloat(selectedRoom.rent) || listing.price
    : listing.price;

  const totalRooms = isPG && listing.roomDetails
    ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.totalBeds ?? r.totalRooms) || 0), 0)
    : isFrTenant && tenantRooms.length > 0 ? tenantRooms.length : listing.rooms;

  const availableRooms = isPG && listing.roomDetails
    ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.availableBeds ?? r.availableRooms) || 0), 0)
    : isFrTenant && tenantRooms.length > 0 ? tenantRooms.filter((r: any) => r.status !== "occupied").length : listing.rooms;

  const selectedRoomMax = isFrTenant && selectedRoom ? parseInt(selectedRoom.maxPersons) || 0 : 0;
  const selectedRoomCurrent = isFrTenant && selectedRoom ? parseInt(selectedRoom.currentPersons) || 0 : 0;
  const selectedRoomAvailable = Math.max(0, selectedRoomMax - selectedRoomCurrent);
  const selectedRoomStatus = isFrTenant && selectedRoom
    ? selectedRoom.status === "occupied" || selectedRoomAvailable === 0
      ? "occupied"
      : selectedRoomCurrent > 0 ? "partial" : "available"
    : null;

  return (
    <div className={`rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow h-full ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white shadow-md"}`}>
      {/* Image */}
      <div className="relative h-40 sm:h-48 flex-shrink-0">
        <Image src={listing.images?.[0] || "/owner.png"} alt={listing.title} fill className="object-cover" />
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${isPG ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
          {listing.propertyType}
        </span>
        <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
          {listing.approvalStatus === "pending" && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
              {language === "fr" ? "En attente" : "Pending Review"}
            </span>
          )}
          {listing.approvalStatus === "rejected" && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
              {language === "fr" ? "Rejeté" : "Rejected"}
            </span>
          )}
          {listing.isVerified && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
              ✓ {language === "fr" ? "Vérifié" : "Verified"}
            </span>
          )}
          {!listing.isVerified && (
            <span className="px-2.5 py-1 bg-gray-500/80 text-white text-xs font-semibold rounded-full">
              {language === "fr" ? "Non vérifié" : "Not Verified"}
            </span>
          )}
          {listing.propertyType === "Tenant" && listing.bhk && (
            <span className="px-2.5 py-1 bg-white/90 text-gray-800 text-xs font-semibold rounded-full">
              {listing.bhk}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className={`text-base font-bold mb-1 line-clamp-1 ${isDark ? "text-white" : "text-gray-900"}`}>
          {listing.propertyType === "Tenant" && listing.societyName ? listing.societyName : listing.title}
        </h3>
        <div className={`flex items-center gap-1.5 mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{[listing.areaName, listing.location, listing.state].filter(Boolean).join(", ")}</span>
        </div>

        {/* Price + dropdown */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary">{currencySymbol} {displayPrice?.toLocaleString()}</span>
            <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>/mo</span>
          </div>

          {/* PG bed type dropdown */}
          {isPG && bedTypes.length > 0 && (
            <div ref={bedRef} className="relative ml-auto" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setBedOpen(o => !o)}
                className={`flex items-center gap-1 px-2.5 py-1.5 border-2 rounded-lg text-xs font-medium transition-colors ${isDark ? "border-gray-700 text-gray-300 hover:border-primary hover:text-primary bg-gray-800" : "border-gray-200 text-gray-700 hover:border-primary hover:text-primary bg-white"}`}
              >
                <span>{selectedBed ? `${selectedBed} Bed` : "Bed"}</span>
                <ChevronUp className={`w-3 h-3 transition-transform ${bedOpen ? "rotate-0" : "rotate-180"}`} />
              </button>
              <AnimatePresence>
                {bedOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute bottom-full right-0 mb-1.5 border rounded-xl shadow-lg z-30 min-w-[140px] overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                  >
                    {bedTypes.map(bt => (
                      <button
                        key={bt}
                        onClick={() => { setSelectedBed(bt); setBedOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${selectedBed === bt ? "bg-primary/10 text-primary" : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        {bt} Bed
                        {listing.roomDetails?.[bt]?.monthlyRent && (
                          <span className="block text-gray-400 font-normal">{currencySymbol}{parseFloat(listing.roomDetails[bt].monthlyRent).toLocaleString()}</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* France Tenant room dropdown */}
          {isFrTenant && tenantRooms.length > 0 && (
            <div ref={roomRef} className="relative ml-auto" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setRoomOpen(o => !o)}
                className={`flex items-center gap-1 px-2.5 py-1.5 border-2 rounded-lg text-xs font-medium transition-colors ${isDark ? "border-gray-700 text-gray-300 hover:border-primary hover:text-primary bg-gray-800" : "border-gray-200 text-gray-700 hover:border-primary hover:text-primary bg-white"}`}
              >
                <span>{selectedRoom ? selectedRoom.name : "Room"}</span>
                <ChevronUp className={`w-3 h-3 transition-transform ${roomOpen ? "rotate-0" : "rotate-180"}`} />
              </button>
              <AnimatePresence>
                {roomOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute bottom-full right-0 mb-1.5 border rounded-xl shadow-lg z-30 min-w-[150px] overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                  >
                    {tenantRooms.map((room: any) => (
                      <button
                        key={room.id}
                        onClick={() => { setSelectedRoom(room); setRoomOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${selectedRoom?.id === room.id ? "bg-primary/10 text-primary" : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        {room.name}
                        <span className="flex items-center gap-1.5 mt-0.5">
                          {room.rent && <span className="text-gray-400 font-normal">{currencySymbol}{parseFloat(room.rent).toLocaleString()}</span>}
                          {room.maxPersons && <span className="text-gray-400 font-normal">· {room.currentPersons ?? 0}/{room.maxPersons} cap</span>}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className={`text-center p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>{isPG ? "Beds" : "Rooms"}</p>
            <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{totalRooms}</p>
          </div>
          <div className={`text-center p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>{language === "fr" ? "Dispo" : "Avail."}</p>
            {isFrTenant && selectedRoom ? (
              <p className={`font-bold ${selectedRoomStatus === "occupied" ? "text-red-500" : selectedRoomStatus === "partial" ? "text-yellow-500" : "text-green-600"}`}>
                {selectedRoomAvailable}
              </p>
            ) : (
              <p className="font-bold text-green-600">{availableRooms}</p>
            )}
          </div>
          <div className={`text-center p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
              {isFrTenant && selectedRoom ? (language === "fr" ? "Statut" : "Status") : "Area"}
            </p>
            {isFrTenant && selectedRoom ? (
              <p className={`font-bold text-xs ${selectedRoomStatus === "occupied" ? "text-red-500" : selectedRoomStatus === "partial" ? "text-yellow-500" : "text-green-600"}`}>
                {selectedRoomStatus === "occupied"
                  ? (language === "fr" ? "Occupé" : "Full")
                  : selectedRoomStatus === "partial"
                  ? (language === "fr" ? "Partiel" : "Partial")
                  : (language === "fr" ? "Libre" : "Free")}
              </p>
            ) : (
              <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{listing.area}m²</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={onView}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            {tc.viewDetails}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors text-sm ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              <Edit className="w-4 h-4" />
              {tc.edit}
            </button>
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm"
              aria-label={tc.delete}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
