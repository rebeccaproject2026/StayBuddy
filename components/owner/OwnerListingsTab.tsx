"use client";

import Image from "next/image";
import { Home, Edit, Trash2, MapPin, Plus, Grid3x3, List, Eye, ArrowLeft } from "lucide-react";
import OwnerListingCard from "./OwnerListingCard";
import TableRentCell from "./TableRentCell";
import EditListingPanel from "./EditListingPanel";
import type { OwnerListingsTabProps, PhotoCat } from "./types";

function getCurrency(country?: string) {
  return country === "fr" ? "€" : "₹";
}

export default function OwnerListingsTab({
  isDark, language, tc,
  myListings, listingsLoading,
  viewMode, setViewMode,
  editingListing, selectedListing, setSelectedListing,
  editForm, setEditForm,
  editImages, setEditImages,
  editNewFiles, setEditNewFiles,
  editCatImages, setEditCatImages,
  editCatNewFiles, setEditCatNewFiles,
  editRoomImages, setEditRoomImages,
  editRoomNewFiles, setEditRoomNewFiles,
  editVerifImages, setEditVerifImages,
  editVerifNewFiles, setEditVerifNewFiles,
  editSaving, editError,
  openEdit, closeEdit, saveEdit,
  setDeleteConfirmId,
  user, router,
}: OwnerListingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Verification document nudge */}
      {!listingsLoading && myListings.some(l => !l.verificationImages?.length) && (() => {
        const missing = myListings.filter(l => !l.verificationImages?.length);
        return (
          <div className={`px-4 py-3.5 rounded-xl border space-y-2.5 ${isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200"}`}>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-base leading-none">⚠</span>
              <p className={`text-sm font-semibold ${isDark ? "text-amber-400" : "text-amber-700"}`}>
                {language === "fr" ? "Documents de vérification manquants" : "Verification documents missing"}
              </p>
            </div>
            <p className={`text-xs ${isDark ? "text-amber-500/80" : "text-amber-600"}`}>
              {language === "fr"
                ? "Les annonces suivantes n'ont pas de documents de vérification :"
                : "The following listings are missing verification documents. Click a listing to upload:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {missing.map((l: any) => (
                <button
                  key={l._id}
                  onClick={() => openEdit(l)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${isDark ? "bg-amber-500/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/30" : "bg-white border-amber-300 text-amber-700 hover:bg-amber-100"}`}
                >
                  <span className="truncate max-w-[160px]">{l.propertyType === "PG" ? (l.pgName || l.title) : (l.societyName || l.title)}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isDark ? "bg-amber-500/30 text-amber-400" : "bg-amber-100 text-amber-600"}`}>
                    {language === "fr" ? "Modifier" : "Upload"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.myListings}</h2>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className={`flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                viewMode === "grid" ? isDark ? "bg-gray-700 text-primary shadow-sm" : "bg-white text-primary shadow-sm" : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                viewMode === "list" ? isDark ? "bg-gray-700 text-primary shadow-sm" : "bg-white text-primary shadow-sm" : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => router.push(`/${user?.country || "in"}/post-property`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs sm:text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{tc.addNewListing}</span>
            <span className="sm:hidden">{language === "fr" ? "Ajouter" : "Add"}</span>
          </button>
        </div>
      </div>

      {listingsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`rounded-xl overflow-hidden animate-pulse ${isDark ? "bg-gray-800" : "bg-white shadow-md"}`}>
              <div className={`h-40 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="p-4 space-y-3">
                <div className={`h-4 rounded w-3/4 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                <div className={`h-3 rounded w-1/2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                <div className={`h-5 rounded w-1/3 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
            </div>
          ))}
        </div>
      ) : myListings.length > 0 ? (
        <>
          {editingListing ? (
            <EditListingPanel
              isDark={isDark} language={language} tc={tc}
              editingListing={editingListing}
              editForm={editForm} setEditForm={setEditForm}
              editImages={editImages} setEditImages={setEditImages}
              editNewFiles={editNewFiles} setEditNewFiles={setEditNewFiles}
              editCatImages={editCatImages} setEditCatImages={setEditCatImages}
              editCatNewFiles={editCatNewFiles} setEditCatNewFiles={setEditCatNewFiles}
              editRoomImages={editRoomImages} setEditRoomImages={setEditRoomImages}
              editRoomNewFiles={editRoomNewFiles} setEditRoomNewFiles={setEditRoomNewFiles}
              editVerifImages={editVerifImages} setEditVerifImages={setEditVerifImages}
              editVerifNewFiles={editVerifNewFiles} setEditVerifNewFiles={setEditVerifNewFiles}
              editSaving={editSaving} editError={editError}
              closeEdit={closeEdit} saveEdit={saveEdit}
              setDeleteConfirmId={setDeleteConfirmId} user={user}
            />
          ) : selectedListing ? (
            <ListingDetailView
              isDark={isDark}
              language={language}
              tc={tc}
              selectedListing={selectedListing}
              setSelectedListing={setSelectedListing}
              openEdit={openEdit}
              setDeleteConfirmId={setDeleteConfirmId}
              user={user}
            />
          ) : (
            <>
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                  {myListings.map((listing) => (
                    <OwnerListingCard
                      key={listing._id}
                      listing={listing}
                      isDark={isDark}
                      tc={tc}
                      language={language}
                      onView={() => setSelectedListing(listing)}
                      onEdit={() => openEdit(listing)}
                      onDelete={() => setDeleteConfirmId(listing._id)}
                    />
                  ))}
                </div>
              )}
              {viewMode === "list" && (
                <ListingsTable
                  isDark={isDark}
                  language={language}
                  tc={tc}
                  myListings={myListings}
                  setSelectedListing={setSelectedListing}
                  openEdit={openEdit}
                  setDeleteConfirmId={setDeleteConfirmId}
                />
              )}
            </>
          )}
        </>
      ) : (
        <div className={`rounded-xl shadow-md p-12 text-center ${isDark ? "bg-gray-900" : "bg-white"}`}>
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{tc.noListings}</p>
        </div>
      )}
    </div>
  );
}

// ─── Listing Detail View ────────────────────────────────────────────────────

function ListingDetailView({
  isDark, language, tc,
  selectedListing, setSelectedListing,
  openEdit, setDeleteConfirmId, user,
}: {
  isDark: boolean; language: string; tc: any;
  selectedListing: any; setSelectedListing: (l: any) => void;
  openEdit: (l: any) => void; setDeleteConfirmId: (id: string | null) => void;
  user: any;
}) {
  return (
    <div className={`rounded-xl shadow-md overflow-hidden ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
      {/* Header */}
      <div className={`flex items-center justify-between gap-3 p-4 sm:p-6 border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <button
          onClick={() => setSelectedListing(null)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold border transition-colors text-sm ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-600 text-gray-700 hover:bg-gray-50"}`}
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "fr" ? "Retour aux annonces" : "Back to listings"}
        </button>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedListing.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
          {selectedListing.propertyType}
        </span>
      </div>

      {selectedListing.images?.[0] && (
        <div className="relative h-56 sm:h-72">
          <Image src={selectedListing.images[0]} alt={selectedListing.title} fill className="object-cover" />
        </div>
      )}

      <div className="p-4 sm:p-6 space-y-6">
        <div>
          <h2 className={`text-xl sm:text-xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            {selectedListing.propertyType === "Tenant" && selectedListing.societyName ? selectedListing.societyName : selectedListing.title}
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {[selectedListing.fullAddress, selectedListing.areaName, selectedListing.state].filter(Boolean).join(", ")}
          </p>
        </div>

        {/* Pricing — per bed type for PG, per room for FR tenant, flat otherwise */}
        {selectedListing.propertyType === "PG" && selectedListing.roomDetails && Object.keys(selectedListing.roomDetails).length > 0 ? (
          <div className={`rounded-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Price by Room Type</p>
            <div className="space-y-2">
              {Object.entries(selectedListing.roomDetails as Record<string, any>).map(([category, detail]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{category} Bed</span>
                    {(detail.availableBeds ?? detail.availableRooms) != null && (
                      <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                        {detail.availableBeds ?? detail.availableRooms} avail.
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {getCurrency(selectedListing.country)} {Number(detail.monthlyRent).toLocaleString()}<span className={`text-xs font-normal ml-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>/mo</span>
                  </span>
                </div>
              ))}
            </div>
            {selectedListing.deposit > 0 && (
              <p className={`text-xs mt-3 pt-3 border-t ${isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                Security Deposit: {getCurrency(selectedListing.country)} {selectedListing.deposit?.toLocaleString()}
              </p>
            )}
          </div>
        ) : selectedListing.propertyType === "Tenant" && selectedListing.country === "fr" && selectedListing.tenantRooms?.length > 0 ? (
          <div className={`rounded-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Price by Room</p>
            <div className="space-y-2">
              {(selectedListing.tenantRooms as any[]).map((room: any, i: number) => {
                const max = parseInt(room.maxPersons) || 1;
                const current = parseInt(room.currentPersons) || 0;
                const status = current >= max ? "Occupied" : current > 0 ? "Partial" : "Available";
                const dotCls = status === "Available" ? "bg-green-500" : status === "Partial" ? "bg-yellow-500" : "bg-red-500";
                return (
                  <div key={room.id ?? i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotCls}`} />
                      <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{room.name || `Room ${i + 1}`}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${status === "Available" ? "bg-green-100 text-green-700" : status === "Partial" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>{status}</span>
                    </div>
                    {room.rent && Number(room.rent) > 0
                      ? <span className="text-sm font-bold text-primary">{getCurrency(selectedListing.country)} {Number(room.rent).toLocaleString()}<span className={`text-xs font-normal ml-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>/mo</span></span>
                      : <span className="text-xs text-gray-400">—</span>}
                  </div>
                );
              })}
            </div>
            {selectedListing.deposit > 0 && (
              <p className={`text-xs mt-3 pt-3 border-t ${isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                Security Deposit: {getCurrency(selectedListing.country)} {selectedListing.deposit?.toLocaleString()}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold text-primary">{getCurrency(selectedListing.country)} {selectedListing.price?.toLocaleString()}</span>
            <span className="text-gray-500 text-sm">/month</span>
            {selectedListing.deposit > 0 && (
              <span className="text-sm text-gray-500">· Deposit: {getCurrency(selectedListing.country)} {selectedListing.deposit?.toLocaleString()}</span>
            )}
          </div>
        )}

        {/* Key details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Category", value: selectedListing.category },
            { label: "Rooms", value: selectedListing.rooms },
            { label: "Bathrooms", value: selectedListing.bathrooms },
            { label: "Area", value: selectedListing.area ? `${selectedListing.area} m²` : null },
            { label: "Available From", value: selectedListing.availableFrom },
            { label: "Rental Period", value: selectedListing.rentalPeriod },
            ...(selectedListing.propertyType === "PG" ? [
              { label: "PG For", value: selectedListing.pgFor || selectedListing.preferredGender },
              { label: "Preferred Tenants", value: selectedListing.tenantPreference },
              { label: "Gate Closing", value: selectedListing.gateClosingTime },
              { label: "Notice Period", value: selectedListing.noticePeriod },
            ] : [
              { label: "BHK", value: selectedListing.bhk },
              { label: "Society", value: selectedListing.societyName },
              { label: "Furnishing", value: Array.isArray(selectedListing.furnishing) ? selectedListing.furnishing.join(", ") : selectedListing.furnishing },
              { label: "Floor", value: selectedListing.floorNumber },
              { label: "Total Floors", value: selectedListing.totalFloors },
              { label: "Facing", value: selectedListing.facing },
              { label: "Balcony", value: selectedListing.balcony },
              { label: "Maintenance", value: selectedListing.maintenanceCharges ? `${getCurrency(selectedListing.country)} ${selectedListing.maintenanceCharges}` : null },
              { label: "Additional Rooms", value: Array.isArray(selectedListing.additionalRooms) && selectedListing.additionalRooms.length > 0 ? selectedListing.additionalRooms.join(", ") : null },
              { label: "Overlooking", value: Array.isArray(selectedListing.overlooking) && selectedListing.overlooking.length > 0 ? selectedListing.overlooking.join(", ") : null },
            ]),
          ].filter(d => d.value != null && d.value !== "").map((detail, i) => (
            <div key={i} className={`p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className="text-xs text-gray-500 mb-0.5">{detail.label}</p>
              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{String(detail.value)}</p>
            </div>
          ))}
        </div>

        {(selectedListing.pgDescription || selectedListing.localityDescription) && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</p>
            <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {selectedListing.pgDescription || selectedListing.localityDescription}
            </p>
          </div>
        )}

        {selectedListing.uspText && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            {selectedListing.uspCategory && (
              <span className="px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full capitalize mr-2">
                {selectedListing.uspCategory}
              </span>
            )}
            <p className={`text-sm mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{selectedListing.uspText}</p>
          </div>
        )}

        {(selectedListing.commonAmenities?.length > 0 || selectedListing.societyAmenities?.length > 0) && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {(selectedListing.propertyType === "PG" ? selectedListing.commonAmenities : selectedListing.societyAmenities)?.map((a: string, i: number) => (
                <span key={i} className={`px-3 py-1 text-xs rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>{a}</span>
              ))}
            </div>
          </div>
        )}

        {selectedListing.propertyType === "PG" && selectedListing.pgRules?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Rules</p>
            <div className="flex flex-wrap gap-2">
              {selectedListing.pgRules.map((rule: string, i: number) => {
                const labels: Record<string, string> = { guardian: "No Guardian", nonveg: "No Non-Veg", gender: "No Opposite Gender", alcohol: "No Alcohol", smoking: "No Smoking" };
                return <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">{labels[rule] || rule}</span>;
              })}
            </div>
          </div>
        )}

        {Array.isArray(selectedListing.services) && selectedListing.services.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Services</p>
            <div className="flex flex-wrap gap-2">
              {selectedListing.services.map((s: string, i: number) => {
                const labels: Record<string, string> = { laundry: "Laundry", cleaning: "Room Cleaning", warden: "Warden" };
                return <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">{labels[s] || s}</span>;
              })}
            </div>
          </div>
        )}

        {selectedListing.tenantsPrefer?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tenants Preferred</p>
            <div className="flex flex-wrap gap-2">
              {selectedListing.tenantsPrefer.map((p: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{p}</span>
              ))}
            </div>
          </div>
        )}

        {selectedListing.propertyType === "Tenant" && selectedListing.localityDescription && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Locality Description</p>
            <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{selectedListing.localityDescription}</p>
          </div>
        )}

        {selectedListing.nearbyPlaces?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Nearby Places</p>
            <div className="flex flex-wrap gap-2">
              {selectedListing.nearbyPlaces.map((place: { name: string; distance: string } | string, i: number) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {typeof place === "string" ? place : place.name}
                  {typeof place !== "string" && place.distance && (
                    <span className="text-blue-400 font-normal">· {place.distance}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedListing.propertyType === "PG" && selectedListing.foodProvided && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Food</p>
            <div className="flex flex-wrap gap-2">
              {selectedListing.meals?.map((m: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">{m}</span>
              ))}
              {selectedListing.vegNonVeg && (
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">{selectedListing.vegNonVeg}</span>
              )}
              {selectedListing.foodCharges && (
                <span className={`px-3 py-1 text-xs rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>Charges: {getCurrency(selectedListing.country)} {selectedListing.foodCharges}</span>
              )}
            </div>
          </div>
        )}

        {selectedListing.parkingAvailable && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Parking</p>
            <span className={`px-3 py-1 text-xs rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
              {selectedListing.parkingType || "Available"}
            </span>
          </div>
        )}

        {selectedListing.propertyType === "PG" && selectedListing.roomDetails && Object.keys(selectedListing.roomDetails).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              {language === "fr" ? "Détails des chambres" : "Room Details"}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(selectedListing.roomDetails as Record<string, any>).map(([category, detail]) => (
                <div key={category} className={`border rounded-xl p-4 hover:border-primary/40 transition-colors ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{category} Bed</h4>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {detail.availableBeds ?? detail.availableRooms ?? "—"} {language === "fr" ? "dispo" : "available"}
                    </span>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Beds</span>
                      <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{detail.totalBeds ?? detail.totalRooms ?? "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly Rent</span>
                      <span className="font-bold text-primary">{getCurrency(selectedListing.country)} {Number(detail.monthlyRent).toLocaleString()}</span>
                    </div>
                    {detail.securityDeposit && Number(detail.securityDeposit) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Deposit</span>
                        <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{getCurrency(selectedListing.country)} {Number(detail.securityDeposit).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  {detail.facilities?.length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 pt-2 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                      {detail.facilities.map((f: string, i: number) => (
                        <span key={i} className={`px-2 py-0.5 text-xs rounded-full capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedListing.propertyType === "Tenant" && user?.country === "fr" && selectedListing.tenantRooms?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Room Details</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {(selectedListing.tenantRooms as any[]).map((room: any, i: number) => {
                const max = parseInt(room.maxPersons) || 1;
                const current = parseInt(room.currentPersons) || 0;
                const available = max - current;
                const status = current >= max ? "Occupied" : current > 0 ? "Partial" : "Available";
                const statusCls = status === "Available" ? "bg-green-50 text-green-700 border-green-200" : status === "Partial" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-red-50 text-red-600 border-red-200";
                const dotCls = status === "Available" ? "bg-green-500" : status === "Partial" ? "bg-yellow-500" : "bg-red-500";
                return (
                  <div key={room.id ?? i} className={`border rounded-xl p-4 hover:border-primary/40 transition-colors ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{room.name || `Room ${i + 1}`}</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusCls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
                        {status}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {room.rent && Number(room.rent) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Monthly Rent</span>
                          <span className="font-bold text-primary">{getCurrency(selectedListing.country)} {Number(room.rent).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Capacity</span>
                        <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{current} / {max} persons</span>
                      </div>
                      {status !== "Occupied" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Available spots</span>
                          <span className="font-semibold text-green-600">{available}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={`flex flex-wrap gap-2 pt-2 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          <button
            onClick={() => { openEdit(selectedListing); setSelectedListing(null); }}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
          >
            <Edit className="w-4 h-4" />
            {tc.edit}
          </button>
          <button
            onClick={() => setDeleteConfirmId(selectedListing._id)}
            className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            {tc.delete}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Listings Table (List View) ─────────────────────────────────────────────

function ListingsTable({
  isDark, language, tc,
  myListings, setSelectedListing, openEdit, setDeleteConfirmId,
}: {
  isDark: boolean; language: string; tc: any;
  myListings: any[]; setSelectedListing: (l: any) => void;
  openEdit: (l: any) => void; setDeleteConfirmId: (id: string | null) => void;
}) {
  return (
    <div className={`rounded-xl shadow-md overflow-hidden ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/10"}`}>
              <th className="text-left px-5 py-4 text-xs font-bold text-primary uppercase tracking-wide">Property</th>
              <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide hidden md:table-cell">Location</th>
              <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide">Rent</th>
              <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide hidden sm:table-cell">Rooms</th>
              <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide hidden lg:table-cell">Available</th>
              <th className="text-left px-4 py-4 text-xs font-bold text-primary uppercase tracking-wide hidden lg:table-cell">Type</th>
              <th className="text-right px-5 py-4 text-xs font-bold text-primary uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {myListings.map((listing, idx) => {
              const totalRooms = listing.propertyType === "PG" && listing.roomDetails
                ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.totalBeds ?? r.totalRooms) || 0), 0)
                : listing.rooms;
              const availableRooms = listing.propertyType === "PG" && listing.roomDetails
                ? Object.values(listing.roomDetails as Record<string, any>).reduce((s: number, r: any) => s + (parseInt(r.availableBeds ?? r.availableRooms) || 0), 0)
                : listing.rooms;
              return (
                <tr
                  key={listing._id}
                  className={`group hover:bg-primary/5 transition-colors cursor-pointer ${idx % 2 === 0 ? isDark ? "bg-gray-900" : "bg-white" : isDark ? "bg-gray-800/50" : "bg-gray-50/50"}`}
                  onClick={() => setSelectedListing(listing)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden">
                        <Image src={listing.images?.[0] || "/owner.png"} alt={listing.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold truncate max-w-[160px] group-hover:text-primary transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                          {listing.propertyType === "Tenant" && listing.societyName ? listing.societyName : listing.title}
                        </p>
                        <p className={`text-xs truncate max-w-[160px] md:hidden ${isDark ? "text-gray-500" : "text-gray-400"}`}>{listing.areaName}, {listing.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className={`flex items-center gap-1.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate max-w-[160px]">{[listing.areaName, listing.location].filter(Boolean).join(", ")}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <TableRentCell listing={listing} isDark={isDark} />
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{totalRooms}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${Number(availableRooms) > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {availableRooms} {Number(availableRooms) > 0 ? "available" : "full"}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${listing.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {listing.propertyType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setSelectedListing(listing)} className="p-2 rounded-lg text-gray-500 hover:bg-primary hover:text-white transition-colors" title={tc.viewDetails}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(listing)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors" title={tc.edit}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirmId(listing._id)} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors" title={tc.delete}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={`px-5 py-3 border-t flex items-center justify-between ${isDark ? "border-gray-800 bg-gray-800/50" : "border-gray-100 bg-gray-50/50"}`}>
        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{myListings.length} {myListings.length === 1 ? "listing" : "listings"}</p>
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Click a row to view details</p>
      </div>
    </div>
  );
}
