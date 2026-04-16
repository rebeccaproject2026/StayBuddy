"use client";
import Link from "@/components/LocalizedLink";
import { Share2, Phone } from "lucide-react";

interface Props {
  property: any;
  language: string;
  currencySymbol: string;
  t: Record<string, string>;
  isOwner: boolean;
  isAuthenticated: boolean;
  user: any;
  country: string;
  propertyId: string;
  isMobile?: boolean;
  onContact: () => void;
  onShare: () => void;
  onReport: () => void;
  onLoginRedirect: (reason?: string) => void;
}

function RoomTypePricing({ property, currencySymbol, language }: { property: any; currencySymbol: string; language: string }) {
  return (
    <>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
        {language === "fr" ? "Prix par type de chambre" : "Price by Room Type"}
      </p>
      <div className="space-y-2 mb-3">
        {Object.entries(property.roomDetails as Record<string, any>).map(([category, detail]) => (
          <div key={category} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">{category} Bed</span>
              {(detail.availableBeds ?? detail.availableRooms) && (
                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full flex-shrink-0">
                  {detail.availableBeds ?? detail.availableRooms} {language === "fr" ? "dispo" : "avail."}
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-primary flex-shrink-0 ml-2">
              {currencySymbol} {Number(detail.monthlyRent).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function TenantRoomPricing({ property, currencySymbol, language }: { property: any; currencySymbol: string; language: string }) {
  return (
    <>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
        {language === "fr" ? "Prix par chambre" : "Price by Room"}
      </p>
      <div className="space-y-2 mb-3">
        {(property.tenantRooms as any[]).map((room: any, i: number) => {
          const max = parseInt(room.maxPersons) || 1;
          const current = parseInt(room.currentPersons) || 0;
          const status = current >= max ? "Occupied" : current > 0 ? "Partial" : "Available";
          const statusCls = status === "Available" ? "bg-green-100 text-green-700" : status === "Partial" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600";
          const dotCls = status === "Available" ? "bg-green-500" : status === "Partial" ? "bg-yellow-500" : "bg-red-500";
          return (
            <div key={room.id ?? i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotCls}`} />
                <span className="text-sm font-medium text-gray-700 truncate">{room.name || `Room ${i + 1}`}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusCls}`}>{status}</span>
              </div>
              {room.rent && Number(room.rent) > 0
                ? <span className="text-sm font-bold text-primary ml-2 flex-shrink-0">{currencySymbol} {Number(room.rent).toLocaleString()}</span>
                : <span className="text-xs text-gray-400 ml-2 flex-shrink-0">—</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function PricingCard({
  property, language, currencySymbol, t, isOwner, isAuthenticated, user, country, propertyId,
  isMobile, onContact, onShare, onReport, onLoginRedirect,
}: Props) {
  const isPGWithRooms = property.propertyType === "PG" && property.roomDetails && Object.keys(property.roomDetails).length > 0;
  const isFrTenant = property.propertyType === "Tenant" && property.country === "fr" && property.tenantRooms?.length > 0;
  const hasPhone = !!(property.ownerPhone || property.landlord?.phone);

  return (
    <div className={`bg-white rounded-xl shadow-lg ${isMobile ? "p-4 sm:p-5 mb-2" : "p-5 md:p-6 mb-6"}`}>
      {/* Pricing */}
      {isPGWithRooms ? (
        <RoomTypePricing property={property} currencySymbol={currencySymbol} language={language} />
      ) : isFrTenant ? (
        <TenantRoomPricing property={property} currencySymbol={currencySymbol} language={language} />
      ) : (
        <>
          <p className={`text-xs ${isMobile ? "" : "sm:text-sm"} text-gray-600 mb-1`}>{t.monthlyRent}</p>
          <p className={`${isMobile ? "text-3xl" : "text-2xl sm:text-3xl md:text-4xl"} font-bold text-gray-900 mb-1`}>{currencySymbol} {property.price}</p>
        </>
      )}
      <p className="text-xs text-gray-500 mb-3">{t.securityDeposit}: {currencySymbol} {property.deposit}</p>

      {/* Budget bar */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-1.5">
          {t.budgetFriendly} <span className="text-green-600">{t.belowAverage}</span>
        </p>
        <div className="w-full h-1.5 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-1.5" />
        <p className="text-xs text-gray-500">{t.priceDescription}</p>
      </div>

      {/* Rental info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">{t.rentalPeriod}</span>
          <span className="text-xs font-semibold text-green-600">{property.rentalPeriod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">{t.availableFrom}</span>
          <span className="text-xs font-semibold text-green-600">{property.availableFrom}</span>
        </div>
      </div>

      {/* Action buttons — desktop only */}
      {!isMobile && !isOwner && (
        <>
          <button onClick={onContact}
            className="w-full py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors mb-3">
            {t.contactOwner}
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) { onLoginRedirect("call"); return; }
              const phone = property.ownerPhone || property.landlord?.phone;
              if (phone) window.location.href = `tel:${phone}`;
            }}
            className={`w-full py-2.5 sm:py-3 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors mb-3 flex items-center justify-center gap-2 ${hasPhone ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            {language === "fr" ? "Appeler le propriétaire" : "Call Owner"}
          </button>
          <button onClick={onShare}
            className="w-full py-2.5 sm:py-3 border-2 border-gray-300 hover:border-primary text-gray-700 text-sm sm:text-base font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />{t.share}
          </button>
        </>
      )}

      {/* Report concern */}
      <div className={`${isMobile ? "pt-1" : "mt-6 pt-6 border-t border-gray-200"}`}>
        <p className="text-xs text-gray-500 text-center">{t.anyConcerns}</p>
        <p className="text-xs text-center mt-0.5">
          {user?.role === "renter" ? (
            <button onClick={onReport} className="text-red-600 hover:text-red-700 font-semibold">{t.reportIt}</button>
          ) : !isAuthenticated ? (
            <span className="text-red-600 font-semibold">{t.reportIt}</span>
          ) : null}{" "}
          {(user?.role === "renter" || !isAuthenticated) && (
            <span className="text-gray-500">{t.toOurTeam}</span>
          )}
        </p>
        {!isAuthenticated && (
          <p className="text-xs text-gray-400 text-center mt-1">
            <Link href={`/${country}/login`} className="text-primary underline">Login</Link> as a tenant to report
          </p>
        )}
      </div>
    </div>
  );
}
