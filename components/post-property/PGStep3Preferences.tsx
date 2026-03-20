"use client";

import { Check } from "lucide-react";

type PreferredGender = "Male" | "Female" | "Both" | null;
type TenantPreference = "Professionals" | "Students" | "Both" | null;

interface Props {
  t: Record<string, string>;
  fieldErrors: Record<string, string>;
  FieldError: ({ name }: { name: string }) => JSX.Element | null;
  preferredGender: PreferredGender;
  setPreferredGender: (v: PreferredGender) => void;
  tenantPreference: TenantPreference;
  setTenantPreference: (v: TenantPreference) => void;
  pgRules: string[];
  togglePGRule: (rule: string) => void;
  noticePeriod: string;
  setNoticePeriod: (v: string) => void;
  gateClosingTime: string;
  setGateClosingTime: (v: string) => void;
  services: string[];
  toggleService: (s: string) => void;
  foodProvided: boolean;
  setFoodProvided: (v: boolean) => void;
  meals: string[];
  toggleMeal: (m: string) => void;
  vegNonVeg: string;
  setVegNonVeg: (v: string) => void;
  foodCharges: string;
  setFoodCharges: (v: string) => void;
  commonAmenities: string[];
  toggleCommonAmenity: (a: string) => void;
  parkingAvailable: boolean;
  setParkingAvailable: (v: boolean) => void;
  parkingType: string;
  setParkingType: (v: string) => void;
}

const pgRulesOptions = [
  { id: "guardian", label: "Guardian not allowed" },
  { id: "nonveg", label: "Non-Veg Food" },
  { id: "gender", label: "Opposite Gender" },
  { id: "alcohol", label: "Alcohol" },
  { id: "smoking", label: "Smoking" },
];

const servicesOptions = [
  { id: "laundry", label: "Laundry" },
  { id: "cleaning", label: "Room Cleaning" },
  { id: "warden", label: "Warden" },
];

const commonAmenitiesOptions = [
  { id: "fridge", label: "Fridge" },
  { id: "kitchen", label: "Kitchen for Self-cooking" },
  { id: "water", label: "RO Water" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "tv", label: "TV" },
  { id: "powerbackup", label: "Power Backup" },
  { id: "cctv", label: "CCTV" },
  { id: "gym", label: "Gymnasium" },
];

