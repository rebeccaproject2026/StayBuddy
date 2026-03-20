"use client";

import { Check } from "lucide-react";

interface Props {
  t: Record<string, string>;
  currencySymbol: string;
  fieldErrors: Record<string, string>;
  FieldError: ({ name }: { name: string }) => JSX.Element | null;
  monthlyRentAmount: string;
  setMonthlyRentAmount: (v: string) => void;
  securityAmount: string;
  setSecurityAmount: (v: string) => void;
  maintenanceCharges: string;
  setMaintenanceCharges: (v: string) => void;
  maintenanceType: string;
  setMaintenanceType: (v: string) => void;
  availableFrom: string;
  setAvailableFrom: (v: string) => void;
  availableDate: string;
  setAvailableDate: (v: string) => void;
  additionalRooms: string[];
  toggleAdditionalRoom: (r: string) => void;
  overlooking: string[];
  toggleOverlooking: (item: string) => void;
  facing: string;
  setFacing: (v: string) => void;
  societyAmenities: string[];
  toggleSocietyAmenity: (a: string) => void;
  tenantsPrefer: string[];
  toggleTenantPrefer: (t: string) => void;
  localityDescription: string;
  setLocalityDescription: (v: string) => void;
}

const societyAmenitiesList = [
  "Maintenance Staff", "Air Conditioned", "Outdoor Tennis Courts", "Banquet Hall",
  "Park", "Bar/Lounge", "Piped Gas", "Cafeteria/Food Court", "Power Back Up",
  "Club House", "Private Terrace/Garden", "Conference Room", "RO Water System",
  "DTH Television Facility", "Rain Water Harvesting", "Gymnasium", "Reserved Parking",
  "Intercom Facility", "Security", "Internet/Wi-Fi Connectivity", "Service/Good Lift",
  "Jogging and Strolling Track", "Swimming Pool", "Laundry Service", "Vaastu Compliant",
  "Lift", "Waste Disposal",
];

