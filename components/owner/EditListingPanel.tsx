"use client";

import Image from "next/image";
import { ArrowLeft, Trash2, Plus, MapPin } from "lucide-react";
import type { PhotoCat } from "./types";

function getCurrency(country?: string) {
  return country === "fr" ? "€" : "₹";
}

interface EditListingPanelProps {
  isDark: boolean;
  language: string;
  tc: any;
  editingListing: any;
  editForm: Record<string, any>;
  setEditForm: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  editImages: string[];
  setEditImages: React.Dispatch<React.SetStateAction<string[]>>;
  editNewFiles: File[];
  setEditNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
  editCatImages: Record<PhotoCat, string[]>;
  setEditCatImages: React.Dispatch<React.SetStateAction<Record<PhotoCat, string[]>>>;
  editCatNewFiles: Record<PhotoCat, File[]>;
  setEditCatNewFiles: React.Dispatch<React.SetStateAction<Record<PhotoCat, File[]>>>;
  editRoomImages: any[];
  setEditRoomImages: React.Dispatch<React.SetStateAction<any[]>>;
  editRoomNewFiles: File[];
  setEditRoomNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
  editVerifImages: string[];
  setEditVerifImages: React.Dispatch<React.SetStateAction<string[]>>;
  editVerifNewFiles: File[];
  setEditVerifNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
  editSaving: boolean;
  editError: string;
  closeEdit: () => void;
  saveEdit: () => void;
  setDeleteConfirmId: (id: string | null) => void;
  user: any;
}

