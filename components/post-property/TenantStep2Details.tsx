"use client";

interface Props {
  t: Record<string, string>;
  fieldErrors: Record<string, string>;
  FieldError: ({ name }: { name: string }) => JSX.Element | null;
  flatsInProject: string;
  setFlatsInProject: (v: string) => void;
  bedrooms: string;
  setBedrooms: (v: string) => void;
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
}

const countOptions = ["All", "1+", "2+", "3+", "4+"];
const floorOptions = ["G", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"];

export default function TenantStep2Details({
  t, fieldErrors, FieldError,
  flatsInProject, setFlatsInProject,
  bedrooms, setBedrooms,
  bathrooms, setBathrooms,
  balcony, setBalcony,
  totalFloors, setTotalFloors,
  floorNumber, setFloorNumber,
  furnishing, toggleFurnishing,
  areaMin, setAreaMin,
  areaMax, setAreaMax,
  societyName, setSocietyName,
}: Props) {
  return (
    <div className="space-y-4 pb-4 border-b border-gray-200">
      {/* Flats in project */}
      <div data-field="flatsInProject">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.flatsInProject}</label>
        <div className="grid grid-cols-1 esm:grid-cols-2 md:grid-cols-3 gap-3">
          {["<50", "50-100", ">100"].map((option) => (
            <button
              key={option}
              onClick={() => setFlatsInProject(option)}
              className={`py-3 px-4 border-2 rounded-xl transition-all ${
                flatsInProject === option
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <FieldError name="flatsInProject" />
      </div>

      {/* Bedrooms */}
      <div data-field="bedrooms">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.bedroom}</label>
        <div className="grid grid-cols-2 esm:grid-cols-3 md:grid-cols-5 gap-2">
          {countOptions.map((option) => (
            <button
              key={option}
              onClick={() => setBedrooms(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                bedrooms === option
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <FieldError name="bedrooms" />
      </div>

      {/* Bathrooms */}
      <div data-field="bathrooms">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.bathroom}</label>
        <div className="grid grid-cols-2 esm:grid-cols-3 md:grid-cols-5 gap-2">
          {countOptions.map((option) => (
            <button
              key={option}
              onClick={() => setBathrooms(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                bathrooms === option
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <FieldError name="bathrooms" />
      </div>

      {/* Balcony (optional) */}
      <div>
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-3">{t.balconyOptional}</label>
        <div className="grid grid-cols-2 esm:grid-cols-3 md:grid-cols-5 gap-2">
          {countOptions.map((option) => (
            <button
              key={option}
              onClick={() => setBalcony(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                balcony === option
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
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
            <button
              key={option}
              onClick={() => setTotalFloors(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                totalFloors === option
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
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
            <button
              key={option}
              onClick={() => setFloorNumber(option)}
              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                floorNumber === option
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
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
            <button
              key={option}
              onClick={() => toggleFurnishing(option)}
              className={`py-3 px-4 border-2 rounded-xl transition-all text-sm ${
                furnishing.includes(option)
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
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
            <input
              type="text"
              inputMode="numeric"
              value={areaMin}
              onChange={(e) => setAreaMin(e.target.value.replace(/\D/g, ""))}
              placeholder={t.enterMinArea}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t.max}</label>
            <input
              type="text"
              inputMode="numeric"
              value={areaMax}
              onChange={(e) => setAreaMax(e.target.value.replace(/\D/g, ""))}
              placeholder={t.enterMaxArea}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Society Name */}
      <div data-field="societyName">
        <label className="block text-sm sm:text-base text-gray-700 font-medium mb-2">{t.societyName}</label>
        <input
          type="text"
          value={societyName}
          onChange={(e) => setSocietyName(e.target.value)}
          placeholder={t.enterSocietyName}
          className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${fieldErrors.societyName ? "border-red-400" : "border-gray-200"}`}
        />
        <FieldError name="societyName" />
      </div>
    </div>
  );
}
