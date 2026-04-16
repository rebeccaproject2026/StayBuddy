// Shared TypeScript interfaces/types for owner dashboard components

export type PhotoCat = "kitchen" | "washroom" | "commonArea";

export interface TcContent {
  dashboard: string;
  myListings: string;
  bookingRequests: string;
  profile: string;
  logout: string;
  addNewListing: string;
  viewDetails: string;
  edit: string;
  delete: string;
  updateAvailability: string;
  noListings: string;
  tenantName: string;
  propertyName: string;
  roomType: string;
  moveInDate: string;
  status: string;
  noRequests: string;
  statusNew: string;
  statusContacted: string;
  statusInterested: string;
  statusBooked: string;
  statusClosed: string;
  profileSettings: string;
  fullName: string;
  email: string;
  phone: string;
  saveChanges: string;
  verificationStatus: string;
  views: string;
  inquiries: string;
  rooms: string;
  occupied: string;
  location: string;
}

export interface StatusDropdownProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  isDark?: boolean;
}

export interface ProfileSectionProps {
  user: any;
  tc: TcContent;
  language: string;
  isDark?: boolean;
}

export interface TableRentCellProps {
  listing: any;
  isDark: boolean;
}

export interface OwnerListingCardProps {
  listing: any;
  isDark: boolean;
  tc: TcContent;
  language: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface OwnerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  language: string;
  user: any;
  contactRequests: any[];
  seenInquiryIds: Set<string>;
  setSeenInquiryIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  chatUnread: number;
  profileMenuOpen: boolean;
  setProfileMenuOpen: (open: boolean) => void;
  logout: () => void;
  tc: TcContent;
}

export interface OwnerMobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  language: string;
  contactRequests: any[];
  seenInquiryIds: Set<string>;
  setSeenInquiryIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  chatUnread: number;
  logout: () => void;
}

export interface OwnerListingsTabProps {
  isDark: boolean;
  language: string;
  tc: TcContent;
  myListings: any[];
  listingsLoading: boolean;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  editingListing: any | null;
  selectedListing: any | null;
  setSelectedListing: (listing: any | null) => void;
  editForm: Record<string, any>;
  setEditForm: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  editImages: string[];
  setEditImages: React.Dispatch<React.SetStateAction<string[]>>;
  editNewFiles: File[];
  setEditNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
  editCatImages: Record<PhotoCat, string[]>;
  setEditCatImages: React.Dispatch<React.SetStateAction<Record<PhotoCat, string[]>>>;
  editCatNewFiles: Record<PhotoCat, File[]>;
  setEditCatNewFiles: React.Dispatch<React.SetStateAction<Record<PhotoCat, File[]>>>;
  editRoomImages: any[];
  setEditRoomImages: React.Dispatch<React.SetStateAction<any[]>>;
  editRoomNewFiles: File[];
  setEditRoomNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
  editVerifImages: string[];
  setEditVerifImages: React.Dispatch<React.SetStateAction<string[]>>;
  editVerifNewFiles: File[];
  setEditVerifNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
  editSaving: boolean;
  editError: string;
  openEdit: (listing: any) => void;
  closeEdit: () => void;
  saveEdit: () => void;
  setDeleteConfirmId: (id: string | null) => void;
  user: any;
  router: any;
}

export interface OwnerContactsTabProps {
  isDark: boolean;
  language: string;
  tc: TcContent;
  contactRequests: any[];
  requestsLoading: boolean;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  inquiryPage: number;
  setInquiryPage: React.Dispatch<React.SetStateAction<number>>;
  INQUIRIES_PER_PAGE: number;
  updateInquiryStatus: (id: string, status: string) => void;
  setSelectedInquiry: (inquiry: any | null) => void;
  activeChatRequestId: string | null;
  setActiveChatRequestId: (id: string | null) => void;
  socketMarkSeen: (id: string) => void;
  resetUnread: () => void;
  user: any;
  ownerToken: string | null;
  unreadByRequest: Record<string, number>;
}

export interface OwnerProfileTabProps {
  user: any;
  tc: TcContent;
  language: string;
  isDark: boolean;
}

export interface OwnerModalsProps {
  isDark: boolean;
  language: string;
  tc: TcContent;
  selectedInquiry: any | null;
  setSelectedInquiry: (inquiry: any | null) => void;
  deleteConfirmId: string | null;
  setDeleteConfirmId: (id: string | null) => void;
  deleteListing: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}
