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
  ComplaintStatus,
  Society,
  PlatformStats,
  OtpSendResponse,
  OtpVerifyResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'ROLE_SUPER_ADMIN' | 'ROLE_ADMIN' | 'ROLE_RESIDENT';
  societyId?: string;
  societyName?: string;
  subscriptionStatus?: string;
  flatNumber?: string;
  message: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('sms_auth_token');
  const currentSociety = localStorage.getItem('sms_current_society_id');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (currentSociety) {
    headers['X-Society-ID'] = currentSociety;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    let errorMsg = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) errorMsg = errorJson.message;
    } catch {
      // not JSON
    }
    throw new Error(errorMsg);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export const api = {
  // Stored Auth Helpers
  getStoredUser(): AuthResponse | null {
    try {
      const u = localStorage.getItem('sms_auth_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem('sms_auth_token');
  },

  logout(): void {
    localStorage.removeItem('sms_auth_token');
    localStorage.removeItem('sms_auth_user');
  },

  // Authentication
  async login(emailOrPhone: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrPhone, password }),
    });
    const data = await handleResponse<AuthResponse>(res);
    if (data.token) {
      localStorage.setItem('sms_auth_token', data.token);
      localStorage.setItem('sms_auth_user', JSON.stringify(data));
    }
    return data;
  },

  async register(name: string, email: string, password: string, role: string, flatNumber?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, flatNumber }),
    });
    const data = await handleResponse<AuthResponse>(res);
    if (data.token) {
      localStorage.setItem('sms_auth_token', data.token);
      localStorage.setItem('sms_auth_user', JSON.stringify(data));
    }
    return data;
  },

  // OTP Verification & Password Management
  async sendOtp(phone: string, purpose: string = 'ADMIN_REGISTRATION'): Promise<OtpSendResponse> {
    const res = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, purpose }),
    });
    return handleResponse<OtpSendResponse>(res);
  },

  async verifyOtp(phone: string, otp: string, purpose: string = 'ADMIN_REGISTRATION'): Promise<OtpVerifyResponse> {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, purpose }),
    });
    return handleResponse<OtpVerifyResponse>(res);
  },

  async resetPasswordWithOtp(identifier: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp, newPassword }),
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async registerResidentUser(data: { name: string; email: string; phone: string; flatNumber: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register-resident`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(res);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Flats
  async getFlats(): Promise<Flat[]> {
    const res = await fetch(`${API_BASE}/flats`, { headers: getAuthHeaders() });
    return handleResponse<Flat[]>(res);
  },

  async getFlat(id: string): Promise<Flat> {
    const res = await fetch(`${API_BASE}/flats/${encodeURIComponent(id)}`, { headers: getAuthHeaders() });
    return handleResponse<Flat>(res);
  },

  async addFlat(flat: Partial<Flat>): Promise<Flat> {
    const res = await fetch(`${API_BASE}/flats`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(flat),
    });
    return handleResponse<Flat>(res);
  },

  async createFlat(flat: Partial<Flat>): Promise<Flat> {
    return this.addFlat(flat);
  },

  async updateFlat(id: string, flat: Partial<Flat>): Promise<Flat> {
    const res = await fetch(`${API_BASE}/flats/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(flat),
    });
    return handleResponse<Flat>(res);
  },

  async updateFlatResident(id: string, residentData: {
    residentName?: string;
    residentPhone?: string;
    residentEmail?: string;
    ownershipType?: 'Owner' | 'Tenant';
    occupancyStatus?: 'Occupied' | 'Vacant';
  }): Promise<Flat> {
    const res = await fetch(`${API_BASE}/flats/${encodeURIComponent(id)}/resident`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(residentData),
    });
    return handleResponse<Flat>(res);
  },

  async deleteFlat(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/flats/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },

  // Residents
  async getResidents(): Promise<Resident[]> {
    const res = await fetch(`${API_BASE}/residents`, { headers: getAuthHeaders() });
    return handleResponse<Resident[]>(res);
  },

  async getResident(id: string): Promise<Resident> {
    const res = await fetch(`${API_BASE}/residents/${encodeURIComponent(id)}`, { headers: getAuthHeaders() });
    return handleResponse<Resident>(res);
  },

  async addResident(resident: Partial<Resident>): Promise<Resident> {
    const res = await fetch(`${API_BASE}/residents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(resident),
    });
    return handleResponse<Resident>(res);
  },

  async createResident(resident: Partial<Resident>): Promise<Resident> {
    return this.addResident(resident);
  },

  async updateResident(id: string, resident: Partial<Resident>): Promise<Resident> {
    const res = await fetch(`${API_BASE}/residents/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(resident),
    });
    return handleResponse<Resident>(res);
  },

  async deleteResident(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/residents/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },

  // Maintenance Records
  async getMaintenance(): Promise<MaintenanceRecord[]> {
    return this.getMaintenanceRecords();
  },

  async getMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    const res = await fetch(`${API_BASE}/maintenance`, { headers: getAuthHeaders() });
    return handleResponse<MaintenanceRecord[]>(res);
  },

  async generateMaintenanceCycle(
    param1: string | { month: string; billingCycle: string; baseRate?: number; waterCharge?: number; sinkingFundPercent?: number; dueDate?: string },
    param2?: string,
    param3?: number
  ): Promise<any> {
    let bodyData: any = {};
    if (typeof param1 === 'object') {
      bodyData = param1;
    } else {
      bodyData = {
        month: param1,
        billingCycle: param2 || '2026-09',
        baseRate: 3500 * (param3 || 1),
        waterCharge: 350,
        sinkingFundPercent: 10,
        dueDate: '10th of month'
      };
    }
    const res = await fetch(`${API_BASE}/maintenance/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bodyData),
    });
    return handleResponse<any>(res);
  },

  async updateMaintenanceStatus(id: string, status: string, paidDate?: string): Promise<MaintenanceRecord> {
    const res = await fetch(`${API_BASE}/maintenance/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, paidDate }),
    });
    return handleResponse<MaintenanceRecord>(res);
  },

  // Payments
  async getPayments(): Promise<PaymentTransaction[]> {
    const res = await fetch(`${API_BASE}/payments`, { headers: getAuthHeaders() });
    return handleResponse<PaymentTransaction[]>(res);
  },

  async recordPayment(payment: {
    flatNumber: string;
    amount: number;
    paymentMode: string;
    forMonth: string;
    referenceId?: string;
    chequeNumber?: string;
    bankName?: string;
    notes?: string;
  }): Promise<PaymentTransaction> {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payment),
    });
    return handleResponse<PaymentTransaction>(res);
  },

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    const res = await fetch(`${API_BASE}/expenses`, { headers: getAuthHeaders() });
    return handleResponse<Expense[]>(res);
  },

  async addExpense(expense: Partial<Expense>): Promise<Expense> {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(expense),
    });
    return handleResponse<Expense>(res);
  },

  async createExpense(expense: Partial<Expense>): Promise<Expense> {
    return this.addExpense(expense);
  },

  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    const res = await fetch(`${API_BASE}/expenses/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(expense),
    });
    return handleResponse<Expense>(res);
  },

  async deleteExpense(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/expenses/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },

  // Notices
  async getNotices(): Promise<Notice[]> {
    const res = await fetch(`${API_BASE}/notices`, { headers: getAuthHeaders() });
    return handleResponse<Notice[]>(res);
  },

  async addNotice(notice: Partial<Notice>): Promise<Notice> {
    const res = await fetch(`${API_BASE}/notices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(notice),
    });
    return handleResponse<Notice>(res);
  },

  async createNotice(notice: Partial<Notice>): Promise<Notice> {
    return this.addNotice(notice);
  },

  async togglePinNotice(id: string): Promise<Notice> {
    const res = await fetch(`${API_BASE}/notices/${encodeURIComponent(id)}/pin`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse<Notice>(res);
  },

  async toggleNoticePin(id: string): Promise<Notice> {
    return this.togglePinNotice(id);
  },

  async deleteNotice(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notices/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },

  // Complaints
  async getComplaints(): Promise<Complaint[]> {
    const res = await fetch(`${API_BASE}/complaints`, { headers: getAuthHeaders() });
    return handleResponse<Complaint[]>(res);
  },

  async addComplaint(complaint: {
    residentName: string;
    flatNumber: string;
    phone: string;
    category: string;
    title: string;
    description: string;
    priority: string;
  }): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(complaint),
    });
    return handleResponse<Complaint>(res);
  },

  async createComplaint(complaint: any): Promise<Complaint> {
    return this.addComplaint(complaint);
  },

  async updateComplaintStatus(
    id: string,
    status: ComplaintStatus,
    note?: string,
    assignedTo?: string
  ): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note, assignedTo }),
    });
    return handleResponse<Complaint>(res);
  },

  // Settings
  async getSettings(): Promise<SocietySettings> {
    const res = await fetch(`${API_BASE}/settings`, { headers: getAuthHeaders() });
    return handleResponse<SocietySettings>(res);
  },

  async updateSettings(settings: Partial<SocietySettings>): Promise<SocietySettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    return handleResponse<SocietySettings>(res);
  },

  // Activities
  async getActivities(): Promise<ActivityItem[]> {
    const res = await fetch(`${API_BASE}/activities`, { headers: getAuthHeaders() });
    return handleResponse<ActivityItem[]>(res);
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  // SaaS Societies
  async getSocieties(): Promise<Society[]> {
    const res = await fetch(`${API_BASE}/societies`, { headers: getAuthHeaders() });
    return handleResponse<Society[]>(res);
  },

  async getSociety(id: string): Promise<Society> {
    const res = await fetch(`${API_BASE}/societies/${encodeURIComponent(id)}`, { headers: getAuthHeaders() });
    return handleResponse<Society>(res);
  },

  async createSociety(data: Partial<Society> & { adminName?: string; adminEmail?: string; adminPassword?: string; adminPhone?: string; otp?: string }): Promise<Society> {
    const res = await fetch(`${API_BASE}/societies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Society>(res);
  },

  async updateSociety(id: string, data: Partial<Society>): Promise<Society> {
    const res = await fetch(`${API_BASE}/societies/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Society>(res);
  },

  async deleteSociety(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/societies/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },

  async getPlatformStats(): Promise<PlatformStats> {
    const res = await fetch(`${API_BASE}/societies/platform/stats`, { headers: getAuthHeaders() });
    return handleResponse<PlatformStats>(res);
  },
};
