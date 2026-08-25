export type OwnershipType = 'Owner' | 'Tenant' | 'Vacant';
export type FlatStatus = 'Occupied' | 'Vacant';
export type MaintenanceStatus = 'Paid' | 'Pending' | 'Overdue';
export type PaymentMode = 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque' | 'Online';
export type ExpenseCategory =
  | 'Electricity'
  | 'Security'
  | 'Housekeeping'
  | 'Lift'
  | 'Water'
  | 'Gardening'
  | 'Repairs'
  | 'AMC'
  | 'Salary'
  | 'Other';
export type ExpenseStatus = 'Paid' | 'Pending' | 'Approved';

export type NoticeCategory =
  | 'Maintenance'
  | 'Meeting'
  | 'Celebration'
  | 'Rules'
  | 'Emergency'
  | 'General';
export type NoticePriority = 'Urgent' | 'High' | 'Normal';

export type ComplaintCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Lift'
  | 'Security'
  | 'Cleanliness'
  | 'Noise'
  | 'Carpentry'
  | 'Other';
export type ComplaintPriority = 'High' | 'Medium' | 'Low';
export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';

export interface Flat {
  id: string;
  societyId?: string;
  flatNumber: string; // e.g. "A-101"
  block: string;      // "A" to "F"
  floor: number;      // 1 to 5
  bhk: '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK';
  areaSqFt: number;
  occupancyStatus: FlatStatus;
  ownershipType: OwnershipType;
  residentName?: string;
  residentPhone?: string;
  residentEmail?: string;
  monthlyMaintenance: number;
  maintenanceStatus: MaintenanceStatus;
  parkingSlot: string;
  electricityMeter: string;
  gasMeter: string;
}

export interface Resident {
  id: string;
  societyId?: string;
  name: string;
  flatNumber: string;
  block: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  ownership: 'Owner' | 'Tenant';
  memberCount: number;
  vehicles: {
    type: 'Car' | 'Bike';
    model: string;
    number: string;
  }[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  maintenanceAmount: number;
  status: 'Active' | 'Inactive';
  moveInDate: string;
  avatarColor: string;
}

export interface MaintenanceRecord {
  id: string;
  societyId?: string;
  flatNumber: string;
  residentName: string;
  month: string;        // e.g. "August 2026"
  billingCycle: string; // "2026-08"
  baseAmount: number;
  waterCharges: number;
  sinkingFund: number;
  parkingCharges: number;
  lateFee: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;      // "10 Aug 2026"
  status: MaintenanceStatus;
  paidDate?: string;
  paymentReceiptId?: string;
}

export interface PaymentTransaction {
  id: string;
  societyId?: string;
  receiptNumber: string; // "REC-2026-00842"
  date: string;          // "24 Aug 2026"
  timestamp: string;
  residentName: string;
  flatNumber: string;
  amount: number;
  forMonth: string;      // "August 2026 Maintenance"
  paymentMode: PaymentMode;
  referenceId: string;   // "UPI928374"
  chequeNumber?: string;
  bankName?: string;
  status: 'Success' | 'Pending' | 'Failed';
  notes?: string;
}

export interface Expense {
  id: string;
  societyId?: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  vendor: string;
  vendorContact?: string;
  invoiceNumber: string;
  amount: number;
  paymentMode: PaymentMode;
  status: ExpenseStatus;
  approvedBy: string;
  notes?: string;
}

export interface Notice {
  id: string;
  societyId?: string;
  title: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishDate: string;
  validTill: string;
  content: string;
  publishedBy: string;
  isPinned?: boolean;
  attachmentName?: string;
}

export interface ComplaintTimelineItem {
  date: string;
  status: ComplaintStatus;
  note: string;
}

export interface Complaint {
  id: string;
  societyId?: string;
  ticketNumber: string; // "#CMP-1024"
  residentName: string;
  flatNumber: string;
  phone: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  date: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedTo?: string;
  resolvedDate?: string;
  resolutionNotes?: string;
  timeline: ComplaintTimelineItem[];
}

export interface CommitteeMember {
  role: string;
  name: string;
  flatNumber: string;
  phone: string;
  email: string;
}

export type SubscriptionPlan = 'STARTER' | 'GROWTH' | 'ENTERPRISE' | 'TRIAL';
export type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED';

export interface Society {
  id: string;
  name: string;
  subdomain?: string;
  registrationNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactPhone?: string;
  contactEmail?: string;
  totalFlats?: number;
  totalBlocks?: number;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
  monthlyCharge?: number;
  planExpiresAt?: string;
  active?: boolean;
  createdAt?: string;
}

export interface PlatformStats {
  totalSocieties: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  overdueSubscriptions: number;
  monthlyRecurringRevenue: number;
  totalFlats: number;
  totalUsers: number;
}

export interface SocietySettings {
  name: string;
  subtitle: string;
  registrationNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPhone: string;
  contactEmail: string;
  totalFlats: number;
  totalBlocks: number;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifsc: string;
    branch: string;
    upiId: string;
  };
  maintenanceConfig: {
    defaultFlatRate: number;
    sqFtRate: number;
    billingDayOfMonth: number;
    dueDayOfMonth: number;
    lateFeePerWeek: number;
    waterChargePerFlat: number;
    sinkingFundPercentage: number;
  };
  committeeMembers: CommitteeMember[];
}

export interface ActivityItem {
  id: string;
  societyId?: string;
  title: string;
  subtitle: string;
  timestamp: string;
  timeAgo: string;
  type: 'payment' | 'expense' | 'resident' | 'maintenance' | 'complaint' | 'notice';
  iconColor: string;
}

export type UserRole = 'super_admin' | 'admin' | 'resident';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  societyId: string;
  societyName: string;
  subscriptionStatus?: string;
  flatNumber?: string;
}

export interface OtpSendResponse {
  success: boolean;
  phone: string;
  purpose: string;
  otp?: string;
  expiresInSeconds: number;
  message: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  message: string;
  phone: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}
