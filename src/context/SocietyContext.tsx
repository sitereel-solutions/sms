import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Flat,
  Resident,
  MaintenanceRecord,
  PaymentTransaction,
  Expense,
  Notice,
  Complaint,
  SocietySettings,
  ActivityItem,
  UserRole,
  ToastMessage,
  ComplaintStatus,
  Society,
  PlatformStats
} from '../types';
import { api, AuthResponse } from '../services/api';

const defaultSocietySettings: SocietySettings = {
  name: 'Green Valley Residency',
  subtitle: 'Cooperative Housing Society Ltd.',
  registrationNumber: 'GRV/2020/123/GUJ',
  address: 'Plot 42, SG Highway, Bodakdev',
  city: 'Ahmedabad',
  state: 'Gujarat',
  pincode: '380054',
  contactPhone: '+91 79 2685 4100',
  contactEmail: 'office@greenvalleyresidency.in',
  totalFlats: 120,
  totalBlocks: 6,
  bankDetails: {
    bankName: 'HDFC Bank Ltd.',
    accountName: 'Green Valley Residency CHS Maintenance A/c',
    accountNumber: '50200038491029',
    ifsc: 'HDFC0001024',
    branch: 'Bodakdev Branch, Ahmedabad',
    upiId: 'greenvalley@hdfcbank',
  },
  maintenanceConfig: {
    defaultFlatRate: 3500,
    sqFtRate: 3.0,
    billingDayOfMonth: 1,
    dueDayOfMonth: 10,
    lateFeePerWeek: 250,
    waterChargePerFlat: 350,
    sinkingFundPercentage: 10,
  },
  committeeMembers: [
    { role: 'Chairman', name: 'Dr. Vikram Mehta', flatNumber: 'C-501', phone: '+91 98250 11223', email: 'chairman@greenvalleyresidency.in' },
    { role: 'Hon. Secretary', name: 'Rahul Sharma', flatNumber: 'A-101', phone: '+91 98765 43210', email: 'secretary@greenvalleyresidency.in' },
    { role: 'Treasurer', name: 'Sneha Patel', flatNumber: 'B-302', phone: '+91 98980 33445', email: 'treasurer@greenvalleyresidency.in' },
  ],
};

interface SocietyContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  flats: Flat[];
  residents: Resident[];
  maintenanceRecords: MaintenanceRecord[];
  payments: PaymentTransaction[];
  expenses: Expense[];
  notices: Notice[];
  complaints: Complaint[];
  societySettings: SocietySettings;
  activities: ActivityItem[];
  toasts: ToastMessage[];
  isLoading: boolean;
  showToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  dismissToast: (id: string) => void;
  
  // SaaS Multi-Tenant Platform
  societies: Society[];
  currentSociety: Society | null;
  platformStats: PlatformStats | null;
  switchSociety: (societyId: string) => void;
  addSociety: (data: Partial<Society> & { adminName?: string; adminEmail?: string; adminPassword?: string; adminPhone?: string }) => Promise<Society>;
  updateSociety: (id: string, data: Partial<Society>) => Promise<Society>;
  deleteSociety: (id: string) => Promise<void>;
  refreshSocieties: () => Promise<void>;

  // Modals & Drawers state
  selectedReceipt: PaymentTransaction | null;
  setSelectedReceipt: (receipt: PaymentTransaction | null) => void;
  selectedInvoice: Expense | null;
  setSelectedInvoice: (expense: Expense | null) => void;
  selectedFlat: Flat | null;
  setSelectedFlat: (flat: Flat | null) => void;
  selectedResident: Resident | null;
  setSelectedResident: (resident: Resident | null) => void;
  selectedNotice: Notice | null;
  setSelectedNotice: (notice: Notice | null) => void;
  selectedComplaint: Complaint | null;
  setSelectedComplaint: (complaint: Complaint | null) => void;
  isQuickPayOpen: boolean;
  setIsQuickPayOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  
  // Authentication & Active User
  authUser: AuthResponse | null;
  setAuthUser: (user: AuthResponse | null) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Active resident profile
  currentResidentFlat: Flat | undefined;
  currentResidentProfile: Resident | undefined;

  // Actions
  recordPayment: (payment: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'timestamp' | 'status'>) => PaymentTransaction;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<Expense>;
  createNotice: (notice: Omit<Notice, 'id' | 'publishDate'>) => Promise<Notice>;
  toggleNoticePin: (id: string) => Promise<void>;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'ticketNumber' | 'date' | 'timeline'>) => Promise<Complaint>;
  updateComplaintStatus: (id: string, status: ComplaintStatus, note?: string) => Promise<void>;
  generateMaintenanceCycle: (month: string, billingCycle: string, baseMultiplier?: number) => Promise<void>;
  sendReminder: (flatNumber: string, residentName: string, amount: number) => void;
  sendBulkReminders: () => void;
  addFlat: (flat: Omit<Flat, 'id'>) => Promise<void>;
  updateFlat: (id: string, flat: Partial<Flat>) => Promise<void>;
  addResident: (resident: Omit<Resident, 'id'>) => Promise<void>;
  updateResident: (id: string, resident: Partial<Resident>) => Promise<void>;
  updateSocietySettings: (settings: SocietySettings) => Promise<void>;
  refreshData: () => Promise<void>;
}

