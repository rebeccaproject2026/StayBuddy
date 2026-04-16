"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/lib/token-storage";
import { useParams } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminAnalyticsCharts from "@/components/admin/AdminAnalyticsCharts";
import AdminListingsTab from "@/components/admin/AdminListingsTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminReportsTab from "@/components/admin/AdminReportsTab";
import AdminRequestsTab from "@/components/admin/AdminRequestsTab";
import AdminOutreachTab from "@/components/admin/AdminOutreachTab";
import AdminPropertyModal from "@/components/admin/AdminPropertyModal";
import AdminModals from "@/components/admin/AdminModals";

import type { AdminProperty, AdminUser, AdminStats, AdminContent } from "@/components/admin/types";

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const { logout } = useAuth();
  const params = useParams();
  const currentCountry = (params?.country as string) || "in";

  // Auth
  const [authChecked, setAuthChecked] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    const c = currentCountry === 'fr' ? 'fr' : 'in';
    const raw = localStorage.getItem(`staybuddy_user_${c}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.role === 'admin') {
          setAuthUser(parsed);
          setAuthChecked(true);
          return;
        }
      } catch {}
    }
    window.location.replace(`/${c}/control/login`);
  }, []);

  const [activeTab, setActiveTab] = useState("analytics");
  const [listingFilter, setListingFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [reportFilter, setReportFilter] = useState("pending");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const currencySymbol = t("currency.symbol");

  // Properties
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string; ownerEmail?: string; ownerName?: string } | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Reject modal
  const [rejectModal, setRejectModal] = useState<{ id: string; title: string; ownerEmail?: string; ownerName?: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  // Pagination
  const PAGE_SIZE = 10;
  const USER_PAGE_SIZE = 12;
  const [listingPage, setListingPage] = useState(1);

  // Users
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userPage, setUserPage] = useState(1);

  // Reports
  const [allReports, setAllReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  // Requests
  const [requests, setRequests] = useState<AdminProperty[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestFilter, setRequestFilter] = useState("pending");
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [viewingRequest, setViewingRequest] = useState<AdminProperty | null>(null);

  // Block modal
  const [blockModal, setBlockModal] = useState<{ userId: string; userName: string; email: string } | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockSubmitting, setBlockSubmitting] = useState(false);

  // Document lightbox
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);

  // Outreach
  const [waEntries, setWaEntries] = useState<{ id: string; phone: string; name: string; pgName: string }[]>([
    { id: crypto.randomUUID(), phone: "", name: "", pgName: "" },
  ]);
  const [waSent, setWaSent] = useState<Set<string>>(new Set());
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsTab, setLeadsTab] = useState<"compose" | "database">("compose");

  useEffect(() => {
    const saved = localStorage.getItem("admin_theme");
    setIsDark(saved ? saved === "dark" : true);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("admin_theme", next ? "dark" : "light");
  };

  const fetchProperties = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setPropertiesLoading(true);
    try {
      const res = await fetch(`/api/admin/properties?status=approved&country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProperties(data.properties);
    } finally {
      setPropertiesLoading(false);
    }
  }, [currentCountry]);

  const fetchRequests = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setRequestsLoading(true);
    try {
      const res = await fetch(`/api/admin/properties?country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRequests(data.properties);
    } finally {
      setRequestsLoading(false);
    }
  }, [currentCountry]);

  const fetchUsers = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setUsersLoading(true);
    try {
      const res = await fetch(`/api/admin/users?country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAllUsers(data.users);
    } finally {
      setUsersLoading(false);
    }
  }, [currentCountry]);

  const fetchReports = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setReportsLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAllReports(data.reports);
    } finally {
      setReportsLoading(false);
    }
  }, [currentCountry]);

  const fetchLeads = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLeadsLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?country=${currentCountry}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setLeads(data.leads);
    } finally {
      setLeadsLoading(false);
    }
  }, [currentCountry]);

  useEffect(() => {
    if (!authUser) return;
    const token = getToken();
    if (!token) return;

    Promise.all([fetchProperties(), fetchRequests(), fetchUsers(), fetchReports(), fetchLeads()]);

    const es = new EventSource(`/api/admin/property-events?token=${encodeURIComponent(token)}`);
    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === "new_property") {
          fetchRequests();
        } else if (payload.type === "new_lead") {
          const t = getToken();
          if (!t) return;
          fetch(`/api/admin/leads?country=${currentCountry}`, { headers: { Authorization: `Bearer ${t}` } })
            .then(r => r.json())
            .then(d => { if (d.success) setLeads(d.leads); })
            .catch(() => {});
        }
      } catch {}
    };
    return () => es.close();
  }, [authUser, fetchProperties, fetchRequests, fetchUsers, fetchReports, fetchLeads, currentCountry]);

  if (!authChecked || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  // Handlers
  const handleUpdateReportStatus = async (reportId: string, status: string) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reportId, status }),
      });
      const data = await res.json();
      if (data.success) setAllReports(prev => prev.map(r => r._id === reportId ? { ...r, status } : r));
    } catch {}
  };

  const handleDeleteReport = async (reportId: string) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("/api/admin/reports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reportId }),
      });
      const data = await res.json();
      if (data.success) setAllReports(prev => prev.filter(r => r._id !== reportId));
    } catch {}
  };

  const handleToggleBlock = async (userId: string, block: boolean, userName: string, email: string) => {
    if (block) {
      setBlockModal({ userId, userName, email });
      setBlockReason("");
      return;
    }
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, isBlocked: false }),
      });
      const data = await res.json();
      if (data.success) setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: false } : u));
    } catch {}
  };

  const handleBlockSubmit = async () => {
    if (!blockModal || !blockReason.trim()) return;
    const token = getToken();
    if (!token) return;
    setBlockSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: blockModal.userId, isBlocked: true, reason: blockReason.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setAllUsers(prev => prev.map(u => u._id === blockModal.userId ? { ...u, isBlocked: true } : u));
        setBlockModal(null);
        setBlockReason("");
      }
    } catch {} finally {
      setBlockSubmitting(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string, reason: string) => {
    const token = getToken();
    if (!token) return;
    setDeleteSubmitting(true);
    setDeletingId(propertyId);
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p._id !== propertyId));
        if (selectedProperty?._id === propertyId) setSelectedProperty(null);
        setDeleteModal(null);
        setDeleteReason("");
      }
    } catch {} finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
      setDeleteSubmitting(false);
    }
  };

  const handleDeleteRejectedRequest = async (propertyId: string) => {
    const token = getToken();
    if (!token) return;
    setDeletingId(propertyId);
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r._id !== propertyId));
        if (viewingRequest?._id === propertyId) setViewingRequest(null);
      }
    } catch {} finally {
      setDeletingId(null);
    }
  };

  const handlePropertyAction = async (propertyId: string, action: 'approve' | 'reject' | 'verify') => {
    const token = getToken();
    if (!token) return;
    setActioningId(propertyId);
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = data.property as AdminProperty;
        setRequests(prev => prev.map(p => p._id === propertyId ? { ...p, ...updated } : p));
        if (action === 'approve') {
          setRequestFilter("approved");
          setProperties(prev => prev.some(p => p._id === propertyId) ? prev.map(p => p._id === propertyId ? { ...p, ...updated } : p) : [updated, ...prev]);
        }
        if (action === 'verify') {
          setRequests(prev => prev.map(p => p._id === propertyId ? { ...p, isVerified: true } : p));
          setProperties(prev => prev.map(p => p._id === propertyId ? { ...p, isVerified: true } : p));
        }
        if (viewingRequest?._id === propertyId) setViewingRequest(prev => prev ? { ...prev, ...updated } : null);
      }
    } catch {} finally {
      setActioningId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    const token = getToken();
    if (!token) return;
    setRejectSubmitting(true);
    try {
      const res = await fetch(`/api/admin/properties/${rejectModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "reject", reason: rejectReason.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.map(p => p._id === rejectModal.id ? { ...p, approvalStatus: 'rejected' } : p));
        if (viewingRequest?._id === rejectModal.id) setViewingRequest(prev => prev ? { ...prev, approvalStatus: 'rejected' } : null);
        setRejectModal(null);
        setRejectReason("");
      }
    } catch {} finally {
      setRejectSubmitting(false);
    }
  };

  // Derived data
  const stats: AdminStats = {
    totalListings: properties.length,
    verifiedListings: properties.filter(p => p.isVerified).length,
    totalUsers: allUsers.length,
    owners: allUsers.filter(u => u.role === "landlord").length,
    tenants: allUsers.filter(u => u.role === "renter").length,
    pendingReports: allReports.filter(r => r.status === "pending").length,
    pendingRequests: requests.filter(r => r.approvalStatus === "pending").length,
  };

  const content: Record<string, AdminContent> = {
    en: {
      dashboard: "Admin Dashboard", listingsManagement: "Listings Management", userManagement: "User Management",
      reportsModeration: "Reports", logout: "Logout", totalListings: "Total Listings", pendingListings: "Pending Listings",
      approvedListings: "Approved Listings", totalUsers: "Total Users", owners: "Owners", tenants: "Tenants",
      pendingReports: "Pending Reports", all: "All", pending: "Pending", approved: "Approved", rejected: "Rejected",
      approve: "Approve", reject: "Reject", edit: "Edit", delete: "Delete", view: "View", ownerName: "Owner Name",
      submittedDate: "Submitted Date", status: "Status", noListings: "No listings found", name: "Name", email: "Email",
      role: "Role", verified: "Verified", active: "Active", banned: "Banned", ban: "Ban User", unban: "Unban User",
      verify: "Verify", noUsers: "No users found", reportedBy: "Reported By", reason: "Reason", date: "Date",
      reviewed: "Reviewed", markReviewed: "Mark as Reviewed", viewDetails: "View Details", noReports: "No reports found",
      listingName: "Listing Name", description: "Description", location: "Location", rent: "Rent", rooms: "Rooms", type: "Type",
    },
    fr: {
      dashboard: "Tableau de bord admin", listingsManagement: "Gestion des annonces", userManagement: "Gestion des utilisateurs",
      reportsModeration: "Rapports", logout: "Déconnexion", totalListings: "Total des annonces", pendingListings: "Annonces en attente",
      approvedListings: "Annonces approuvées", totalUsers: "Total des utilisateurs", owners: "Propriétaires", tenants: "Locataires",
      pendingReports: "Rapports en attente", all: "Tous", pending: "En attente", approved: "Approuvé", rejected: "Rejeté",
      approve: "Approuver", reject: "Rejeter", edit: "Modifier", delete: "Supprimer", view: "Voir", ownerName: "Nom du propriétaire",
      submittedDate: "Date de soumission", status: "Statut", noListings: "Aucune annonce", name: "Nom", email: "Email",
      role: "Rôle", verified: "Vérifié", active: "Actif", banned: "Banni", ban: "Bannir", unban: "Débannir",
      verify: "Vérifier", noUsers: "Aucun utilisateur", reportedBy: "Signalé par", reason: "Raison", date: "Date",
      reviewed: "Examiné", markReviewed: "Marquer comme examiné", viewDetails: "Voir les détails", noReports: "Aucun rapport",
      listingName: "Nom de l'annonce", description: "Description", location: "Emplacement", rent: "Loyer", rooms: "Chambres", type: "Type",
    },
  };
  const tc = content[language] ?? content.en;

  const filteredListings = properties.filter(p => {
    if (listingFilter === "pg") return p.propertyType === "PG";
    if (listingFilter === "tenant") return p.propertyType === "Tenant";
    if (listingFilter === "verified") return p.isVerified;
    return true;
  });
  const totalListingPages = Math.ceil(filteredListings.length / PAGE_SIZE);
  const pagedListings = filteredListings.slice((listingPage - 1) * PAGE_SIZE, listingPage * PAGE_SIZE);

  const filteredUsers = allUsers.filter(u => {
    if (userFilter === "landlord") return u.role === "landlord";
    if (userFilter === "renter") return u.role === "renter";
    if (userFilter === "verified") return u.isVerified;
    if (userFilter === "unverified") return !u.isVerified;
    return true;
  });
  const totalUserPages = Math.ceil(filteredUsers.length / USER_PAGE_SIZE);
  const pagedUsers = filteredUsers.slice((userPage - 1) * USER_PAGE_SIZE, userPage * USER_PAGE_SIZE);

  const filteredReports = allReports.filter(r => reportFilter === "all" || r.status === reportFilter);

  return (
    <>
      <div className={`h-screen overflow-hidden flex flex-col relative ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
        {isDark && (
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        )}

        <AdminHeader
          isDark={isDark}
          toggleTheme={toggleTheme}
          currentCountry={currentCountry}
          language={language}
          title={tc.dashboard}
        />

        <div className="relative flex flex-1 overflow-hidden">
          <AdminSidebar
            isDark={isDark}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stats={stats}
            tc={tc}
            authUser={authUser}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            currentCountry={currentCountry}
            language={language}
          />

          <div className="flex-1 overflow-y-auto pb-16 lg:pb-0 min-w-0 p-3 sm:p-5 lg:p-8">
            {activeTab === "analytics" && (
              <>
                <AdminStatsCards isDark={isDark} stats={stats} tc={tc} />
                <AdminAnalyticsCharts
                  isDark={isDark}
                  currentCountry={currentCountry}
                  requests={requests}
                  allUsers={allUsers}
                  allReports={allReports}
                  stats={stats}
                />
              </>
            )}

            {activeTab === "listings" && (
              <AdminListingsTab
                isDark={isDark}
                tc={tc}
                currentCountry={currentCountry}
                listingFilter={listingFilter}
                setListingFilter={setListingFilter}
                listingPage={listingPage}
                setListingPage={setListingPage}
                propertiesLoading={propertiesLoading}
                filteredListings={filteredListings}
                pagedListings={pagedListings}
                totalListingPages={totalListingPages}
                PAGE_SIZE={PAGE_SIZE}
                currencySymbol={currencySymbol}
                setSelectedProperty={setSelectedProperty}
                setDeleteModal={setDeleteModal}
                setDeleteReason={setDeleteReason}
              />
            )}

            {activeTab === "users" && (
              <AdminUsersTab
                isDark={isDark}
                tc={tc}
                currentCountry={currentCountry}
                userFilter={userFilter}
                setUserFilter={setUserFilter}
                userPage={userPage}
                setUserPage={setUserPage}
                usersLoading={usersLoading}
                filteredUsers={filteredUsers}
                pagedUsers={pagedUsers}
                totalUserPages={totalUserPages}
                USER_PAGE_SIZE={USER_PAGE_SIZE}
                handleToggleBlock={handleToggleBlock}
              />
            )}

            {activeTab === "reports" && (
              <AdminReportsTab
                isDark={isDark}
                tc={tc}
                reportFilter={reportFilter}
                setReportFilter={setReportFilter}
                reportsLoading={reportsLoading}
                filteredReports={filteredReports}
                handleUpdateReportStatus={handleUpdateReportStatus}
                handleDeleteReport={handleDeleteReport}
              />
            )}

            {activeTab === "requests" && (
              <AdminRequestsTab
                isDark={isDark}
                currentCountry={currentCountry}
                requestFilter={requestFilter}
                setRequestFilter={setRequestFilter}
                requestsLoading={requestsLoading}
                requests={requests}
                actioningId={actioningId}
                deletingId={deletingId}
                currencySymbol={currencySymbol}
                fetchRequests={fetchRequests}
                setViewingRequest={setViewingRequest}
                handlePropertyAction={handlePropertyAction}
                setRejectModal={setRejectModal}
                setRejectReason={setRejectReason}
                handleDeleteRejectedRequest={handleDeleteRejectedRequest}
              />
            )}

            {activeTab === "outreach" && (
              <AdminOutreachTab
                isDark={isDark}
                currentCountry={currentCountry}
                leads={leads}
                leadsLoading={leadsLoading}
                leadsTab={leadsTab}
                setLeadsTab={setLeadsTab}
                waEntries={waEntries}
                setWaEntries={setWaEntries}
                waSent={waSent}
                setWaSent={setWaSent}
                setLeads={setLeads}
                fetchLeads={fetchLeads}
              />
            )}
          </div>
        </div>

        <AdminMobileNav
          isDark={isDark}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
        />
      </div>

      {viewingRequest && (
        <AdminPropertyModal
          isDark={isDark}
          viewingRequest={viewingRequest}
          currencySymbol={currencySymbol}
          actioningId={actioningId}
          deletingId={deletingId}
          setViewingRequest={setViewingRequest}
          setViewingDoc={setViewingDoc}
          handlePropertyAction={handlePropertyAction}
          setRejectModal={setRejectModal}
          setRejectReason={setRejectReason}
          handleDeleteRejectedRequest={handleDeleteRejectedRequest}
        />
      )}

      <AdminModals
        isDark={isDark}
        currencySymbol={currencySymbol}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        setDeleteConfirmId={setDeleteConfirmId}
        setViewingDoc={setViewingDoc}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        deleteReason={deleteReason}
        setDeleteReason={setDeleteReason}
        deleteSubmitting={deleteSubmitting}
        handleDeleteProperty={handleDeleteProperty}
        rejectModal={rejectModal}
        setRejectModal={setRejectModal}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        rejectSubmitting={rejectSubmitting}
        handleRejectSubmit={handleRejectSubmit}
        blockModal={blockModal}
        setBlockModal={setBlockModal}
        blockReason={blockReason}
        setBlockReason={setBlockReason}
        blockSubmitting={blockSubmitting}
        handleBlockSubmit={handleBlockSubmit}
        viewingDoc={viewingDoc}
      />
    </>
  );
}