export default function TenantStep3Pricing({
  t, currencySymbol, fieldErrors, FieldError,
  monthlyRentAmount, setMonthlyRentAmount,
  securityAmount, setSecurityAmount,
  maintenanceCharges, setMaintenanceCharges,
  maintenanceType, setMaintenanceType,
  availableFrom, setAvailableFrom,
  availableDate, setAvailableDate,
  additionalRooms, toggleAdditionalRoom,
  overlooking, toggleOverlooking,
  facing, setFacing,
  societyAmenities, toggleSocietyAmenity,
  tenantsPrefer, toggleTenantPrefer,
  localityDescription, setLocalityDescription,
}: Props) {
  return (
    <>
      {/* Price */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{t.priceExpectTitle}</h3>
        <div data-field="monthlyRentAmount">
          <label className="block text-gray-700 font-medium mb-2">
            {t.monthlyRentLabel}<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-lg">{currencySymbol}</span>
            <input
              type="text"
              value={monthlyRentAmount}
              onChange={(e) => setMonthlyRentAmount(e.target.value)}
              placeholder={t.enterMonthlyRent}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors text-lg ${fieldErrors.monthlyRentAmount ? "border-red-400" : "border-gray-200"}`}
            />
          </div>
          <FieldError name="monthlyRentAmount" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">{t.securityAmountOptional}</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
            <input
              type="text"
              value={securityAmount}
              onChange={(e) => setSecurityAmount(e.target.value)}
              placeholder={t.enterSecurityAmount}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">{t.maintenanceChargesOptional}</label>
          <div className="grid grid-cols-1 esm:grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
              <input
                type="text"
                value={maintenanceCharges}
                onChange={(e) => setMaintenanceCharges(e.target.value)}
                placeholder={t.enterSecurityAmount}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <select
              value={maintenanceType}
              onChange={(e) => setMaintenanceType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
            >
              <option value="">{t.selectMaintenanceType}</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{t.statusOfProperty}</h3>
        <div>
          <label className="block text-gray-700 font-medium mb-3">{t.availableFrom}</label>
          <div className="grid grid-cols-1 esm:grid-cols-2 gap-3">
            {["Selected Date", "Immediately"].map((option) => (
              <button
                key={option}
                onClick={() => setAvailableFrom(option)}
                className={`py-3 px-4 border-2 rounded-xl transition-all ${
                  availableFrom === option
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {option === "Selected Date" ? t.selectedDate : t.immediately}
              </button>
            ))}
          </div>
        </div>
        {availableFrom === "Selected Date" && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">{t.availableDate}</label>
            <input
              type="date"
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}
      </div>

      {/* Additional Details */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{t.additionalDetailsTitle}</h3>

        {/* Additional Rooms */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">{t.additionalRooms}</label>
          <div className="space-y-2">
            {[
              { id: "poojaRoom", label: t.poojaRoom },
              { id: "servantRoom", label: t.servantRoom },
              { id: "store", label: t.store },
              { id: "study", label: t.study },
            ].map((room) => (
              <button
                key={room.id}
                onClick={() => toggleAdditionalRoom(room.id)}
                className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                  additionalRooms.includes(room.id) ? "border-primary bg-primary/10" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-gray-700">{room.label}</span>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${additionalRooms.includes(room.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                  {additionalRooms.includes(room.id) && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Overlooking */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">{t.overlookingLabel}</label>
          <div className="space-y-2">
            {[
              { id: "gardenPark", label: t.gardenPark },
              { id: "mainRoad", label: t.mainRoad },
              { id: "pool", label: t.pool },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => toggleOverlooking(item.id)}
                className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                  overlooking.includes(item.id) ? "border-primary bg-primary/10" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-gray-700">{item.label}</span>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${overlooking.includes(item.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                  {overlooking.includes(item.id) && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Facing */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">{t.facingLabel}</label>
          <div className="grid grid-cols-2 esm:grid-cols-3 md:grid-cols-4 gap-2">
            {["East", "North", "North-East", "North-West", "South", "South-East", "South-West", "West"].map((direction) => (
              <button
                key={direction}
                onClick={() => setFacing(direction)}
                className={`py-2 px-2 border-2 rounded-xl transition-all text-xs ${
                  facing === direction
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {direction}
              </button>
            ))}
          </div>
        </div>

        {/* Society Amenities */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">{t.societyAmenitiesLabel}</label>
          <div className="grid grid-cols-1 esm:grid-cols-2 gap-2">
            {societyAmenitiesList.map((amenity) => (
              <button
                key={amenity}
                onClick={() => toggleSocietyAmenity(amenity)}
                className={`flex items-center justify-between p-2 border-2 rounded-xl transition-all text-xs ${
                  societyAmenities.includes(amenity) ? "border-primary bg-primary/10" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-gray-700 text-left">{amenity}</span>
                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ml-1 ${societyAmenities.includes(amenity) ? "bg-primary" : "border-2 border-gray-300"}`}>
                  {societyAmenities.includes(amenity) && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tenants Prefer */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">{t.tenantsYouPrefer}</label>
          <div className="space-y-2">
            {[
              { id: "coupleFamily", label: t.coupleFamily },
              { id: "vegetarians", label: t.vegetarians },
              { id: "withCompanyLease", label: t.withCompanyLease },
              { id: "withoutPets", label: t.withoutPets },
            ].map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => toggleTenantPrefer(tenant.id)}
                className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                  tenantsPrefer.includes(tenant.id) ? "border-primary bg-primary/10" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-gray-700">{tenant.label}</span>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${tenantsPrefer.includes(tenant.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                  {tenantsPrefer.includes(tenant.id) && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Locality Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">{t.localityDescriptionLabel}</label>
          <textarea
            value={localityDescription}
            onChange={(e) => setLocalityDescription(e.target.value)}
            placeholder={t.localityDescriptionPlaceholder}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
      </div>
    </>
  );
}
