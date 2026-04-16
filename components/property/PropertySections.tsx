"use client";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { MapPin, Heart } from "lucide-react";
import ReviewSection from "@/components/ReviewSection";

// Reusable tag-list card
function TagList({ title, items, dotColor = "bg-green-500" }: { title: string; items: string[]; dotColor?: string }) {
  if (!items.length) return null;
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${dotColor} rounded-full flex-shrink-0`} />
            <span className="text-xs sm:text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  property: any;
  language: string;
  currencySymbol: string;
  monthText: string;
  t: Record<string, string>;
  propertyId: string;
  country: string;
  relatedProperties: any[];
  amenitiesList: string[];
  rulesDisplay: Record<string, string>;
  servicesArray: string[];
  servicesDisplay: Record<string, string>;
}

export default function PropertySections({
  property, language, currencySymbol, monthText, t, propertyId, country,
  relatedProperties, amenitiesList, rulesDisplay, servicesArray, servicesDisplay,
}: Props) {
  return (
    <>
      {/* PG Room Details */}
      {property.propertyType === "PG" && property.roomDetails && Object.keys(property.roomDetails).length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4 uppercase tracking-wide">
            {language === "fr" ? "Détails des chambres" : "Room Details"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(property.roomDetails as Record<string, any>).map(([category, detail]) => (
              <div key={category} className="border border-gray-200 rounded-xl p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900 text-base">{category} Bed</h4>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {detail.availableBeds ?? detail.availableRooms ?? "—"} {language === "fr" ? "dispo" : "available"}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{language === "fr" ? "Total lits" : "Total Beds"}</span>
                    <span className="font-semibold text-gray-900">{detail.totalBeds ?? detail.totalRooms ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t.monthlyRent}</span>
                    <span className="font-bold text-primary">{currencySymbol} {Number(detail.monthlyRent).toLocaleString()}</span>
                  </div>
                  {detail.securityDeposit && Number(detail.securityDeposit) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t.deposit}</span>
                      <span className="font-semibold text-gray-900">{currencySymbol} {Number(detail.securityDeposit).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                {detail.facilities?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                    {detail.facilities.map((f: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">{f}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tenant Room Details (FR) */}
      {property.propertyType === "Tenant" && property.country === "fr" && property.tenantRooms?.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4 uppercase tracking-wide">
            {language === "fr" ? "Détails des chambres" : "Room Details"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {(property.tenantRooms as any[]).map((room: any, i: number) => {
              const max = parseInt(room.maxPersons) || 1;
              const current = parseInt(room.currentPersons) || 0;
              const available = max - current;
              const status: "Available" | "Partial" | "Occupied" = current >= max ? "Occupied" : current > 0 ? "Partial" : "Available";
              const statusColor = status === "Available" ? "bg-green-50 text-green-700 border-green-200" : status === "Partial" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-red-50 text-red-600 border-red-200";
              const dotColor = status === "Available" ? "bg-green-500" : status === "Partial" ? "bg-yellow-500" : "bg-red-500";
              return (
                <div key={room.id ?? i} className="border border-gray-200 rounded-xl p-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900 text-base">{room.name || `Room ${i + 1}`}</h4>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />{status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {room.rent && Number(room.rent) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{t.monthlyRent}</span>
                        <span className="font-bold text-primary">{currencySymbol} {Number(room.rent).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{language === "fr" ? "Capacité" : "Capacity"}</span>
                      <span className="font-semibold text-gray-900">{current} / {max} {language === "fr" ? "personnes" : "persons"}</span>
                    </div>
                    {status !== "Occupied" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{language === "fr" ? "Places disponibles" : "Spots available"}</span>
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

      {/* USP */}
      {property.uspText && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center gap-2 mb-2">
            {property.uspCategory && (
              <span className="px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full capitalize">{property.uspCategory}</span>
            )}
            <h3 className="text-xs sm:text-sm font-semibold text-primary">{t.usp}</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{property.uspText}</p>
        </div>
      )}

      {/* Property Details grid */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.propertyDetails}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { label: t.propertyType, value: property.propertyType, badge: true },
            { label: t.category, value: property.category },
            property.propertyType === "PG" && (property.pgFor || property.preferredGender) && { label: t.pgFor, value: property.pgFor || property.preferredGender },
            property.propertyType === "PG" && (property.preferredTenants || property.tenantPreference) && { label: t.preferredTenants, value: property.preferredTenants || property.tenantPreference },
            (property.propertyType === "PG" || property.country !== "fr") && { label: t.rooms, value: property.rooms },
            { label: t.bathrooms, value: property.bathrooms },
            { label: t.size, value: `${property.area} m²` },
            !(property.propertyType === "Tenant" && property.country === "fr") && { label: t.rent, value: `${currencySymbol} ${property.price}` },
            { label: t.deposit, value: `${currencySymbol} ${property.deposit}` },
            { label: t.availableFrom, value: property.availableFrom, green: true },
            property.propertyType === "Tenant" && property.bhk && { label: "BHK", value: property.bhk },
            property.propertyType === "Tenant" && property.country !== "fr" && property.balcony && { label: t.balcony, value: property.balcony },
            property.propertyType === "Tenant" && property.country !== "fr" && property.totalFloors && { label: t.totalFloors, value: property.totalFloors },
            property.propertyType === "Tenant" && property.country !== "fr" && property.floorNumber && { label: t.floorNumber, value: property.floorNumber },
            property.propertyType === "Tenant" && property.country !== "fr" && property.furnishing?.length > 0 && { label: t.furnishing, value: property.furnishing.join(", ") },
            property.propertyType === "Tenant" && property.country !== "fr" && property.facing && { label: t.facing, value: property.facing },
            property.propertyType === "Tenant" && property.maintenanceCharges && { label: t.maintenanceCharges, value: `${currencySymbol} ${property.maintenanceCharges}${property.maintenanceType ? ` (${property.maintenanceType})` : ""}` },
          ].filter(Boolean).map((row: any) => (
            <div key={row.label} className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
              <span className="text-sm sm:text-base text-gray-600">{row.label}</span>
              {row.badge ? (
                <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${property.propertyType === "PG" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{row.value}</span>
              ) : (
                <span className={`text-sm sm:text-base font-semibold ${row.green ? "text-green-600" : "text-gray-900"}`}>{row.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tenant-only sections */}
      {property.propertyType === "Tenant" && (
        <>
          <TagList title={t.additionalRooms} items={property.additionalRooms || []} />
          <TagList title={t.overlooking} items={property.overlooking || []} dotColor="bg-blue-400" />
          <TagList title={t.tenantsPrefer} items={property.tenantsPrefer || []} dotColor="bg-primary" />
          {property.localityDescription && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.localityDescription}</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{property.localityDescription}</p>
            </div>
          )}
        </>
      )}

      {/* Nearby Places */}
      {property.nearbyPlaces?.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">
            {language === "fr" ? "LIEUX À PROXIMITÉ" : "NEARBY PLACES"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {property.nearbyPlaces.map((place: any, i: number) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs sm:text-sm font-medium">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {typeof place === "string" ? place : place.name}
                {typeof place !== "string" && place.distance && <span className="text-blue-500 font-normal">· {place.distance}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Amenities */}
      <TagList title={t.amenities} items={amenitiesList} />

      {/* PG Rules */}
      {property.propertyType === "PG" && property.pgRules?.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.rules}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {property.pgRules.map((rule: string, i: number) => {
              const ruleLabels: Record<string, string> = { guardian: "Guardian not allowed", nonveg: "Non-Veg Food not allowed", gender: "Opposite Gender not allowed", alcohol: "Alcohol not allowed", smoking: "Smoking not allowed" };
              return (
                <div key={i} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">{ruleLabels[rule] || rule}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tenant Rules */}
      {property.propertyType === "Tenant" && Object.keys(rulesDisplay).length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.rules}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(rulesDisplay).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                <span className="text-sm sm:text-base text-gray-600 capitalize">{key}</span>
                <span className={`text-sm sm:text-base font-semibold ${val === "Allowed" ? "text-green-600" : val === "Not Allowed" ? "text-red-600" : "text-gray-900"}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      {(servicesArray.length > 0 || Object.keys(servicesDisplay).length > 0) && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.services}</h3>
          {servicesArray.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {servicesArray.map((service, i) => {
                const labels: Record<string, string> = { laundry: "Laundry", cleaning: "Room Cleaning", warden: "Warden" };
                return (
                  <div key={i} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">{labels[service] || service}</span>
                  </div>
                );
              })}
            </div>
          )}
          {Object.keys(servicesDisplay).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(servicesDisplay).map(([key, val]) => (
                <div key={key} className="flex justify-between py-2 sm:py-3 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600 capitalize">{key}</span>
                  <span className={`text-sm sm:text-base font-semibold ${val === "Included" || val === "Daily" ? "text-green-600" : "text-gray-900"}`}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Food (PG) */}
      {property.propertyType === "PG" && property.foodProvided && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.meals}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {property.meals?.map((meal: string, i: number) => (
              <div key={i} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">{meal}</span>
              </div>
            ))}
            {property.vegNonVeg && (
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">{property.vegNonVeg}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 sm:mb-4">{t.map}</h3>
        <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-700 line-clamp-2">{property.fullAddress}</span>
        </div>
        {(() => {
          const embedSrc = property.latitude && property.longitude
            ? `https://maps.google.com/maps?q=${encodeURIComponent(property.latitude)},${encodeURIComponent(property.longitude)}&z=15&output=embed`
            : `https://maps.google.com/maps?q=${encodeURIComponent([property.fullAddress, property.areaName, property.state, property.location].filter(Boolean).join(", "))}&output=embed`;
          return (
            <div className="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden">
              <iframe src={embedSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          );
        })()}
        {property.latitude && property.longitude && (
          <a href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs sm:text-sm text-primary hover:underline">
            <MapPin className="w-3.5 h-3.5" />Open in Google Maps
          </a>
        )}
      </div>

      {/* Reviews */}
      <ReviewSection propertyId={propertyId} language={language} country={country} />

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">{t.relatedListings}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {relatedProperties.map((rel: any) => (
              <Link key={rel._id} href={`/property/${rel._id}`} className="group">
                <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                  <Image src={rel.images?.[0] || ""} alt={rel.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  <button aria-label="Save to favorites" className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-700" />
                  </button>
                  {rel.propertyType && (
                    <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${rel.propertyType === "PG" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}>{rel.propertyType}</span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">{rel.propertyType === "PG" ? rel.pgName : rel.societyName}</h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">{rel.location}</p>
                <p className="text-lg font-bold text-primary">{currencySymbol} {rel.price} <span className="text-sm font-normal text-gray-600">/ {monthText}</span></p>
              </Link>
            ))}
          </div>
          <Link href="/properties">
            <button className="w-full py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300">{t.viewMore}</button>
          </Link>
        </div>
      )}
    </>
  );
}