export default function PGStep3Preferences({
  t, fieldErrors, FieldError,
  preferredGender, setPreferredGender,
  tenantPreference, setTenantPreference,
  pgRules, togglePGRule,
  noticePeriod, setNoticePeriod,
  gateClosingTime, setGateClosingTime,
  services, toggleService,
  foodProvided, setFoodProvided,
  meals, toggleMeal,
  vegNonVeg, setVegNonVeg,
  foodCharges, setFoodCharges,
  commonAmenities, toggleCommonAmenity,
  parkingAvailable, setParkingAvailable,
  parkingType, setParkingType,
}: Props) {
  return (
    <>
      {/* Preferred Gender */}
      <div data-field="preferredGender" className="space-y-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{t.preferredGenderTitle}</h3>
        <div className="grid grid-cols-1 esm:grid-cols-3 gap-3">
          {(["Male", "Female", "Both"] as PreferredGender[]).map((gender) => (
            <button
              key={gender!}
              onClick={() => setPreferredGender(gender)}
              className={`py-3 px-4 border-2 rounded-xl transition-all ${
                preferredGender === gender
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {gender === "Male" ? t.male : gender === "Female" ? t.female : t.both}
            </button>
          ))}
        </div>
        <FieldError name="preferredGender" />
      </div>

      {/* Tenant Preferences */}
      <div data-field="tenantPreference" className="space-y-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{t.tenantPreferencesTitle}</h3>
        <div className="grid grid-cols-1 esm:grid-cols-3 gap-3">
          {(["Professionals", "Students", "Both"] as TenantPreference[]).map((pref) => (
            <button
              key={pref!}
              onClick={() => setTenantPreference(pref)}
              className={`py-3 px-4 border-2 rounded-xl transition-all ${
                tenantPreference === pref
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {pref === "Professionals" ? t.professionals : pref === "Students" ? t.students : t.both}
            </button>
          ))}
        </div>
        <FieldError name="tenantPreference" />
      </div>

      {/* PG Rules */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{t.pgRulesTitle}</h3>
        <div className="space-y-2">
          {[
            ...pgRulesOptions,
            ...pgRules
              .filter((r) => !pgRulesOptions.some((opt) => opt.id === r))
              .map((r) => ({ id: r, label: r })),
          ].map((rule) => (
            <button
              key={rule.id}
              onClick={() => togglePGRule(rule.id)}
              className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                pgRules.includes(rule.id) ? "border-primary bg-primary/10" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-gray-700 text-sm">{rule.label}</span>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${pgRules.includes(rule.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                {pgRules.includes(rule.id) && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Add custom rule"
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value && !pgRules.includes(value)) togglePGRule(value);
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
              if (value && !pgRules.includes(value)) togglePGRule(value);
              input.value = "";
            }}
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 esm:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">{t.noticePeriodTitle}</label>
            <select
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
            >
              <option value="">{t.noticePeriodPlaceholder}</option>
              <option value="1 Week">{t.oneWeek}</option>
              <option value="15 Days">{t.fifteenDays}</option>
              <option value="1 Month">{t.oneMonth}</option>
              <option value="2 Month">{t.twoMonths}</option>
              <option value="No Notice Period">{t.noNoticePeriod}</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">{t.gateClosingTitle}</label>
            <input
              type="time"
              value={gateClosingTime}
              onChange={(e) => setGateClosingTime(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{t.servicesTitle}</h3>
        <div className="space-y-2">
          {[
            ...servicesOptions,
            ...services
              .filter((s) => !servicesOptions.some((opt) => opt.id === s))
              .map((s) => ({ id: s, label: s })),
          ].map((service) => (
            <button
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                services.includes(service.id) ? "border-primary bg-primary/10" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-gray-700 text-sm">{service.label}</span>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${services.includes(service.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                {services.includes(service.id) && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. 24x7 Security, Cab service"
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value && !services.includes(value)) toggleService(value);
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
              if (value && !services.includes(value)) toggleService(value);
              input.value = "";
            }}
          >
            Add
          </button>
        </div>

        {/* Food Provided */}
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={foodProvided}
              onChange={(e) => setFoodProvided(e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
            <span className="text-gray-700 font-medium">{t.foodProvidedLabel}</span>
          </label>
        </div>
        {foodProvided && (
          <div className="space-y-3 mt-3 pl-8">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Meals</label>
              <div className="grid grid-cols-1 esm:grid-cols-2 md:grid-cols-3 gap-2">
                {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                  <button
                    key={meal}
                    onClick={() => toggleMeal(meal)}
                    className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                      meals.includes(meal)
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {meal === "Breakfast" ? t.breakfast : meal === "Lunch" ? t.lunch : t.dinner}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">{t.vegNonVegLabel}</label>
              <div className="grid grid-cols-1 esm:grid-cols-2 gap-2">
                {["Veg", "Veg & Non Veg"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setVegNonVeg(option)}
                    className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                      vegNonVeg === option
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {option === "Veg" ? t.veg : t.vegAndNonVeg}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">{t.foodChargesLabel}</label>
              <select
                value={foodCharges}
                onChange={(e) => setFoodCharges(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="">{t.selectCategoryPlaceholder}</option>
                <option value="Included in rent">{t.includedInRent}</option>
                <option value="Per meal Basis">{t.perMealBasis}</option>
                <option value="Fixed monthly Amount">{t.fixedMonthlyAmount}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Common Area Amenities */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{t.commonAreaTitle}</h3>
        <div className="grid grid-cols-1 esm:grid-cols-2 gap-2">
          {[
            ...commonAmenitiesOptions,
            ...commonAmenities
              .filter((a) => !commonAmenitiesOptions.some((opt) => opt.id === a))
              .map((a) => ({ id: a, label: a })),
          ].map((amenity) => (
            <button
              key={amenity.id}
              onClick={() => toggleCommonAmenity(amenity.id)}
              className={`flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                commonAmenities.includes(amenity.id) ? "border-primary bg-primary/10" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-sm text-gray-700">{amenity.label}</span>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${commonAmenities.includes(amenity.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                {commonAmenities.includes(amenity.id) && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. Terrace garden, Library room"
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value && !commonAmenities.includes(value)) toggleCommonAmenity(value);
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
              if (value && !commonAmenities.includes(value)) toggleCommonAmenity(value);
              input.value = "";
            }}
          >
            Add
          </button>
        </div>

        {/* Parking */}
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={parkingAvailable}
              onChange={(e) => setParkingAvailable(e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary rounded"
            />
            <span className="text-gray-700 font-medium">{t.parkingAvailability}</span>
          </label>
        </div>
        {parkingAvailable && (
          <div className="pl-8">
            <div className="grid grid-cols-1 esm:grid-cols-2 gap-2">
              {["2-Wheeler", "Car Parking"].map((option) => (
                <button
                  key={option}
                  onClick={() => setParkingType(option)}
                  className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                    parkingType === option
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {option === "2-Wheeler" ? t.twoWheeler : t.carParking}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
