"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Filter,
  Loader2,
  Building2,
  MapPin,
  Mail,
  Phone,
  Eye,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  Users,
  X,
} from "lucide-react";
import { AdminProperty, PropertyOwner, AdminContent } from "./types";

interface AdminListingsTabProps {
  isDark: boolean;
  tc: AdminContent;
  currentCountry: string;
  listingFilter: string;
  setListingFilter: (v: string) => void;
  listingPage: number;
  setListingPage: (fn: (p: number) => number) => void;
  propertiesLoading: boolean;
  filteredListings: AdminProperty[];
  pagedListings: AdminProperty[];
  totalListingPages: number;
  PAGE_SIZE: number;
  currencySymbol: string;
  setSelectedProperty: (p: AdminProperty | null) => void;
  setDeleteModal: (
    v: { id: string; title: string; ownerEmail?: string; ownerName?: string } | null
  ) => void;
  setDeleteReason: (v: string) => void;
}

export default function AdminListingsTab({
  isDark,
  tc,
  currentCountry,
  listingFilter,
  setListingFilter,
  propertiesLoading,
  filteredListings,
  currencySymbol,
  setSelectedProperty,
  setDeleteModal,
  setDeleteReason,
}: AdminListingsTabProps) {
  
  const [localSelectedProperty, setLocalSelectedProperty] = useState<AdminProperty | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  
  const columns = useMemo<MRT_ColumnDef<AdminProperty>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Property",
        Cell: ({ row }) => {
          const property = row.original;
          const img = property.images?.[0] || "/owner.png";
          return (
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <Image src={img} alt={property.title || "Property"} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold text-white ${property.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>
                    {property.propertyType}
                  </span>
                  {property.isVerified && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-600 text-white text-xs font-semibold rounded">
                      <ShieldCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                </div>
                <p className={`font-semibold truncate max-w-[160px] mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {property.propertyType === "PG" ? property.pgName : property.societyName}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        id: "owner",
        header: "Owner",
        accessorFn: (row) => {
          const owner = typeof row.createdBy === 'object' ? row.createdBy as PropertyOwner : null;
          return owner?.fullName || "—";
        },
        Cell: ({ cell }) => (
          <div className="flex items-center gap-1.5 max-w-[140px]">
            <span className={`truncate text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {cell.getValue<string>()}
            </span>
          </div>
        ),
      },
      {
        id: "location",
        header: "Location",
        accessorFn: (row) => [row.areaName, row.location].filter(Boolean).join(", "),
        Cell: ({ cell }) => (
          <div className="flex items-center gap-1 max-w-[160px]">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
            <span className={`truncate text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{cell.getValue<string>()}</span>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        Cell: ({ cell }) => (
          <span className="font-bold text-primary text-sm">{currencySymbol}{Number(cell.getValue()).toLocaleString()}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => {
          const property = row.original;
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLocalSelectedProperty(property);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-xs font-medium"
            >
              <Eye className="w-3.5 h-3.5" /> View Details
            </button>
          );
        },
      },
    ],
    [isDark, currencySymbol, setSelectedProperty]
  );

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
          background: {
            default: isDark ? "#111827" : "#ffffff", // tailwind gray-900 / white
            paper: isDark ? "#1f2937" : "#ffffff", // tailwind gray-800 / white
          },
          primary: {
            main: "#0ea5e9", // typical staybuddy primary blue
          },
        },
        typography: {
          fontFamily: "inherit",
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: isDark ? "#374151" : "#e5e7eb", // tailwind gray-700 / gray-200
                padding: "12px 16px",
              },
              head: {
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [isDark]
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredListings,
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: false,
    renderDetailPanel: ({ row }) => {
      const property = row.original;
      const owner = typeof property.createdBy === 'object' ? property.createdBy as PropertyOwner : null;
      return (
        <div className={`p-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${isDark ? 'text-gray-300 bg-gray-800/50' : 'text-gray-700 bg-gray-50'}`}>
          <div className="space-y-2">
            <p className="text-sm"><strong>Owner:</strong> {owner?.fullName || "—"}</p>
            <div className="text-sm flex flex-col gap-1">
              <strong>Contact:</strong>
              {owner?.email && <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {owner.email}</span>}
              {owner?.phoneNumber && <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> {owner.phoneNumber}</span>}
            </div>
            <p className="text-sm"><strong>Date Added:</strong> {new Date(property.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col md:items-end justify-center gap-2">
            <button
              onClick={() => {
                setDeleteModal({ id: property._id, title: property.title, ownerEmail: owner?.email, ownerName: owner?.fullName });
                setDeleteReason("");
              }}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 border rounded-lg transition-colors text-sm font-medium w-full md:w-48 ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}
            >
              <Trash2 className="w-4 h-4" /> Delete Property
            </button>
          </div>
        </div>
      );
    },
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      density: "compact",
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "12px",
        border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
        backgroundColor: isDark ? "#111827" : "#ffffff",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: isDark ? "#1f2937" : "#f9fafb", // tailwind gray-800 / gray-50
        color: isDark ? "#e5e7eb" : "#374151",
      },
    },
    muiTableBodyRowProps: {
      sx: {
        backgroundColor: isDark ? "#111827" : "#ffffff",
        '&:hover': {
          backgroundColor: isDark ? "#1f2937" : "#f9fafb",
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        color: isDark ? "#e5e7eb" : "#111827",
        borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      },
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: isDark ? "#111827" : "#ffffff",
      },
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: isDark ? "#111827" : "#ffffff",
      },
    },
  });

  if (localSelectedProperty) {
    const prop = localSelectedProperty;
    const owner = typeof prop.createdBy === "object" ? prop.createdBy as PropertyOwner : null;
    
    const allImages: { url: string; label: string }[] = [
      ...(prop.roomImages || []).filter(ri => ri.image).map(ri => ({ url: ri.image!, label: ri.name || 'Room' })),
      ...(prop.kitchenImages || []).map(img => ({ url: img, label: 'Kitchen' })),
      ...(prop.washroomImages || []).map(img => ({ url: img, label: 'Washroom' })),
      ...(prop.commonAreaImages || []).map(img => ({ url: img, label: 'Common Area' })),
      ...(prop.tenantRoomImages || []).filter(ri => ri.image).map(ri => ({ url: ri.image!, label: ri.name || 'Room' })),
      ...(prop.tenantKitchenImages || []).map(img => ({ url: img, label: 'Kitchen' })),
      ...(prop.tenantWashroomImages || []).map(img => ({ url: img, label: 'Washroom' })),
      ...(prop.tenantCommonAreaImages || []).map(img => ({ url: img, label: 'Common Area' }))
    ];

    return (
      <div className="space-y-4 mb-6">
        <button
          onClick={() => setLocalSelectedProperty(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isDark ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>

        <div className={`w-full rounded-xl border p-6 space-y-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{prop.title}</h2>
              {prop.isVerified && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Images Gallery */}
          {allImages.length > 0 && (
            <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Property Images</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allImages.map((img, idx) => (
                  <button
                    key={`img-${idx}`}
                    type="button"
                    onClick={() => setViewingImage(img.url)}
                    className="relative h-32 w-full rounded-lg overflow-hidden bg-gray-200 block cursor-pointer border border-gray-300 dark:border-gray-600 group"
                    title={`Click to view ${img.label}`}
                  >
                    <Image src={img.url} alt={`${img.label} ${idx + 1}`} fill className="object-cover group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1.5 backdrop-blur-sm z-10">
                      <p className="text-xs font-medium text-white truncate text-center">{img.label}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg z-20">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Type", value: prop.propertyType },
              { label: "Category", value: prop.category || "—" },
              { label: "Price", value: `${currencySymbol}${prop.price.toLocaleString()}/mo` },
              { label: "Rooms", value: prop.rooms },
              { label: "Posted by", value: prop.posterType || "—" },
              { label: "Listed on", value: new Date(prop.createdAt).toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label} className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <p className={`text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
                <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{String(value)}</p>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Address</p>
            <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {[prop.fullAddress, prop.areaName, prop.location, prop.state, prop.pincode].filter(Boolean).join(", ")}
            </p>
            {prop.landmark && (
              <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Landmark: {prop.landmark}</p>
            )}
          </div>

          {owner && (
            <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-blue-600"}`}>Owner Information</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{owner.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                  <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.email}</span>
                </div>
                {owner.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                    <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {prop.pgDescription && (
            <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Description</p>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{prop.pgDescription}</p>
            </div>
          )}

          <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className={`w-4 h-4 ${prop.isVerified ? "text-emerald-500" : isDark ? "text-gray-400" : "text-gray-400"}`} />
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>Verification Documents</p>
            </div>
            {(prop.verificationImages?.length ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-3">
                {prop.verificationImages!.map((url, i) => (
                  <button key={i} type="button" onClick={() => setViewingImage(url)}
                    className="group relative h-24 w-32 rounded-lg overflow-hidden bg-gray-200 block cursor-pointer border border-gray-300" title="Click to view document">
                    <Image src={url} alt={`Document ${i + 1}`} fill className="object-cover group-hover:opacity-75 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No verification documents uploaded.</p>
            )}
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => {
                setDeleteModal({ id: prop._id, title: prop.title, ownerEmail: owner?.email, ownerName: owner?.fullName });
                setDeleteReason("");
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" /> Delete Property
            </button>
          </div>
        </div>

        {/* Fullscreen Image Lightbox */}
        {viewingImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setViewingImage(null)}>
            <button onClick={() => setViewingImage(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50">
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={viewingImage} alt="Fullscreen property image" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tc.listingsManagement}</h2>
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          <select
            value={listingFilter}
            onChange={(e) => setListingFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
          >
            <option value="all">{tc.all}</option>
            <option value="pg">PG</option>
            <option value="tenant">Tenant</option>
            <option value="verified">Verified</option>
          </select>
          <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}>
            {currentCountry === "in" ? "🇮🇳 India" : currentCountry === "fr" ? "🇫🇷 France" : currentCountry.toUpperCase()}
          </div>
        </div>
      </div>

      {propertiesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : filteredListings.length > 0 ? (
        <ThemeProvider theme={tableTheme}>
          <CssBaseline />
          <MaterialReactTable table={table} />
        </ThemeProvider>
      ) : (
        <div className={`rounded-xl p-12 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <Building2 className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={isDark ? "text-gray-500" : "text-gray-500"}>{tc.noListings}</p>
        </div>
      )}

      {/* Fullscreen Image Lightbox */}
      {viewingImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setViewingImage(null)}>
          <button onClick={() => setViewingImage(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50">
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewingImage} alt="Fullscreen property image" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
