"use client";

import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

export interface TenantRoom {
  id: string;
  name: string;
  status: "Available" | "Occupied" | "Partial";
  rent: string;
  maxPersons: string;
  currentPersons: string;
}

interface Props {
  t: Record<string, string>;
  fieldErrors: Record<string, string>;
  FieldError: ({ name }: { name: string }) => JSX.Element | null;
  propertyCategory?: string;
  country?: string;
  flatsInProject: string;
  setFlatsInProject: (v: string) => void;
  bhk: string;
  setBhk: (v: string) => void;
  tenantRooms: TenantRoom[];
  setTenantRooms: (rooms: TenantRoom[]) => void;
  bathrooms: string;
  setBathrooms: (v: string) => void;
  balcony: string;
  setBalcony: (v: string) => void;
  totalFloors: string;
  setTotalFloors: (v: string) => void;
  floorNumber: string;
  setFloorNumber: (v: string) => void;
  furnishing: string[];
  toggleFurnishing: (item: string) => void;
  areaMin: string;
  setAreaMin: (v: string) => void;
  areaMax: string;
  setAreaMax: (v: string) => void;
  societyName: string;
  setSocietyName: (v: string) => void;
  currencySymbol: string;
}

const countOptions = ["All", "1+", "2+", "3+", "4+"];
const floorOptions = ["G", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"];
const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];

function bhkToRoomCount(bhk: string): number {
  if (bhk === "1 BHK") return 1;
  if (bhk === "2 BHK") return 2;
  if (bhk === "3 BHK") return 3;
  if (bhk === "4 BHK") return 4;
  if (bhk === "4+ BHK") return 4; // start with 4, allow adding more
  return 0;
}

function makeRoom(index: number): TenantRoom {
  return { id: `room-${Date.now()}-${index}`, name: `Room ${index + 1}`, status: "Available", rent: "", maxPersons: "1", currentPersons: "0" };
}

function deriveStatus(maxPersons: string, currentPersons: string): TenantRoom["status"] {
  const max = parseInt(maxPersons) || 1;
  const current = parseInt(currentPersons) || 0;
  if (current >= max) return "Occupied";
  if (current > 0) return "Partial";
  return "Available";
}

