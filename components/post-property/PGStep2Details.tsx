"use client";

import { Check } from "lucide-react";

type RoomCategory = "Single" | "Double" | "Triple" | "Four" | "Other";
type RoomDetails = {
  totalRooms: string;
  availableRooms: string;
  monthlyRent: string;
  securityDeposit: string;
  facilities: string[];
};
type PGPresentIn = "An Independent Building" | "An Independent Flats" | "Present In A Society" | null;

interface Props {
  t: Record<string, string>;
  currencySymbol: string;
  fieldErrors: Record<string, string>;
  FieldError: ({ name }: { name: string }) => JSX.Element | null;
  // PG fields
  operationalSince: string;
  setOperationalSince: (v: string) => void;
  pgPresentIn: PGPresentIn;
  setPgPresentIn: (v: PGPresentIn) => void;
  pgName: string;
  setPgName: (v: string) => void;
  selectedRoomCategories: RoomCategory[];
  toggleRoomCategory: (c: RoomCategory) => void;
  roomDetails: Record<RoomCategory, RoomDetails>;
  updateRoomDetail: (category: RoomCategory, field: keyof RoomDetails, value: string | string[]) => void;
  toggleFacility: (category: RoomCategory, facility: string) => void;
}

const roomFacilities = [
  { id: "bed", label: "Bed" },
  { id: "washroom", label: "Attached Washroom" },
  { id: "cupboard", label: "Cupboard" },
  { id: "table", label: "Table" },
  { id: "tv", label: "TV" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "mattress", label: "Mattress" },
  { id: "aircooler", label: "Air Cooler" },
];