const SocietyContext = createContext<SocietyContextType | undefined>(undefined);

export const SocietyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthResponse | null>(() => api.getStoredUser());
  const [role, setRole] = useState<UserRole>(() => {
    const stored = api.getStoredUser();
    if (stored?.role === 'ROLE_SUPER_ADMIN') return 'super_admin';
    if (stored?.role === 'ROLE_ADMIN') return 'admin';
    if (stored?.role === 'ROLE_RESIDENT') return 'resident';
    return 'admin';
  });

  // SaaS Societies state
  const [societies, setSocieties] = useState<Society[]>([]);
  const [currentSocietyId, setCurrentSocietyId] = useState<string>(() => {
    return api.getStoredUser()?.societyId || 'soc-grv';
  });
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);

  // Entities state: loaded from database
  const [flats, setFlats] = useState<Flat[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [societySettings, setSocietySettings] = useState<SocietySettings>(defaultSocietySettings);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Selected entities for modals
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Expense | null>(null);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isQuickPayOpen, setIsQuickPayOpen] = useState<boolean>(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);

  const currentSociety = societies.find((s) => s.id === currentSocietyId) || societies[0] || null;

  const logout = () => {
    api.logout();
    setAuthUser(null);
    setRole('admin');
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const showToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshSocieties = async () => {
    try {
      const [socList, stats] = await Promise.all([
        api.getSocieties().catch(() => []),
        api.getPlatformStats().catch(() => null),
      ]);
      setSocieties(socList || []);
      setPlatformStats(stats);
    } catch (err) {
      console.error('Failed to load societies:', err);
    }
  };

  // Synchronize 100% with Spring Boot Database
  const refreshData = async () => {
    try {
      const [
        backendFlats,
        backendResidents,
        backendMaint,
        backendPayments,
        backendExpenses,
        backendNotices,
        backendComplaints,
        backendSettings,
        backendActivities,
        socList,
        pStats,
      ] = await Promise.all([
        api.getFlats().catch(() => []),
        api.getResidents().catch(() => []),
        api.getMaintenance().catch(() => []),
        api.getPayments().catch(() => []),
        api.getExpenses().catch(() => []),
        api.getNotices().catch(() => []),
        api.getComplaints().catch(() => []),
        api.getSettings().catch(() => defaultSocietySettings),
        api.getActivities().catch(() => []),
        api.getSocieties().catch(() => []),
        api.getPlatformStats().catch(() => null),
      ]);

      setFlats(backendFlats || []);
      setResidents(backendResidents || []);
      setMaintenanceRecords(backendMaint || []);
      setPayments(backendPayments || []);
      setExpenses(backendExpenses || []);
      setNotices(backendNotices || []);
      setComplaints(backendComplaints || []);
      if (backendSettings && backendSettings.name) {
        setSocietySettings(backendSettings);
      }
      setActivities(backendActivities || []);
      setSocieties(socList || []);
      setPlatformStats(pStats);
    } catch (err) {
      console.error('Failed to load data from database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const switchSociety = (societyId: string) => {
    setCurrentSocietyId(societyId);
    const target = societies.find((s) => s.id === societyId);
    if (target) {
      setSocietySettings((prev) => ({
        ...prev,
        name: target.name,
        address: target.address || prev.address,
        city: target.city || prev.city,
        state: target.state || prev.state,
        totalFlats: target.totalFlats || prev.totalFlats,
      }));
      showToast('info', 'Switched Society', `Now managing ${target.name}`);
    }
  };

  const addSociety = async (data: Partial<Society> & { adminName?: string; adminEmail?: string; adminPassword?: string; adminPhone?: string }): Promise<Society> => {
    try {
      const created = await api.createSociety(data);
      setSocieties((prev) => [...prev, created]);
      showToast('success', 'Society Onboarded', `"${created.name}" is now live on the SaaS platform.`);
      await refreshSocieties();
      return created;
    } catch (err: any) {
      showToast('error', 'Onboarding Failed', err.message || 'Could not create society.');
      throw err;
    }
  };

  const updateSociety = async (id: string, data: Partial<Society>): Promise<Society> => {
    try {
      const updated = await api.updateSociety(id, data);
      setSocieties((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast('success', 'Society Updated', `${updated.name} subscription & settings updated.`);
      await refreshSocieties();
      return updated;
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message || 'Could not update society.');
      throw err;
    }
  };

  const deleteSociety = async (id: string): Promise<void> => {
    try {
      await api.deleteSociety(id);
      setSocieties((prev) => prev.filter((s) => s.id !== id));
      showToast('success', 'Society Removed', 'Society account has been deleted.');
      await refreshSocieties();
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message || 'Could not delete society.');
      throw err;
    }
  };

  // Keyboard shortcut for Cmd/Ctrl + K (Global Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync auth role with active profile
  const currentResidentFlat = flats.find(
    (f) => (authUser?.flatNumber && f.flatNumber === authUser.flatNumber) ||
           (authUser?.email && f.residentEmail?.toLowerCase() === authUser.email.toLowerCase()) ||
           f.flatNumber === 'A-101'
  );

  const currentResidentProfile = residents.find(
    (r) => (authUser?.flatNumber && r.flatNumber === authUser.flatNumber) ||
           (authUser?.email && r.email?.toLowerCase() === authUser.email.toLowerCase()) ||
           r.flatNumber === 'A-101'
  );

  // Record a payment directly into database
  const recordPayment = (paymentData: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'timestamp' | 'status'>): PaymentTransaction => {
    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber: `REC-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      timestamp: new Date().toISOString(),
      status: 'Success',
    };

    api.recordPayment(paymentData).then(() => {
      refreshData();
    }).catch((err) => {
      showToast('error', 'Payment Failed', err.message || 'Could not save payment in database.');
    });

    setPayments((prev) => [newPayment, ...prev]);
    showToast('success', 'Payment Recorded', `Receipt #${newPayment.receiptNumber} issued for ${newPayment.flatNumber}`);
    return newPayment;
  };

  // Add an expense into database
  const addExpense = async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
    try {
      const savedExpense = await api.createExpense(expenseData);
      setExpenses((prev) => [savedExpense, ...prev]);
      showToast('success', 'Expense Recorded', `Voucher #${savedExpense.invoiceNumber} saved in database.`);
      await refreshData();
      return savedExpense;
    } catch (err: any) {
      showToast('error', 'Expense Failed', err.message || 'Could not save expense in database.');
      throw err;
    }
  };

  // Create a notice directly into database
  const createNotice = async (noticeData: Omit<Notice, 'id' | 'publishDate'>): Promise<Notice> => {
    try {
      const savedNotice = await api.createNotice(noticeData);
      setNotices((prev) => [savedNotice, ...prev]);
      showToast('success', 'Notice Published', `"${savedNotice.title}" broadcast to database.`);
      await refreshData();
      return savedNotice;
    } catch (err: any) {
      showToast('error', 'Notice Failed', err.message || 'Could not publish notice.');
      throw err;
    }
  };

  // Toggle Notice Pin
  const toggleNoticePin = async (id: string): Promise<void> => {
    try {
      const updatedNotice = await api.toggleNoticePin(id);
      setNotices((prev) => prev.map((n) => (n.id === id ? updatedNotice : n)));
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Could not update pin status.');
    }
  };

  // Add a complaint directly into database
  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'ticketNumber' | 'date' | 'timeline'>): Promise<Complaint> => {
    try {
      const savedComplaint = await api.createComplaint(complaintData);
      setComplaints((prev) => [savedComplaint, ...prev]);
      showToast('info', 'Complaint Registered', `Ticket ${savedComplaint.ticketNumber} saved in database.`);
      await refreshData();
      return savedComplaint;
    } catch (err: any) {
      showToast('error', 'Complaint Failed', err.message || 'Could not log complaint.');
      throw err;
    }
  };

  // Update complaint status in database
  const updateComplaintStatus = async (id: string, status: ComplaintStatus, note?: string): Promise<void> => {
    try {
      const updatedComplaint = await api.updateComplaintStatus(id, status, note);
      setComplaints((prev) => prev.map((cmp) => (cmp.id === id ? updatedComplaint : cmp)));
      showToast('success', 'Complaint Updated', `Ticket status changed to ${status}`);
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message || 'Could not update complaint.');
    }
  };

  // Generate maintenance cycle in database
  const generateMaintenanceCycle = async (month: string, billingCycle: string, baseMultiplier = 1): Promise<void> => {
    try {
      const newRecords = await api.generateMaintenanceCycle(month, billingCycle, baseMultiplier);
      setMaintenanceRecords((prev) => [...newRecords, ...prev]);
      showToast('success', 'Maintenance Generated', `Successfully generated billing records in database.`);
      await refreshData();
    } catch (err: any) {
      showToast('error', 'Generation Failed', err.message || 'Could not generate maintenance cycle.');
    }
  };

  // Add Flat
  const addFlat = async (flatData: Omit<Flat, 'id'>): Promise<void> => {
    try {
      const savedFlat = await api.createFlat(flatData);
      setFlats((prev) => [...prev, savedFlat]);
      showToast('success', 'Flat Added', `Unit ${savedFlat.flatNumber} registered in database.`);
      await refreshData();
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Could not add flat.');
    }
  };

  // Update Flat
  const updateFlat = async (id: string, flatUpdate: Partial<Flat>): Promise<void> => {
    try {
      const updated = await api.updateFlat(id, flatUpdate);
      setFlats((prev) => prev.map((f) => (f.id === id || f.flatNumber === id ? updated : f)));
      showToast('success', 'Flat Updated', `Flat details updated in database.`);
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Could not update flat.');
    }
  };

  // Add Resident
  const addResident = async (residentData: Omit<Resident, 'id'>): Promise<void> => {
    try {
      const savedResident = await api.createResident(residentData);
      setResidents((prev) => [savedResident, ...prev]);
      showToast('success', 'Resident Added', `${savedResident.name} registered in database.`);
      await refreshData();
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Could not add resident.');
    }
  };

  // Update Resident
  const updateResident = async (id: string, residentUpdate: Partial<Resident>): Promise<void> => {
    try {
      const updated = await api.updateResident(id, residentUpdate);
      setResidents((prev) => prev.map((r) => (r.id === id || r.flatNumber === id ? updated : r)));
      showToast('success', 'Resident Updated', `Resident profile updated in database.`);
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Could not update resident.');
    }
  };

  // Update Society Settings
  const updateSocietySettings = async (newSettings: SocietySettings): Promise<void> => {
    try {
      const updated = await api.updateSettings(newSettings);
      setSocietySettings(updated);
      showToast('success', 'Settings Saved', 'Society configurations updated in database.');
    } catch (err: any) {
      showToast('error', 'Settings Failed', err.message || 'Could not save settings in database.');
    }
  };

  // Send WhatsApp Reminder
  const sendReminder = (flatNumber: string, residentName: string, amount: number) => {
    const text = encodeURIComponent(
      `Dear ${residentName},\n\nThis is a friendly reminder from ${societySettings.name} regarding pending maintenance dues of ₹${amount.toLocaleString('en-IN')}.\n\nPlease clear the balance before the due date to avoid late fine charges.\n\nThank you,\nManagement Committee`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    showToast('info', 'WhatsApp Reminder Prepared', `Opened WhatsApp chat for ${residentName} (${flatNumber})`);
  };

  // Send Bulk Reminders
  const sendBulkReminders = () => {
    const pendingCount = maintenanceRecords.filter((r) => r.status === 'Pending' || r.status === 'Overdue').length;
    showToast('success', 'Bulk Reminders Sent', `Dispatched digital reminders to ${pendingCount} flats with pending dues.`);
  };

  return (
    <SocietyContext.Provider
      value={{
        role,
        setRole,
        authUser,
        setAuthUser,
        logout,
        switchRole,
        societies,
        currentSociety,
        platformStats,
        switchSociety,
        addSociety,
        updateSociety,
        deleteSociety,
        refreshSocieties,
        flats,
        residents,
        maintenanceRecords,
        payments,
        expenses,
        notices,
        complaints,
        societySettings,
        activities,
        toasts,
        isLoading,
        showToast,
        dismissToast,
        selectedReceipt,
        setSelectedReceipt,
        selectedInvoice,
        setSelectedInvoice,
        selectedFlat,
        setSelectedFlat,
        selectedResident,
        setSelectedResident,
        selectedNotice,
        setSelectedNotice,
        selectedComplaint,
        setSelectedComplaint,
        isQuickPayOpen,
        setIsQuickPayOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        currentResidentFlat,
        currentResidentProfile,
        recordPayment,
        addExpense,
        createNotice,
        toggleNoticePin,
        addComplaint,
        updateComplaintStatus,
        generateMaintenanceCycle,
        sendReminder,
        sendBulkReminders,
        addFlat,
        updateFlat,
        addResident,
        updateResident,
        updateSocietySettings,
        refreshData,
      }}
    >
      {children}
    </SocietyContext.Provider>
  );
};

export const useSociety = (): SocietyContextType => {
  const context = useContext(SocietyContext);
  if (!context) {
    throw new Error('useSociety must be used within a SocietyProvider');
  }
  return context;
};