export default function TenantStep2Details({
  t, fieldErrors, FieldError,
  propertyCategory,
  country,
  flatsInProject, setFlatsInProject,
  bhk, setBhk,
  tenantRooms, setTenantRooms,
  bathrooms, setBathrooms,
  balcony, setBalcony,
  totalFloors, setTotalFloors,
  floorNumber, setFloorNumber,
  furnishing, toggleFurnishing,
  areaMin, setAreaMin,
  areaMax, setAreaMax,
  societyName, setSocietyName,
  currencySymbol,
}: Props) {

  // When BHK changes, reset rooms to match count — only for France
  useEffect(() => {
    if (!bhk) return;
    if (country !== "fr") {
      setTenantRooms([]);
      return;
    }
    const count = bhkToRoomCount(bhk);
    setTenantRooms(Array.from({ length: count }, (_, i) => makeRoom(i)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bhk, country]);

  const updateRoom = (id: string, field: keyof TenantRoom, value: string) => {
    setTenantRooms(tenantRooms.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      // Auto-derive status from persons
      if (field === "maxPersons" || field === "currentPersons") {
        updated.status = deriveStatus(
          field === "maxPersons" ? value : r.maxPersons,
          field === "currentPersons" ? value : r.currentPersons
        );
      }
      return updated;
    }));
  };

  const addRoom = () => {
    setTenantRooms([...tenantRooms, makeRoom(tenantRooms.length)]);
  };

  const removeRoom = (id: string) => {
    if (tenantRooms.length <= 1) return;
    setTenantRooms(tenantRooms.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4 pb-4 border-b border-gray-200">
      {/* Flats in project */}
      <div data-field="flatsInProject">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">
          No. of {propertyCategory ? `${propertyCategory}s` : "units"} in project/Society
        </label>
        <div className="grid grid-cols-1 esm:grid-cols-2 md:grid-cols-3 gap-3">
          {["<50", "50-100", ">100"].map((option) => (
            <button key={option} onClick={() => setFlatsInProject(option)}
              className={`py-3 px-4 border-2 rounded-xl transition-all ${flatsInProject === option ? "border-primary bg-primary/10 text-primary font-medium" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
              {option}
            </button>
          ))}
        </div>
        <FieldError name="flatsInProject" />
      </div>

      {/* BHK */}
      <div data-field="bhk">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.bhk}<span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 esm:grid-cols-3 md:grid-cols-5 gap-2">
          {bhkOptions.map((option) => (
            <button key={option} onClick={() => setBhk(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${bhk === option ? "border-primary bg-primary/10 text-primary font-medium" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
              {option}
            </button>
          ))}
        </div>
        <FieldError name="bhk" />
      </div>

      {/* Room Cards — shown after BHK is selected, only for France */}
      {country === "fr" && bhk && tenantRooms.length > 0 && (
        <div data-field="tenantRooms">
          <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">
            Room Details <span className="text-xs text-gray-400 font-normal">(based on {bhk})</span>
          </label>
          <div className="space-y-3">
            {tenantRooms.map((room, idx) => (
              <div key={room.id} className="border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">Room {idx + 1}</span>
                  {tenantRooms.length > 1 && (
                    <button onClick={() => removeRoom(room.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 esm:grid-cols-2 gap-3">
                  {/* Room Name */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Room Name</label>
                    <input type="text" value={room.name}
                      onChange={e => updateRoom(room.id, "name", e.target.value)}
                      placeholder="e.g. Master Bedroom"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white" />
                  </div>
                  {/* Rent */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Monthly Rent</label>
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-primary transition-colors bg-white">
                      <span className="px-3 py-2 text-gray-500 text-sm font-medium bg-gray-50 border-r border-gray-200 select-none">{currencySymbol}</span>
                      <input type="text" inputMode="numeric" value={room.rent}
                        onChange={e => updateRoom(room.id, "rent", e.target.value.replace(/\D/g, ""))}
                        placeholder="0"
                        className="flex-1 px-3 py-2 text-sm focus:outline-none bg-white" />
                    </div>
                  </div>
                  {/* Max Persons */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Persons Allowed</label>
                    <input type="text" inputMode="numeric" value={room.maxPersons}
                      onChange={e => updateRoom(room.id, "maxPersons", e.target.value.replace(/\D/g, "") || "1")}
                      placeholder="e.g. 2"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white" />
                  </div>
                  {/* Current Persons */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Current Persons in Room</label>
                    <input type="text" inputMode="numeric" value={room.currentPersons}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "");
                        const max = parseInt(room.maxPersons) || 1;
                        const clamped = Math.min(parseInt(val) || 0, max).toString();
                        updateRoom(room.id, "currentPersons", clamped);
                      }}
                      placeholder="0"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white" />
                  </div>
                </div>
                {/* Derived Status Badge */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Availability Status</label>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    room.status === "Available" ? "bg-green-50 text-green-700 border border-green-200" :
                    room.status === "Partial"   ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                                                  "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      room.status === "Available" ? "bg-green-500" :
                      room.status === "Partial"   ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                    {room.status}
                    <span className="text-gray-400 font-normal ml-1">
                      ({room.currentPersons || 0}/{room.maxPersons || 1} persons)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Room button — always shown for 4+ BHK, or if user wants more */}
          {bhk === "4+ BHK" && (
            <button onClick={addRoom}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-primary/40 rounded-xl text-primary text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all">
              <Plus className="w-4 h-4" /> Add Room
            </button>
          )}
        </div>
      )}

      {/* Bathrooms */}
      <div data-field="bathrooms">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.bathroom}</label>
        <div className="grid grid-cols-2 esm:grid-cols-3 md:grid-cols-5 gap-2">
          {countOptions.map((option) => (
            <button key={option} onClick={() => setBathrooms(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${bathrooms === option ? "border-primary bg-primary/10 text-primary font-medium" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
              {option}
            </button>
          ))}
        </div>
        <FieldError name="bathrooms" />
      </div>

      {/* Balcony */}
      <div>
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.balconyOptional}</label>
        <div className="grid grid-cols-2 esm:grid-cols-3 md:grid-cols-5 gap-2">
          {countOptions.map((option) => (
            <button key={option} onClick={() => setBalcony(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${balcony === option ? "border-primary bg-primary/10 text-primary font-medium" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Total Floors */}
      <div data-field="totalFloors">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.totalFloorsInBuilding}</label>
        <div className="grid grid-cols-3 esm:grid-cols-4 md:grid-cols-6 gap-2">
          {floorOptions.map((option) => (
            <button key={option} onClick={() => setTotalFloors(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${totalFloors === option ? "border-primary bg-primary/10 text-primary font-medium" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
              {option}
            </button>
          ))}
        </div>
        <FieldError name="totalFloors" />
      </div>

      {/* Floor Number */}
      <div data-field="floorNumber">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.floorNoOfProperty}</label>
        <div className="grid grid-cols-3 esm:grid-cols-4 md:grid-cols-6 gap-2">
          {floorOptions.map((option) => (
            <button key={option} onClick={() => setFloorNumber(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${floorNumber === option ? "border-primary bg-primary/10 text-primary font-medium" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
              {option}
            </button>
          ))}
        </div>
        <FieldError name="floorNumber" />
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.furnishingLabel}</label>
        <div className="grid grid-cols-1 esm:grid-cols-3 gap-3">
          {["Unfurnished", "Semi-Furnished", "Fully-Furnished"].map((option) => (
            <button key={option} onClick={() => toggleFurnishing(option)}
              className={`py-3 px-4 border-2 rounded-xl transition-all text-sm ${furnishing.includes(option) ? "border-primary bg-primary/10 text-primary font-medium" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
              {option === "Unfurnished" ? t.unfurnished : option === "Semi-Furnished" ? t.semiFurnished : t.fullyFurnished}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div>
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.areaLabel}</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t.min}</label>
            <input type="text" inputMode="numeric" value={areaMin} onChange={e => setAreaMin(e.target.value.replace(/\D/g, ""))}
              placeholder={t.enterMinArea} className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t.max}</label>
            <input type="text" inputMode="numeric" value={areaMax} onChange={e => setAreaMax(e.target.value.replace(/\D/g, ""))}
              placeholder={t.enterMaxArea} className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* Society Name */}
      <div data-field="societyName">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">{t.societyName}</label>
        <input type="text" value={societyName} onChange={e => setSocietyName(e.target.value)}
          placeholder={t.enterSocietyName}
          className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors.societyName ? "border-red-400" : "border-gray-200"}`} />
        <FieldError name="societyName" />
      </div>
    </div>
  );
}