export default function PGStep2Details({
  t, currencySymbol, fieldErrors, FieldError,
  operationalSince, setOperationalSince,
  pgPresentIn, setPgPresentIn,
  pgName, setPgName,
  selectedRoomCategories, toggleRoomCategory,
  roomDetails, updateRoomDetail, toggleFacility,
}: Props) {
  return (
    <>
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <div data-field="operationalSince">
          <label className="block text-gray-700 font-medium mb-2">
            {t.operationalLabel}<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={operationalSince}
            onChange={(e) => setOperationalSince(e.target.value)}
            placeholder={t.operationalPlaceholder}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors.operationalSince ? "border-red-400" : "border-gray-200"}`}
          />
          <FieldError name="operationalSince" />
        </div>

        <div data-field="pgPresentIn">
          <label className="block text-gray-700 font-medium mb-2">
            {t.presentInLabel}<span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {[
              { value: "An Independent Building", label: t.independentBuilding },
              { value: "An Independent Flats", label: t.independentFlats },
              { value: "Present In A Society", label: t.pgSociety },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-4 p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${pgPresentIn === option.value ? "border-primary bg-primary/10" : "border-gray-200"}`}
              >
                <input
                  type="radio"
                  name="pgPresentIn"
                  value={option.value}
                  checked={pgPresentIn === option.value}
                  onChange={(e) => setPgPresentIn(e.target.value as PGPresentIn)}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <span className="text-base font-medium text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          <FieldError name="pgPresentIn" />
        </div>

        <div data-field="pgName">
          <label className="block text-gray-700 font-medium mb-2">
            {t.pgNameLabel}<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={pgName}
            onChange={(e) => setPgName(e.target.value)}
            placeholder={t.pgNamePlaceholder}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors.pgName ? "border-red-400" : "border-gray-200"}`}
          />
          <FieldError name="pgName" />
        </div>
      </div>

      {/* Room Categories */}
      <div data-field="selectedRoomCategories" className="space-y-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{t.roomCategoriesTitle}</h3>
        <p className="text-sm text-gray-600">{t.roomCategoriesSubtitle}</p>
        <div className="grid grid-cols-1 esm:grid-cols-2 md:grid-cols-3 gap-3">
          {(["Single", "Double", "Triple", "Four", "Other"] as RoomCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => toggleRoomCategory(category)}
              className={`py-3 px-4 border-2 rounded-xl transition-all ${
                selectedRoomCategories.includes(category)
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {category === "Single" ? t.single : category === "Double" ? t.double : category === "Triple" ? t.triple : category === "Four" ? t.four : t.other}
            </button>
          ))}
        </div>
        <FieldError name="selectedRoomCategories" />
      </div>

      {/* Room Details per category */}
      {selectedRoomCategories.map((category) => (
        <div key={category} className="space-y-4 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-primary">
            {t.roomDetailsFor} {category} {t.roomCategoriesTitle.split(" ")[0]}
          </h3>
          <div className="grid grid-cols-1 esm:grid-cols-2 gap-3">
            <div data-field={`room_${category}_totalRooms`}>
              <label className="block text-gray-700 font-medium mb-2">Total Rooms<span className="text-red-500">*</span></label>
              <input
                type="text"
                inputMode="numeric"
                value={roomDetails[category].totalRooms}
                onChange={(e) => updateRoomDetail(category, "totalRooms", e.target.value.replace(/\D/g, ""))}
                placeholder="Enter total rooms"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors[`room_${category}_totalRooms`] ? "border-red-400" : "border-gray-200"}`}
              />
              <FieldError name={`room_${category}_totalRooms`} />
            </div>
            <div data-field={`room_${category}_availableRooms`}>
              <label className="block text-gray-700 font-medium mb-2">Available Rooms<span className="text-red-500">*</span></label>
              <input
                type="text"
                inputMode="numeric"
                value={roomDetails[category].availableRooms}
                onChange={(e) => updateRoomDetail(category, "availableRooms", e.target.value.replace(/\D/g, ""))}
                placeholder="Enter available rooms"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors[`room_${category}_availableRooms`] ? "border-red-400" : "border-gray-200"}`}
              />
              <FieldError name={`room_${category}_availableRooms`} />
            </div>
          </div>
          <div className="grid grid-cols-1 esm:grid-cols-2 gap-3">
            <div data-field={`room_${category}_monthlyRent`}>
              <label className="block text-gray-700 font-medium mb-2">{t.monthlyRent}<span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={roomDetails[category].monthlyRent}
                  onChange={(e) => updateRoomDetail(category, "monthlyRent", e.target.value.replace(/\D/g, ""))}
                  placeholder={t.monthlyRentPlaceholder}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors[`room_${category}_monthlyRent`] ? "border-red-400" : "border-gray-200"}`}
                />
              </div>
              <FieldError name={`room_${category}_monthlyRent`} />
            </div>
            <div data-field={`room_${category}_securityDeposit`}>
              <label className="block text-gray-700 font-medium mb-2">{t.securityDeposit}<span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={roomDetails[category].securityDeposit}
                  onChange={(e) => updateRoomDetail(category, "securityDeposit", e.target.value.replace(/\D/g, ""))}
                  placeholder={t.securityDepositPlaceholder}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors[`room_${category}_securityDeposit`] ? "border-red-400" : "border-gray-200"}`}
                />
              </div>
              <FieldError name={`room_${category}_securityDeposit`} />
            </div>
          </div>

          {/* Room Facilities */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">{t.roomFacilities}</label>
            <div className="grid grid-cols-1 esm:grid-cols-2 gap-2">
              {[
                ...roomFacilities,
                ...roomDetails[category].facilities
                  .filter((f) => !roomFacilities.some((rf) => rf.id === f))
                  .map((f) => ({ id: f, label: f })),
              ].map((facility) => (
                <button
                  key={facility.id}
                  onClick={() => toggleFacility(category, facility.id)}
                  className={`flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                    roomDetails[category].facilities.includes(facility.id)
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm text-gray-700">{facility.label}</span>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${roomDetails[category].facilities.includes(facility.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                    {roomDetails[category].facilities.includes(facility.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Add extra facilities</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. Study table, Balcony access"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (!value || roomDetails[category].facilities.includes(value)) return;
                      updateRoomDetail(category, "facilities", [...roomDetails[category].facilities, value]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement | null;
                    if (!input) return;
                    const value = input.value.trim();
                    if (!value || roomDetails[category].facilities.includes(value)) return;
                    updateRoomDetail(category, "facilities", [...roomDetails[category].facilities, value]);
                    input.value = "";
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
