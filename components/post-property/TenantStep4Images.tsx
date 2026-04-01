"use client";

import { X } from "lucide-react";

interface TenantRoomImageItem {
  id: string;
  name: string;
  file: File | null;
}

interface Props {
  t: Record<string, string>;
  FieldError: ({ name }: { name: string }) => JSX.Element | null;
  tenantRoomImages: TenantRoomImageItem[];
  addTenantRoomImage: () => void;
  removeTenantRoomImage: (id: string) => void;
  updateTenantRoomImage: (id: string, field: "name", value: string) => void;
  handleTenantRoomImageUpload: (id: string, file: File | null) => void;
  tenantKitchenImages: File[];
  setTenantKitchenImages: (fn: (prev: File[]) => File[]) => void;
  handleTenantKitchenImageUpload: (files: FileList | null) => void;
  tenantWashroomImages: File[];
  setTenantWashroomImages: (fn: (prev: File[]) => File[]) => void;
  handleTenantWashroomImageUpload: (files: FileList | null) => void;
  tenantCommonAreaImages: File[];
  setTenantCommonAreaImages: (fn: (prev: File[]) => File[]) => void;
  handleTenantCommonAreaImageUpload: (files: FileList | null) => void;
}

function UploadZone({ id, label, count, uploadLabel, onChange }: {
  id: string; label: string; count: number; uploadLabel: string;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-md font-semibold text-gray-800">{label}</h4>
      <div className="relative">
        <input type="file" id={id} accept="image/*" multiple onChange={(e) => onChange(e.target.files)} className="hidden" />
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">{uploadLabel}</span>
          <span className="text-xs text-gray-400 mt-0.5">Max 2MB per image</span>
          {count > 0 && <span className="text-xs text-green-600 mt-1">{count} images uploaded</span>}
        </label>
      </div>
    </div>
  );
}

export default function TenantStep4Images({
  t, FieldError,
  tenantRoomImages, addTenantRoomImage, removeTenantRoomImage, updateTenantRoomImage, handleTenantRoomImageUpload,
  tenantKitchenImages, setTenantKitchenImages, handleTenantKitchenImageUpload,
  tenantWashroomImages, setTenantWashroomImages, handleTenantWashroomImageUpload,
  tenantCommonAreaImages, setTenantCommonAreaImages, handleTenantCommonAreaImageUpload,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Room Images */}
      <div data-field="roomImages" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-md font-semibold text-gray-800">{t.tenantRoomsImages}</h4>
            <p className="text-xs text-gray-500">{t.tenantRoomsImagesSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={addTenantRoomImage}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
          >
            + {t.addRoom}
          </button>
        </div>
        <FieldError name="roomImages" />
        <div className="space-y-3">
          {tenantRoomImages.map((room) => (
            <div key={room.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t.roomName}</label>
                  <input
                    type="text"
                    value={room.name}
                    onChange={(e) => updateTenantRoomImage(room.id, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="e.g., Master Bedroom, Living Room"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t.uploadRoomImage} <span className="text-gray-400 font-normal">(max 2MB)</span></label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      id={`tenant-room-${room.id}`}
                      accept="image/*"
                      onChange={(e) => handleTenantRoomImageUpload(room.id, e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label
                      htmlFor={`tenant-room-${room.id}`}
                      className={`flex-1 px-3 py-2 text-center text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                        room.file ? "bg-green-100 text-green-700 border border-green-300" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {room.file ? "✓ Uploaded" : "Choose File"}
                    </label>
                    <button
                      type="button"
                      onClick={() => removeTenantRoomImage(room.id)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              {room.file && (
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <img src={URL.createObjectURL(room.file)} alt={room.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 px-3 py-1 rounded-lg bg-primary/90 text-white text-xs font-semibold">
                    {room.name}
                  </div>
                </div>
              )}
            </div>
          ))}
          {tenantRoomImages.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">No rooms added yet. Click "Add Room" to start.</div>
          )}
        </div>
      </div>

      {/* Kitchen Images */}
      <UploadZone id="tenant-kitchen-images" label={t.kitchenImages} count={tenantKitchenImages.length} uploadLabel={t.uploadImages} onChange={handleTenantKitchenImageUpload} />
      {tenantKitchenImages.length > 0 && (
        <div className="grid grid-cols-2 esm:grid-cols-3 gap-2">
          {tenantKitchenImages.map((file, index) => (
            <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
              <img src={URL.createObjectURL(file)} alt={`Kitchen ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setTenantKitchenImages((prev) => prev.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Washroom Images */}
      <UploadZone id="tenant-washroom-images" label={t.washroomImages} count={tenantWashroomImages.length} uploadLabel={t.uploadImages} onChange={handleTenantWashroomImageUpload} />
      {tenantWashroomImages.length > 0 && (
        <div className="grid grid-cols-2 esm:grid-cols-3 gap-2">
          {tenantWashroomImages.map((file, index) => (
            <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
              <img src={URL.createObjectURL(file)} alt={`Washroom ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setTenantWashroomImages((prev) => prev.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Common Area Images */}
      <UploadZone id="tenant-common-area-images" label={t.commonAreaImages} count={tenantCommonAreaImages.length} uploadLabel={t.uploadImages} onChange={handleTenantCommonAreaImageUpload} />
      {tenantCommonAreaImages.length > 0 && (
        <div className="grid grid-cols-2 esm:grid-cols-3 gap-2">
          {tenantCommonAreaImages.map((file, index) => (
            <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
              <img src={URL.createObjectURL(file)} alt={`Common Area ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setTenantCommonAreaImages((prev) => prev.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