export default function EditListingPanel({
  isDark, language, tc,
  editingListing, editForm, setEditForm,
  editImages, setEditImages,
  editNewFiles, setEditNewFiles,
  editCatImages, setEditCatImages,
  editCatNewFiles, setEditCatNewFiles,
  editRoomImages, setEditRoomImages,
  editRoomNewFiles, setEditRoomNewFiles,
  editVerifImages, setEditVerifImages,
  editVerifNewFiles, setEditVerifNewFiles,
  editSaving, editError,
  closeEdit, saveEdit, setDeleteConfirmId, user,
}: EditListingPanelProps) {
  const inputCls = `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`;
  const selectCls = `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`;
  const labelCls = `block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`;
  const sectionCls = `rounded-xl p-4 sm:p-5 space-y-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`;
  const sectionTitle = "text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2";

  const toggleChip = (field: string, val: string) => {
    setEditForm((p: any) => ({
      ...p,
      [field]: (p[field] || []).includes(val)
        ? p[field].filter((x: string) => x !== val)
        : [...(p[field] || []), val],
    }));
  };

  const chipBtn = (field: string, val: string, label: string) => {
    const active = (editForm[field] || []).includes(val);
    return (
      <button key={val} type="button" onClick={() => toggleChip(field, val)}
        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
        {label}
      </button>
    );
  };

  return (
    <div className={`rounded-xl overflow-hidden ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white shadow-md"}`}>
      {/* Header */}
      <div className={`flex items-center gap-3 p-4 sm:p-6 border-b ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gradient-to-r from-primary/5 to-transparent border-gray-100"}`}>
        <button onClick={closeEdit}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-sm font-medium ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500" : "border-gray-200 text-gray-600 hover:bg-white hover:border-primary/30"}`}>
          <ArrowLeft className="w-4 h-4" />
          {language === "fr" ? "Retour" : "Back"}
        </button>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${editingListing.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
            {editingListing.propertyType}
          </span>
          <span className={`text-base font-bold truncate max-w-xs ${isDark ? "text-white" : "text-gray-900"}`}>
            {editingListing.propertyType === "PG" ? (editingListing.pgName || editingListing.title) : (editingListing.societyName || editingListing.title)}
          </span>
        </div>
        <span className="ml-auto text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
          {language === "fr" ? "Modifier l'annonce" : "Edit Listing"}
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-6">

        {/* Basic Info */}
        <div className={sectionCls}>
          <h3 className={sectionTitle}><span className="w-1 h-4 bg-primary rounded-full inline-block" />Basic Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>{editForm.propertyType === "PG" ? "PG Name" : "Society Name"}</label>
              <input value={editForm.propertyType === "PG" ? editForm.pgName : editForm.societyName}
                onChange={e => setEditForm((p: any) => editForm.propertyType === "PG" ? { ...p, pgName: e.target.value } : { ...p, societyName: e.target.value })}
                className={inputCls} />
            </div>
            {editForm.propertyType !== "PG" && (
              <>
                <div>
                  <label className={labelCls}>Monthly Rent ({getCurrency(editingListing?.country)})</label>
                  <input value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))} inputMode="numeric" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Security Deposit ({getCurrency(editingListing?.country)})</label>
                  <input value={editForm.deposit} onChange={e => setEditForm(p => ({ ...p, deposit: e.target.value }))} inputMode="numeric" className={inputCls} />
                </div>
              </>
            )}
            <div>
              <label className={labelCls}>Rooms</label>
              <input value={editForm.rooms} onChange={e => setEditForm(p => ({ ...p, rooms: e.target.value }))} inputMode="numeric" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Bathrooms</label>
              <input value={editForm.bathrooms} onChange={e => setEditForm(p => ({ ...p, bathrooms: e.target.value }))} inputMode="numeric" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Area (m²)</label>
              <input value={editForm.area} onChange={e => setEditForm(p => ({ ...p, area: e.target.value }))} inputMode="numeric" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Available From</label>
              <input value={editForm.availableFrom} onChange={e => setEditForm(p => ({ ...p, availableFrom: e.target.value }))} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className={sectionCls}>
          <h3 className={sectionTitle}><span className="w-1 h-4 bg-primary rounded-full inline-block" />Location</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input value={editForm.location} onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Area / Locality</label>
              <input value={editForm.areaName} onChange={e => setEditForm(p => ({ ...p, areaName: e.target.value }))} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Full Address</label>
              <input value={editForm.fullAddress} onChange={e => setEditForm(p => ({ ...p, fullAddress: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input value={editForm.state} onChange={e => setEditForm(p => ({ ...p, state: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Pincode</label>
              <input value={editForm.pincode} onChange={e => setEditForm(p => ({ ...p, pincode: e.target.value }))} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Landmark</label>
              <input value={editForm.landmark} onChange={e => setEditForm(p => ({ ...p, landmark: e.target.value }))} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Type-specific */}
        <div className={sectionCls}>
          <h3 className={sectionTitle}><span className="w-1 h-4 bg-primary rounded-full inline-block" />{editForm.propertyType === "PG" ? "PG Details" : "Property Details"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {editForm.propertyType === "PG" && <PGDetailsSection isDark={isDark} language={language} editForm={editForm} setEditForm={setEditForm} editingListing={editingListing} inputCls={inputCls} selectCls={selectCls} labelCls={labelCls} chipBtn={chipBtn} />}
            {editForm.propertyType === "Tenant" && <TenantDetailsSection isDark={isDark} language={language} editForm={editForm} setEditForm={setEditForm} editingListing={editingListing} inputCls={inputCls} selectCls={selectCls} labelCls={labelCls} chipBtn={chipBtn} user={user} />}
          </div>
        </div>

        {/* Description & USP */}
        <div className={sectionCls}>
          <h3 className={sectionTitle}><span className="w-1 h-4 bg-primary rounded-full inline-block" />Description & Highlights</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea value={editForm.pgDescription} onChange={e => setEditForm(p => ({ ...p, pgDescription: e.target.value }))}
                rows={3} className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
            </div>
            <div>
              <label className={labelCls}>Latitude</label>
              <input value={editForm.latitude || ""} onChange={e => setEditForm(p => ({ ...p, latitude: e.target.value }))} placeholder="e.g. 23.0225" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Longitude</label>
              <input value={editForm.longitude || ""} onChange={e => setEditForm(p => ({ ...p, longitude: e.target.value }))} placeholder="e.g. 72.5714" className={inputCls} />
            </div>
            {editForm.latitude && editForm.longitude && !isNaN(parseFloat(editForm.latitude)) && !isNaN(parseFloat(editForm.longitude)) && (
              <div className={`sm:col-span-2 rounded-xl overflow-hidden border h-44 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(editForm.latitude)},${encodeURIComponent(editForm.longitude)}&z=15&output=embed`}
                  width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
            {/* Nearby Places */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Nearby Places</label>
              {(editForm.nearbyPlaces || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {(editForm.nearbyPlaces || []).map((place: { name: string; distance: string }, i: number) => (
                    <span key={i} className="flex items-center gap-1.5 pl-3 pr-1 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {place.name}
                      {place.distance && <span className="text-primary/60">· {place.distance}</span>}
                      <button type="button" onClick={() => setEditForm(p => ({ ...p, nearbyPlaces: p.nearbyPlaces.filter((_: any, idx: number) => idx !== i) }))}
                        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-primary/20 text-primary ml-0.5 text-base leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input value={editForm.nearbyPlaceInput || ""} onChange={e => setEditForm(p => ({ ...p, nearbyPlaceInput: e.target.value }))}
                  placeholder="Place name" className={`flex-1 px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                <input value={editForm.nearbyDistanceInput || ""} onChange={e => setEditForm(p => ({ ...p, nearbyDistanceInput: e.target.value }))}
                  placeholder="Distance" className={`w-28 px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                <button type="button"
                  onClick={() => {
                    const name = (editForm.nearbyPlaceInput || "").trim();
                    if (!name) return;
                    setEditForm(p => ({ ...p, nearbyPlaces: [...(p.nearbyPlaces || []), { name, distance: p.nearbyDistanceInput || "" }], nearbyPlaceInput: "", nearbyDistanceInput: "" }));
                  }}
                  className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">Add</button>
              </div>
            </div>
            <div>
              <label className={labelCls}>USP Category</label>
              <input value={editForm.uspCategory || ""} onChange={e => setEditForm(p => ({ ...p, uspCategory: e.target.value }))} placeholder="e.g. location, price" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>USP Text</label>
              <input value={editForm.uspText || ""} onChange={e => setEditForm(p => ({ ...p, uspText: e.target.value }))} placeholder="Unique selling point..." className={inputCls} />
            </div>
          </div>
        </div>

        {/* Photos */}
        <PhotosSection
          isDark={isDark}
          editRoomImages={editRoomImages} setEditRoomImages={setEditRoomImages}
          editRoomNewFiles={editRoomNewFiles} setEditRoomNewFiles={setEditRoomNewFiles}
          editCatImages={editCatImages} setEditCatImages={setEditCatImages}
          editCatNewFiles={editCatNewFiles} setEditCatNewFiles={setEditCatNewFiles}
        />

        {/* Verification Documents */}
        {editVerifImages.length === 0 ? (
          <div className={`rounded-xl p-4 sm:p-5 space-y-4 border-2 border-dashed ${isDark ? "bg-gray-800 border-amber-500/30" : "bg-amber-50 border-amber-300"}`}>
            <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full inline-block" />
              Verification Documents
              <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"}`}>Not uploaded</span>
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Upload ownership proof, rent agreement, or any document that verifies this property. This helps get your listing verified faster.
            </p>
            {editVerifNewFiles.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {editVerifNewFiles.map((file, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-amber-300 group">
                    <Image src={URL.createObjectURL(file)} alt={`doc ${i + 1}`} fill className="object-cover" />
                    <button type="button" onClick={() => setEditVerifNewFiles(p => p.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            )}
            <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-amber-400 transition-colors text-sm ${isDark ? "border-amber-500/30 text-amber-400 bg-gray-900" : "border-amber-300 text-amber-600 bg-white"}`}>
              <Plus className="w-4 h-4" />
              {editVerifNewFiles.length > 0 ? `${editVerifNewFiles.length} file(s) selected — add more` : "Upload verification documents"}
              <input type="file" accept="image/*,.pdf" multiple className="hidden"
                onChange={e => { setEditVerifNewFiles(p => [...p, ...Array.from(e.target.files || [])]); e.target.value = ""; }} />
            </label>
          </div>
        ) : (
          <div className={`rounded-xl p-4 sm:p-5 flex items-center gap-3 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
              ✓ Verification documents already uploaded
            </span>
          </div>
        )}

        {editError && (
          <div className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm text-red-600 ${isDark ? "bg-red-900/20 border-red-800/30" : "bg-red-50 border-red-200"}`}>
            <span className="font-medium">Error:</span> {editError}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={() => setDeleteConfirmId(editingListing._id)}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium">
            <Trash2 className="w-4 h-4" /> {tc.delete}
          </button>
          <button onClick={closeEdit}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium ml-auto">
            Cancel
          </button>
          <button onClick={saveEdit} disabled={editSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors text-sm font-semibold disabled:opacity-60 shadow-sm">
            {editSaving ? "Saving..." : "Update Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PG Details Section ──────────────────────────────────────────────────────

function PGDetailsSection({ isDark, language, editForm, setEditForm, editingListing, inputCls, selectCls, labelCls, chipBtn }: any) {
  return (
    <>
      <div>
        <label className={labelCls}>Operational Since</label>
        <input value={editForm.operationalSince} onChange={e => setEditForm((p: any) => ({ ...p, operationalSince: e.target.value }))} placeholder="e.g. 2018" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>PG Present In</label>
        <select value={editForm.pgPresentIn} onChange={e => setEditForm((p: any) => ({ ...p, pgPresentIn: e.target.value }))} className={selectCls}>
          <option value="">Select</option>
          <option value="An Independent Building">An Independent Building</option>
          <option value="An Independent Flats">An Independent Flats</option>
          <option value="Present In A Society">Present In A Society</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>PG For</label>
        <select value={editForm.pgFor} onChange={e => setEditForm((p: any) => ({ ...p, pgFor: e.target.value }))} className={selectCls}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Both">Both</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Tenant Preference</label>
        <select value={editForm.tenantPreference} onChange={e => setEditForm((p: any) => ({ ...p, tenantPreference: e.target.value }))} className={selectCls}>
          <option value="">Select</option>
          <option value="Professionals">Professionals</option>
          <option value="Students">Students</option>
          <option value="Both">Both</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Notice Period</label>
        <select value={editForm.noticePeriod} onChange={e => setEditForm((p: any) => ({ ...p, noticePeriod: e.target.value }))} className={selectCls}>
          <option value="">Select</option>
          <option value="1 Week">1 Week</option>
          <option value="15 Days">15 Days</option>
          <option value="1 Month">1 Month</option>
          <option value="2 Month">2 Month</option>
          <option value="No Notice Period">No Notice Period</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Gate Closing Time</label>
        <input type="time" value={editForm.gateClosingTime} onChange={e => setEditForm((p: any) => ({ ...p, gateClosingTime: e.target.value }))} className={inputCls} />
      </div>

      {/* PG Rules */}
      <div className="sm:col-span-2">
        <label className={`${labelCls} mb-2`}>PG Rules <span className="text-xs text-gray-400 font-normal">(select what is NOT allowed)</span></label>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            ...["guardian","nonveg","gender","alcohol","smoking"].map(id => ({ id, label: ({ guardian:"Guardian", nonveg:"Non-Veg Food", gender:"Opposite Gender", alcohol:"Alcohol", smoking:"Smoking" } as Record<string,string>)[id] })),
            ...(editForm.pgRules||[]).filter((r:string) => !["guardian","nonveg","gender","alcohol","smoking"].includes(r)).map((r:string) => ({ id: r, label: r }))
          ].map(rule => chipBtn("pgRules", rule.id, rule.label))}
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Add custom rule..."
            className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const val = (e.target as HTMLInputElement).value.trim(); if (val && !(editForm.pgRules||[]).includes(val)) setEditForm((p: any) => ({ ...p, pgRules: [...(p.pgRules||[]), val] })); (e.target as HTMLInputElement).value = ""; } }} />
          <button type="button" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
            onClick={e => { const input = (e.currentTarget.previousElementSibling as HTMLInputElement); const val = input.value.trim(); if (val && !(editForm.pgRules||[]).includes(val)) setEditForm((p: any) => ({ ...p, pgRules: [...(p.pgRules||[]), val] })); input.value = ""; }}>Add</button>
        </div>
      </div>

      {/* Services */}
      <div className="sm:col-span-2">
        <label className={`${labelCls} mb-2`}>Services</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            ...["laundry","cleaning","warden"].map(id => ({ id, label: ({ laundry:"Laundry", cleaning:"Room Cleaning", warden:"Warden" } as Record<string,string>)[id] })),
            ...(editForm.services||[]).filter((s:string) => !["laundry","cleaning","warden"].includes(s)).map((s:string) => ({ id: s, label: s }))
          ].map(svc => chipBtn("services", svc.id, svc.label))}
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Add custom service..."
            className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const val = (e.target as HTMLInputElement).value.trim(); if (val && !(editForm.services||[]).includes(val)) setEditForm((p: any) => ({ ...p, services: [...(p.services||[]), val] })); (e.target as HTMLInputElement).value = ""; } }} />
          <button type="button" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
            onClick={e => { const input = (e.currentTarget.previousElementSibling as HTMLInputElement); const val = input.value.trim(); if (val && !(editForm.services||[]).includes(val)) setEditForm((p: any) => ({ ...p, services: [...(p.services||[]), val] })); input.value = ""; }}>Add</button>
        </div>
      </div>

      {/* Food */}
      <div className="sm:col-span-2">
        <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 transition-all w-fit ${editForm.foodProvided ? "border-primary bg-primary/5" : isDark ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`}>
          <input type="checkbox" checked={editForm.foodProvided||false} onChange={e => setEditForm((p: any) => ({ ...p, foodProvided: e.target.checked }))} className="w-4 h-4 text-primary rounded accent-primary" />
          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Food Provided</span>
        </label>
        {editForm.foodProvided && (
          <div className={`mt-3 p-4 border rounded-xl space-y-3 ${isDark ? "bg-orange-900/20 border-orange-800/30" : "bg-orange-50 border-orange-100"}`}>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Meals</label>
              <div className="flex flex-wrap gap-2">
                {["Breakfast","Lunch","Dinner"].map(m => chipBtn("meals", m, m))}
              </div>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Veg / Non-Veg</label>
              <div className="flex gap-2">
                {["Veg","Veg & Non Veg"].map(opt => {
                  const active = editForm.vegNonVeg === opt;
                  return (
                    <button key={opt} type="button" onClick={() => setEditForm((p: any) => ({ ...p, vegNonVeg: opt }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Food Charges</label>
              <select value={editForm.foodCharges||""} onChange={e => setEditForm((p: any) => ({ ...p, foodCharges: e.target.value }))}
                className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}>
                <option value="">Select</option>
                <option value="Included in Rent">Included in Rent</option>
                <option value="Charged Separately">Charged Separately</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Common Amenities */}
      <div className="sm:col-span-2">
        <label className={`${labelCls} mb-2`}>Common Amenities</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            ...["wifi","ac","tv","fridge","washing","geyser","cctv","lift","gym","parking"].map(id => ({
              id, label: ({ wifi:"WiFi", ac:"AC", tv:"TV", fridge:"Fridge", washing:"Washing Machine", geyser:"Geyser", cctv:"CCTV", lift:"Lift", gym:"Gym", parking:"Parking" } as Record<string,string>)[id]
            })),
            ...(editForm.commonAmenities||[]).filter((a:string) => !["wifi","ac","tv","fridge","washing","geyser","cctv","lift","gym","parking"].includes(a)).map((a:string) => ({ id: a, label: a }))
          ].map(am => chipBtn("commonAmenities", am.id, am.label))}
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Add custom amenity..."
            className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const val = (e.target as HTMLInputElement).value.trim(); if (val && !(editForm.commonAmenities||[]).includes(val)) setEditForm((p: any) => ({ ...p, commonAmenities: [...(p.commonAmenities||[]), val] })); (e.target as HTMLInputElement).value = ""; } }} />
          <button type="button" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
            onClick={e => { const input = (e.currentTarget.previousElementSibling as HTMLInputElement); const val = input.value.trim(); if (val && !(editForm.commonAmenities||[]).includes(val)) setEditForm((p: any) => ({ ...p, commonAmenities: [...(p.commonAmenities||[]), val] })); input.value = ""; }}>Add</button>
        </div>
      </div>

      {/* Parking */}
      <div className="sm:col-span-2">
        <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 transition-all w-fit ${editForm.parkingAvailable ? "border-primary bg-primary/5" : isDark ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`}>
          <input type="checkbox" checked={editForm.parkingAvailable||false} onChange={e => setEditForm((p: any) => ({ ...p, parkingAvailable: e.target.checked }))} className="w-4 h-4 text-primary rounded accent-primary" />
          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Parking Available</span>
        </label>
        {editForm.parkingAvailable && (
          <div className="flex gap-2 mt-3">
            {["2-Wheeler","Car Parking"].map(opt => {
              const active = editForm.parkingType === opt;
              return (
                <button key={opt} type="button" onClick={() => setEditForm((p: any) => ({ ...p, parkingType: opt }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? "bg-primary text-white border-primary" : isDark ? "border-gray-600 text-gray-300 bg-gray-700 hover:border-primary/50" : "border-gray-200 text-gray-600 bg-white hover:border-primary/50"}`}>
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Room Details (Bed Availability) */}
      {editForm.roomDetails && Object.keys(editForm.roomDetails).length > 0 && (
        <div className="sm:col-span-2 space-y-3">
          <label className={`block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Room / Bed Details</label>
          {Object.entries(editForm.roomDetails).map(([category, detail]: [string, any]) => (
            <div key={category} className={`border-2 rounded-xl p-4 space-y-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
              <p className="text-sm font-semibold text-primary">{category} Bed</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Beds", field: "totalBeds", val: detail.totalBeds ?? detail.totalRooms ?? "" },
                  { label: "Available Beds", field: "availableBeds", val: detail.availableBeds ?? detail.availableRooms ?? "" },
                  { label: `Monthly Rent (${getCurrency(editingListing?.country)})`, field: "monthlyRent", val: detail.monthlyRent ?? "" },
                  { label: `Security Deposit (${getCurrency(editingListing?.country)})`, field: "securityDeposit", val: detail.securityDeposit ?? "" },
                ].map(({ label, field, val }) => (
                  <div key={field}>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{label}</label>
                    <input type="number" min="0" value={val}
                      onChange={e => setEditForm((p: any) => ({ ...p, roomDetails: { ...p.roomDetails, [category]: { ...p.roomDetails[category], [field]: e.target.value } } }))}
                      className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Tenant Details Section ──────────────────────────────────────────────────

function TenantDetailsSection({ isDark, language, editForm, setEditForm, editingListing, inputCls, selectCls, labelCls, chipBtn, user }: any) {
  return (
    <>
      <div>
        <label className={labelCls}>BHK</label>
        <select value={editForm.bhk || ""} onChange={e => setEditForm((p: any) => ({ ...p, bhk: e.target.value }))} className={selectCls}>
          <option value="">Select BHK</option>
          {["1 BHK","2 BHK","3 BHK","4 BHK","4+ BHK"].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Tenant Room Details (France) */}
      {user?.country === "fr" && Array.isArray(editForm.tenantRooms) && editForm.tenantRooms.length > 0 && (
        <div className="sm:col-span-2 space-y-3">
          <label className={`block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Room Details</label>
          {(editForm.tenantRooms as any[]).map((room: any, idx: number) => {
            const max = parseInt(room.maxPersons) || 1;
            const current = parseInt(room.currentPersons) || 0;
            const status = current >= max ? "Occupied" : current > 0 ? "Partial" : "Available";
            const statusCls = status === "Available" ? "text-green-600" : status === "Partial" ? "text-yellow-600" : "text-red-500";
            const updateTenantRoom = (field: string, value: string) => {
              const updated = editForm.tenantRooms.map((r: any, i: number) => {
                if (i !== idx) return r;
                const u = { ...r, [field]: value };
                const m = parseInt(field === "maxPersons" ? value : r.maxPersons) || 1;
                const c = parseInt(field === "currentPersons" ? value : r.currentPersons) || 0;
                u.status = c >= m ? "Occupied" : c > 0 ? "Partial" : "Available";
                return u;
              });
              setEditForm((p: any) => ({ ...p, tenantRooms: updated }));
            };
            return (
              <div key={room.id ?? idx} className={`border-2 rounded-xl p-4 space-y-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>{room.name || `Room ${idx + 1}`}</p>
                  <span className={`text-xs font-semibold ${statusCls}`}>{status} ({current}/{max})</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Room Name</label>
                    <input value={room.name || ""} onChange={e => updateTenantRoom("name", e.target.value)}
                      className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Monthly Rent ({getCurrency(editingListing?.country)})</label>
                    <input value={room.rent || ""} inputMode="numeric" onChange={e => updateTenantRoom("rent", e.target.value.replace(/\D/g, ""))}
                      className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Persons</label>
                    <input value={room.maxPersons || "1"} inputMode="numeric" onChange={e => updateTenantRoom("maxPersons", e.target.value.replace(/\D/g, "") || "1")}
                      className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Current Persons</label>
                    <input value={room.currentPersons || "0"} inputMode="numeric"
                      onChange={e => { const val = e.target.value.replace(/\D/g, ""); const m = parseInt(room.maxPersons) || 1; updateTenantRoom("currentPersons", String(Math.min(parseInt(val) || 0, m))); }}
                      className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-primary ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <label className={labelCls}>Monthly Rent ({getCurrency(editingListing?.country)})</label>
        <input value={editForm.monthlyRentAmount} onChange={e => setEditForm((p: any) => ({ ...p, monthlyRentAmount: e.target.value }))} inputMode="numeric" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Security Amount ({getCurrency(editingListing?.country)})</label>
        <input value={editForm.securityAmount} onChange={e => setEditForm((p: any) => ({ ...p, securityAmount: e.target.value }))} inputMode="numeric" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Maintenance Charges ({getCurrency(editingListing?.country)})</label>
        <input value={editForm.maintenanceCharges} onChange={e => setEditForm((p: any) => ({ ...p, maintenanceCharges: e.target.value }))} inputMode="numeric" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Maintenance Type</label>
        <select value={editForm.maintenanceType} onChange={e => setEditForm((p: any) => ({ ...p, maintenanceType: e.target.value }))} className={selectCls}>
          <option value="">Select</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Balcony</label>
        <select value={editForm.balcony} onChange={e => setEditForm((p: any) => ({ ...p, balcony: e.target.value }))} className={selectCls}>
          <option value="">Select</option>
          {["All","1+","2+","3+","4+"].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Facing</label>
        <select value={editForm.facing} onChange={e => setEditForm((p: any) => ({ ...p, facing: e.target.value }))} className={selectCls}>
          <option value="">Select</option>
          {["East","West","North","South","North-East","North-West","South-East","South-West"].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Floor No.</label>
        <input value={editForm.floorNumber} onChange={e => setEditForm((p: any) => ({ ...p, floorNumber: e.target.value }))} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Total Floors</label>
        <input value={editForm.totalFloors} onChange={e => setEditForm((p: any) => ({ ...p, totalFloors: e.target.value }))} className={inputCls} />
      </div>
      <div className="sm:col-span-2">
        <label className={`${labelCls} mb-2`}>Furnishing</label>
        <div className="flex flex-wrap gap-2">
          {["Unfurnished","Semi-Furnished","Fully-Furnished"].map(opt => chipBtn("furnishing", opt, opt))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className={`${labelCls} mb-2`}>Additional Rooms</label>
        <div className="flex flex-wrap gap-2">
          {[{id:"poojaRoom",label:"Pooja Room"},{id:"servantRoom",label:"Servant Room"},{id:"store",label:"Store"},{id:"study",label:"Study"}].map(r => chipBtn("additionalRooms", r.id, r.label))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className={`${labelCls} mb-2`}>Overlooking</label>
        <div className="flex flex-wrap gap-2">
          {[{id:"gardenPark",label:"Garden/Park"},{id:"mainRoad",label:"Main Road"},{id:"pool",label:"Pool"}].map(item => chipBtn("overlooking", item.id, item.label))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className={`${labelCls} mb-2`}>Society Amenities</label>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {["Maintenance Staff","Air Conditioned","Park","Piped Gas","Power Back Up","Club House","Gymnasium","Intercom Facility","Internet/Wi-Fi Connectivity","Jogging and Strolling Track","Lift","Reserved Parking","Security","Swimming Pool","Waste Disposal"].map(a => chipBtn("societyAmenities", a, a))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className={`${labelCls} mb-2`}>Tenants You Prefer</label>
        <div className="flex flex-wrap gap-2">
          {[{id:"coupleFamily",label:"Couple/Family"},{id:"vegetarians",label:"Vegetarians"},{id:"withCompanyLease",label:"With Company Lease"},{id:"withoutPets",label:"Without Pets"}].map(t => chipBtn("tenantsPrefer", t.id, t.label))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Locality Description</label>
        <textarea value={editForm.localityDescription} onChange={e => setEditForm((p: any) => ({ ...p, localityDescription: e.target.value }))}
          rows={3} placeholder="Describe the locality..."
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200"}`} />
      </div>
    </>
  );
}

// ─── Photos Section ──────────────────────────────────────────────────────────

function PhotosSection({ isDark, editRoomImages, setEditRoomImages, editRoomNewFiles, setEditRoomNewFiles, editCatImages, setEditCatImages, editCatNewFiles, setEditCatNewFiles }: any) {
  const uploadLabel = `flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary transition-colors text-sm ${isDark ? "border-gray-600 text-gray-400 bg-gray-900" : "border-gray-300 text-gray-500 bg-white"}`;

  const renderPhotoGrid = (images: any[], onRemove: (i: number) => void, isRoom = false) => (
    images.length > 0 && (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
        {images.map((item: any, i: number) => {
          const src = isRoom ? item.image : item;
          if (!src) return null;
          return (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
              <Image src={src} alt={isRoom ? (item.name || `room ${i+1}`) : `photo ${i+1}`} fill className="object-cover" />
              {isRoom && <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 truncate">{item.name}</p>}
              <button type="button" onClick={() => onRemove(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
          );
        })}
      </div>
    )
  );

  const renderNewFilesGrid = (files: File[], onRemove: (i: number) => void) => (
    files.length > 0 && (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
        {files.map((file, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/40 group">
            <Image src={URL.createObjectURL(file)} alt={`new ${i+1}`} fill className="object-cover" />
            <button type="button" onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
          </div>
        ))}
      </div>
    )
  );

  const cats: { key: PhotoCat; label: string }[] = [
    { key: "kitchen", label: "Kitchen Photos" },
    { key: "washroom", label: "Washroom Photos" },
    { key: "commonArea", label: "Common Area Photos" },
  ];

  return (
    <div className={`rounded-xl p-4 sm:p-5 space-y-5 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
      <h3 className="text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-4 bg-primary rounded-full inline-block" />Photos
      </h3>
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Room Photos */}
        <div className="sm:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Room Photos</label>
          {renderPhotoGrid(editRoomImages, (i) => setEditRoomImages((prev: any[]) => prev.filter((_, idx) => idx !== i)), true)}
          {renderNewFilesGrid(editRoomNewFiles, (i) => setEditRoomNewFiles((prev: File[]) => prev.filter((_, idx) => idx !== i)))}
          <label className={uploadLabel}>
            <Plus className="w-4 h-4 text-primary" /> Add room photos
            <input type="file" accept="image/*" multiple className="hidden"
              onChange={e => { setEditRoomNewFiles((prev: File[]) => [...prev, ...Array.from(e.target.files||[])]); e.target.value=""; }} />
          </label>
        </div>

        {/* Category Photos */}
        {cats.map(({ key, label }) => (
          <div key={key} className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{label}</label>
            {renderPhotoGrid(editCatImages[key], (i) => setEditCatImages((p: any) => ({ ...p, [key]: p[key].filter((_: any, idx: number) => idx !== i) })))}
            {renderNewFilesGrid(editCatNewFiles[key], (i) => setEditCatNewFiles((p: any) => ({ ...p, [key]: p[key].filter((_: any, idx: number) => idx !== i) })))}
            <label className={uploadLabel}>
              <Plus className="w-4 h-4 text-primary" /> Add {label.toLowerCase()}
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={e => { setEditCatNewFiles((p: any) => ({ ...p, [key]: [...p[key], ...Array.from(e.target.files||[])] })); e.target.value=""; }} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
