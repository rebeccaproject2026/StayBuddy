"use client";

import Image from "next/image";
import {
  Filter,
  Loader2,
  ClipboardList,
  MapPin,
  Phone,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Trash2,
  Clock,
  CheckCheck,
  XOctagon,
  ArrowLeft,
  Mail,
  Users,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { AdminProperty, PropertyOwner } from "./types";

interface AdminRequestsTabProps {
  isDark: boolean;
  currentCountry: string;
  requestFilter: string;
  setRequestFilter: (v: string) => void;
  requestsLoading: boolean;
  requests: AdminProperty[];
  actioningId: string | null;
  deletingId: string | null;
  currencySymbol: string;
  fetchRequests: () => void;
  setViewingRequest: (r: AdminProperty | null) => void;
  handlePropertyAction: (propertyId: string, action: 'approve' | 'reject' | 'verify') => void;
  setRejectModal: (v: { id: string; title: string; ownerEmail?: string; ownerName?: string } | null) => void;
  setRejectReason: (v: string) => void;
  handleDeleteRejectedRequest: (propertyId: string) => void;
}

const Row = ({ label, value, isDark }: { label: string; value?: string | number | null; isDark: boolean }) =>
  value != null && value !== "" ? (
    <div className="flex justify-between py-2 border-b last:border-0 border-gray-100 dark:border-gray-700/50">
      <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
      <span className={`text-xs font-semibold text-right max-w-[55%] ${isDark ? "text-white" : "text-gray-900"}`}>{value}</span>
    </div>
  ) : null;

export default function AdminRequestsTab({
  isDark,
  currentCountry,
  requestFilter,
  setRequestFilter,
  requestsLoading,
  requests,
  actioningId,
  deletingId,
  currencySymbol,
  fetchRequests,
  setViewingRequest,
  handlePropertyAction,
  setRejectModal,
  setRejectReason,
  handleDeleteRejectedRequest,
}: AdminRequestsTabProps) {
  const [localSelectedRequest, setLocalSelectedRequest] = useState<AdminProperty | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const filtered = useMemo(() => requests.filter(r => requestFilter === "all" || r.approvalStatus === requestFilter), [requests, requestFilter]);

  const columns = useMemo<MRT_ColumnDef<AdminProperty>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Property",
        Cell: ({ row }) => {
          const req = row.original;
          const img = req.images?.[0] || "/owner.png";
          return (
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <Image src={img} alt={req.title || "Property"} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${req.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>
                    {req.propertyType}
                  </span>
                  {req.isVerified && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] font-semibold rounded">
                      <ShieldCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                </div>
                <p className={`font-semibold text-xs truncate max-w-[150px] mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {req.propertyType === "PG" ? req.pgName : req.societyName}
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
        Cell: ({ row }) => {
          const owner = typeof row.original.createdBy === 'object' ? row.original.createdBy as PropertyOwner : null;
          return (
            <div className="flex flex-col gap-0.5 max-w-[130px]">
              <span className={`truncate text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {owner?.fullName || "—"}
              </span>
              {owner?.email && (
                <span className={`truncate text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {owner.email}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "location",
        header: "Location",
        accessorFn: (row) => [row.areaName, row.location].filter(Boolean).join(", "),
        Cell: ({ cell }) => (
          <div className="flex items-center gap-1 max-w-[140px]">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
            <span className={`truncate text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{cell.getValue<string>()}</span>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        Cell: ({ cell }) => (
          <span className="font-bold text-primary text-xs">{currencySymbol}{Number(cell.getValue()).toLocaleString()}</span>
        ),
      },
      {
        accessorKey: "approvalStatus",
        header: "Status",
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const statusStyle = status === "pending" ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700" : status === "approved" ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700" : isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700";
          return (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyle}`}>{status}</span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => {
          const req = row.original;
          const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
          const isActioning = actioningId === req._id;
          
          return (
            <div className="flex items-center gap-1 flex-wrap max-w-[180px]">
              <button onClick={() => setLocalSelectedRequest(req)} className="flex items-center gap-1 px-2 py-1 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-[10px] font-medium">
                <Eye className="w-3 h-3" /> View
              </button>
              
              {req.approvalStatus === "pending" && (<>
                <button onClick={() => handlePropertyAction(req._id, "approve")} disabled={isActioning} className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[10px] font-medium disabled:opacity-60">
                  {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} OK
                </button>
                <button onClick={() => {
                  setRejectModal({ id: req._id, title: req.title, ownerEmail: owner?.email, ownerName: owner?.fullName });
                  setRejectReason("");
                }} disabled={isActioning} className={`flex items-center gap-1 px-2 py-1 border rounded-lg transition-colors text-[10px] font-medium disabled:opacity-60 ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
                  <XCircle className="w-3 h-3" /> No
                </button>
              </>)}
              
              {req.approvalStatus === "approved" && !req.isVerified && (
                <button onClick={() => handlePropertyAction(req._id, "verify")} disabled={isActioning} className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[10px] font-medium disabled:opacity-60">
                  {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />} Verify
                </button>
              )}
              
              {req.approvalStatus === "rejected" && (
                <button onClick={() => handleDeleteRejectedRequest(req._id)} disabled={deletingId === req._id} className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[10px] font-medium disabled:opacity-60">
                  {deletingId === req._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Del
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [isDark, currencySymbol, actioningId, deletingId, handlePropertyAction, handleDeleteRejectedRequest, setRejectModal, setRejectReason]
  );

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
          background: {
            default: isDark ? "#111827" : "#ffffff", 
            paper: isDark ? "#1f2937" : "#ffffff", 
          },
          primary: {
            main: "#0ea5e9", 
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
                borderColor: isDark ? "#374151" : "#e5e7eb", 
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
    data: filtered,
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: false,
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
        backgroundColor: isDark ? "#1f2937" : "#f9fafb", 
        color: isDark ? "#e5e7eb" : "#374151",
      },
    },
    muiTableBodyRowProps: {
      sx: {
        backgroundColor: isDark ? "#111827" : "#ffffff",
        '&:hover': {
          backgroundColor: isDark ? "#1f2937" : "#f9fafb",
        }
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



  if (localSelectedRequest) {
    const req = localSelectedRequest;
    const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
    const isActioning = actioningId === req._id;
    const isDeleting = deletingId === req._id;
    const amenities = req.propertyType === "PG" ? (req.commonAmenities || []) : (req.societyAmenities || []);
    const description = req.pgDescription || req.localityDescription || "";
    const statusStyle = req.approvalStatus === "pending" ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700" : req.approvalStatus === "approved" ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700" : isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700";
    
    const allImages: { url: string; label: string }[] = [
      ...(req.roomImages || []).filter(ri => ri.image).map(ri => ({ url: ri.image!, label: ri.name || 'Room' })),
      ...(req.kitchenImages || []).map(img => ({ url: img, label: 'Kitchen' })),
      ...(req.washroomImages || []).map(img => ({ url: img, label: 'Washroom' })),
      ...(req.commonAreaImages || []).map(img => ({ url: img, label: 'Common Area' })),
      ...(req.tenantRoomImages || []).filter(ri => ri.image).map(ri => ({ url: ri.image!, label: ri.name || 'Room' })),
      ...(req.tenantKitchenImages || []).map(img => ({ url: img, label: 'Kitchen' })),
      ...(req.tenantWashroomImages || []).map(img => ({ url: img, label: 'Washroom' })),
      ...(req.tenantCommonAreaImages || []).map(img => ({ url: img, label: 'Common Area' }))
    ];

    return (
      <div className="space-y-4 mb-6">
        <button
          onClick={() => setLocalSelectedRequest(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isDark ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Requests
        </button>

        <div className={`w-full rounded-xl border p-6 space-y-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{req.title}</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle}`}>
                {req.approvalStatus}
              </span>
              {req.isVerified && (
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

          {/* Two-column layout */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left: Core details */}
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Property Details</p>
              <Row isDark={isDark} label="Category" value={req.category} />
              <Row isDark={isDark} label="BHK" value={req.bhk} />
              <Row isDark={isDark} label="Flats in Project" value={req.flatsInProject} />
              <Row isDark={isDark} label="Price" value={`${currencySymbol}${req.price?.toLocaleString()} / month`} />
              <Row isDark={isDark} label="Deposit" value={req.deposit ? `${currencySymbol}${req.deposit?.toLocaleString()}` : null} />
              <Row isDark={isDark} label="Rooms" value={req.rooms} />
              <Row isDark={isDark} label="Bathrooms" value={req.bathrooms} />
              <Row isDark={isDark} label="Balcony" value={req.balcony} />
              <Row isDark={isDark} label="Area" value={req.area ? `${req.area} m²` : (req.areaMin || req.areaMax) ? `${req.areaMin || "—"} – ${req.areaMax || "—"} m²` : null} />
              <Row isDark={isDark} label="Available From" value={req.availableFrom} />
              <Row isDark={isDark} label="Rental Period" value={req.rentalPeriod} />
              <Row isDark={isDark} label="PG For" value={req.pgFor || req.preferredGender} />
              <Row isDark={isDark} label="Furnishing" value={Array.isArray(req.furnishing) ? req.furnishing.join(", ") : null} />
              <Row isDark={isDark} label="Facing" value={req.facing} />
              <Row isDark={isDark} label="Floor" value={req.floorNumber != null ? `${req.floorNumber} / ${req.totalFloors ?? "?"}` : null} />
              <Row isDark={isDark} label="Maintenance" value={req.maintenanceCharges ? `${currencySymbol}${req.maintenanceCharges}${req.maintenanceType ? ` / ${req.maintenanceType}` : ""}` : null} />
              <Row isDark={isDark} label="Society Name" value={req.societyName} />
              <Row isDark={isDark} label="Submitted" value={new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
            </div>

            {/* Right: Location + Owner */}
            <div className="space-y-4">
              <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Location</p>
                <Row isDark={isDark} label="Full Address" value={req.fullAddress} />
                <Row isDark={isDark} label="Area" value={req.areaName} />
                <Row isDark={isDark} label="City / Location" value={req.location} />
                <Row isDark={isDark} label="State" value={req.state} />
                <Row isDark={isDark} label="Pincode" value={req.pincode} />
                <Row isDark={isDark} label="Landmark" value={req.landmark} />
                {req.latitude && req.longitude && (
                  <div className="pt-2">
                    <a href={`https://www.google.com/maps?q=${req.latitude},${req.longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <MapPin className="w-3.5 h-3.5" /> View on Google Maps
                    </a>
                  </div>
                )}
              </div>

              {owner && (
                <div className={`rounded-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100"}`}>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-blue-600"}`}>Owner Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                      <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{owner.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                      <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.email}</span>
                    </div>
                    {owner.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                        <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{owner.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-blue-500"}`} />
                      <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>Joined {new Date(owner.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Room Details — PG */}
          {req.propertyType === "PG" && req.roomDetails && Object.keys(req.roomDetails).length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Price by Room Type</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(req.roomDetails).map(([category, detail]) => (
                  <div key={category} className={`rounded-xl p-3 border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{category} Bed</span>
                      <span className="text-sm font-bold text-primary">{currencySymbol}{Number(detail.monthlyRent).toLocaleString()}<span className={`text-xs font-normal ${isDark ? "text-gray-400" : "text-gray-500"}`}>/mo</span></span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>Total Beds</span>
                        <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>{detail.totalBeds ?? detail.totalRooms ?? "—"}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>Available</span>
                        <span className="font-medium text-green-500">{detail.availableBeds ?? detail.availableRooms ?? "—"}</span>
                      </div>
                      {detail.securityDeposit && Number(detail.securityDeposit) > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className={isDark ? "text-gray-400" : "text-gray-500"}>Deposit</span>
                          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>{currencySymbol}{Number(detail.securityDeposit).toLocaleString()}</span>
                        </div>
                      )}
                      {detail.facilities && detail.facilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {detail.facilities.map((f, i) => (
                            <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{f}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Details — Tenant /fr */}
          {req.propertyType === "Tenant" && req.country === "fr" && req.tenantRooms && req.tenantRooms.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Room Details</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {req.tenantRooms.map((room, i) => {
                  const max = parseInt(room.maxPersons || "1") || 1;
                  const current = parseInt(room.currentPersons || "0") || 0;
                  const statusColor = room.status === "Available" ? "bg-green-500/15 text-green-400 border-green-500/30" : room.status === "Partial" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" : "bg-red-500/15 text-red-400 border-red-500/30";
                  const statusColorLight = room.status === "Available" ? "bg-green-50 text-green-700 border-green-200" : room.status === "Partial" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-red-50 text-red-600 border-red-200";
                  return (
                    <div key={room.id || i} className={`rounded-xl p-3 border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{room.name || `Room ${i + 1}`}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${isDark ? statusColor : statusColorLight}`}>{room.status || "Available"}</span>
                      </div>
                      <div className="space-y-1">
                        {room.rent && (
                          <div className="flex justify-between text-xs">
                            <span className={isDark ? "text-gray-400" : "text-gray-500"}>Monthly Rent</span>
                            <span className="font-bold text-primary">{currencySymbol}{Number(room.rent).toLocaleString()}<span className={`font-normal ${isDark ? "text-gray-400" : "text-gray-500"}`}>/mo</span></span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className={isDark ? "text-gray-400" : "text-gray-500"}>Occupancy</span>
                          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>{current} / {max} persons</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Amenities</p>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Rooms */}
          {req.propertyType === "Tenant" && req.additionalRooms && req.additionalRooms.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Additional Rooms</p>
              <div className="flex flex-wrap gap-2">
                {req.additionalRooms.map((r, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>{r.replace(/([A-Z])/g, " $1").trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Overlooking */}
          {req.propertyType === "Tenant" && req.overlooking && req.overlooking.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Overlooking</p>
              <div className="flex flex-wrap gap-2">
                {req.overlooking.map((o, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>{o.replace(/([A-Z])/g, " $1").trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tenants Preferred */}
          {req.propertyType === "Tenant" && req.tenantsPrefer && req.tenantsPrefer.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Tenants Preferred</p>
              <div className="flex flex-wrap gap-2">
                {req.tenantsPrefer.map((t, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${isDark ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary border border-primary/20"}`}>{t.replace(/([A-Z])/g, " $1").trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Rules */}
          {(req.pgRules?.length || Object.keys(req.rules || {}).length > 0) && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Rules</p>
              <div className="flex flex-wrap gap-2">
                {req.pgRules?.map((r, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-700 border border-red-200"}`}>{r}</span>
                ))}
                {Object.entries(req.rules || {}).map(([k, v]) => (
                  <span key={k} className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>{k}: {v}</span>
                ))}
              </div>
            </div>
          )}

          {/* Nearby places */}
          {req.nearbyPlaces && req.nearbyPlaces.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Nearby Places</p>
              <div className="flex flex-wrap gap-2">
                {req.nearbyPlaces.map((p, i) => (
                  <span key={i} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-700"}`}>
                    <MapPin className="w-3 h-3" />
                    {typeof p === "string" ? p : `${p.name}${p.distance ? ` · ${p.distance}` : ""}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Description</p>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{description}</p>
            </div>
          )}

          <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className={`w-4 h-4 ${req.isVerified ? "text-emerald-500" : isDark ? "text-gray-400" : "text-gray-400"}`} />
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>Verification Documents</p>
            </div>
            {(req.verificationImages?.length ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-3">
                {req.verificationImages!.map((url, i) => (
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
            {req.approvalStatus === "pending" && (
              <>
                <button
                  onClick={() => {
                    const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
                    setRejectModal({ id: req._id, title: req.title, ownerEmail: owner?.email, ownerName: owner?.fullName });
                    setRejectReason("");
                  }}
                  disabled={isActioning}
                  className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors text-sm font-medium disabled:opacity-60 ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}
                >
                  <XCircle className="w-4 h-4" /> Reject Request
                </button>
                <button
                  onClick={() => handlePropertyAction(req._id, "approve")}
                  disabled={isActioning}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-60"
                >
                  {isActioning ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Approve Request
                </button>
              </>
            )}
            
            {req.approvalStatus === "approved" && !req.isVerified && (
              <button
                onClick={() => handlePropertyAction(req._id, "verify")}
                disabled={isActioning}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-60"
              >
                {isActioning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Verify Property
              </button>
            )}

            {req.approvalStatus === "rejected" && (
              <button
                onClick={() => {
                  handleDeleteRejectedRequest(req._id);
                  setLocalSelectedRequest(null);
                }}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Request
              </button>
            )}
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
        <div>
          <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Property Requests</h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Review and approve new property listing submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRequests}
            disabled={requestsLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm transition-colors disabled:opacity-50 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
          >
            <Loader2 className={`w-3.5 h-3.5 ${requestsLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Filter className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          <select
            value={requestFilter}
            onChange={e => setRequestFilter(e.target.value)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Pending", count: requests.filter(r => r.approvalStatus === "pending").length, icon: Clock, color: "text-yellow-400", bg: isDark ? "bg-yellow-500/10 border-yellow-500/20" : "bg-yellow-50 border-yellow-200" },
          { label: "Approved", count: requests.filter(r => r.approvalStatus === "approved").length, icon: CheckCheck, color: "text-green-400", bg: isDark ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-200" },
          { label: "Rejected", count: requests.filter(r => r.approvalStatus === "rejected").length, icon: XOctagon, color: "text-red-400", bg: isDark ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-200" },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-xl p-3 sm:p-4 border flex items-center gap-2 sm:gap-3 ${bg}`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${color}`} />
            <div>
              <p className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{count}</p>
              <p className={`text-[10px] sm:text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {requestsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
      ) : filtered.length > 0 ? (
        <>
          {/* Desktop table */}
          {/* Desktop table */}
          <div className="hidden sm:block">
            <ThemeProvider theme={tableTheme}>
              <CssBaseline />
              <MaterialReactTable table={table} />
            </ThemeProvider>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((req) => {
              const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
              const img = req.images?.[0] || "/owner.png";
              const isActioning = actioningId === req._id;
              const statusStyle = req.approvalStatus === "pending" ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700" : req.approvalStatus === "approved" ? isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700" : isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700";
              return (
                <div key={req._id} className={`rounded-xl border p-4 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
                      <Image src={img} alt={req.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${req.propertyType === "PG" ? "bg-blue-600" : "bg-green-600"}`}>{req.propertyType}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyle}`}>{req.approvalStatus}</span>
                      </div>
                      <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>{req.title}</p>
                      <p className="font-bold text-primary text-sm">{currencySymbol}{req.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`space-y-1.5 mb-3 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {owner && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 flex-shrink-0" /><span className="truncate">{owner.fullName}</span></div>}
                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{[req.areaName, req.location].filter(Boolean).join(", ")}</span></div>
                    <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 flex-shrink-0" /><span>{new Date(req.createdAt).toLocaleDateString()}</span></div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setLocalSelectedRequest(req)} className="flex items-center gap-1.5 px-3 py-2 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors text-xs font-semibold">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    {req.approvalStatus === "pending" && (<>
                      <button onClick={() => handlePropertyAction(req._id, "approve")} disabled={isActioning} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-xs font-semibold disabled:opacity-60">
                        {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Approve
                      </button>
                      <button onClick={() => {
                        const owner = typeof req.createdBy === "object" ? req.createdBy as PropertyOwner : null;
                        setRejectModal({ id: req._id, title: req.title, ownerEmail: owner?.email, ownerName: owner?.fullName });
                        setRejectReason("");
                      }} disabled={isActioning} className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl transition-colors text-xs font-semibold disabled:opacity-60 ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>)}
                    {req.approvalStatus === "approved" && !req.isVerified && (
                      <button onClick={() => handlePropertyAction(req._id, "verify")} disabled={isActioning} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-xs font-semibold disabled:opacity-60">
                        {isActioning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />} Verify
                      </button>
                    )}
                    {req.approvalStatus === "approved" && req.isVerified && (
                      <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 text-emerald-400 rounded-xl text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                    {req.approvalStatus === "rejected" && (
                      <button
                        onClick={() => handleDeleteRejectedRequest(req._id)}
                        disabled={deletingId === req._id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-xs font-semibold disabled:opacity-60"
                      >
                        {deletingId === req._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className={`rounded-xl p-10 text-center border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <ClipboardList className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
          <p className={`font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>No property requests</p>
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>New submissions will appear here for review</p>
        </div>
      )}
    </div>
  );
}
