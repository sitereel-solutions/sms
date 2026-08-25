import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import { Society, SubscriptionPlan, SubscriptionStatus } from '../../types';
import {
  Building2,
  Users,
  CreditCard,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Clock,
  Search,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  X,
  Edit,
  DollarSign,
  TrendingUp,
  Layers
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    societies,
    platformStats,
    switchSociety,
    addSociety,
    updateSociety,
    deleteSociety,
    showToast,
  } = useSociety();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOnboardOpen, setIsOnboardOpen] = useState<boolean>(false);
  const [editingSociety, setEditingSociety] = useState<Society | null>(null);

  // Filter societies
  const filteredSocieties = societies.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.city && s.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.subdomain && s.subdomain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalMRR = platformStats?.monthlyRecurringRevenue ?? societies
    .filter((s) => s.subscriptionStatus === 'ACTIVE')
    .reduce((sum, s) => sum + (s.monthlyCharge || 0), 0);

  const activeCount = platformStats?.activeSubscriptions ?? societies.filter((s) => s.subscriptionStatus === 'ACTIVE').length;
  const trialCount = platformStats?.trialSubscriptions ?? societies.filter((s) => s.subscriptionStatus === 'TRIAL').length;
  const totalFlats = platformStats?.totalFlats ?? societies.reduce((sum, s) => sum + (s.totalFlats || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              SaaS Multi-Tenant Root
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ● All Systems Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            SaaS Platform Overview
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Centralized multi-society management, tenant onboarding, automated monthly billing, and MRR metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOnboardOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-soft-xl hover:shadow-indigo-500/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Onboard New Society
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Monthly Recurring Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{formatCurrency(totalMRR)}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Recurring Monthly SaaS
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Client Societies</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-950">{societies.length} Societies</p>
          <span className="text-[11px] text-slate-500 font-medium">
            {activeCount} Active · {trialCount} Trial
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Managed Flats</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-950">{totalFlats} Flats</p>
          <span className="text-[11px] text-blue-600 font-bold">Across all client societies</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Subscription Health</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-950">100%</p>
          <span className="text-[11px] text-purple-600 font-bold">0 Overdue subscriptions</span>
        </div>
      </div>

      {/* Subscription Pricing Matrix Pill */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-soft">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">Standard Society Pricing Plans</h4>
            <p className="text-[11px] text-slate-600">Automated recurring billing charged on 1st of every month</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-white rounded-xl border border-indigo-200 font-semibold text-slate-700 shadow-soft-sm">
            <span className="text-slate-400">Starter:</span> <strong className="text-indigo-600">₹999/mo</strong> (Up to 100 Flats)
          </div>
          <div className="px-3 py-1.5 bg-white rounded-xl border border-indigo-200 font-semibold text-slate-700 shadow-soft-sm">
            <span className="text-slate-400">Growth:</span> <strong className="text-indigo-600">₹1,999/mo</strong> (Up to 250 Flats)
          </div>
          <div className="px-3 py-1.5 bg-white rounded-xl border border-indigo-200 font-semibold text-slate-700 shadow-soft-sm">
            <span className="text-slate-400">Enterprise:</span> <strong className="text-indigo-600">₹2,999/mo</strong> (Unlimited)
          </div>
        </div>
      </div>

      {/* Societies Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Registered Societies & Subscriptions</h3>
            <p className="text-xs text-slate-500">Live tenants on the SaaS management platform</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search society, city, or subdomain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Society Name</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Units</th>
                <th className="py-3.5 px-4">Current Plan</th>
                <th className="py-3.5 px-4">Monthly Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Valid Until</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSocieties.map((soc) => (
                <tr key={soc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-soft-sm shrink-0">
                        {soc.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{soc.name}</p>
                        <p className="text-[11px] text-indigo-600 font-medium">{soc.subdomain ? `${soc.subdomain}.societysaas.in` : soc.registrationNumber || soc.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {soc.city || 'Ahmedabad'}, {soc.state || 'Gujarat'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {soc.totalFlats || 120} Flats
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {soc.subscriptionPlan || 'GROWTH'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {formatCurrency(soc.monthlyCharge || 1999)}
                    <span className="text-[10px] text-slate-400 font-normal block">/ month</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      soc.subscriptionStatus === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : soc.subscriptionStatus === 'TRIAL'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      ● {soc.subscriptionStatus || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    {soc.planExpiresAt || '2027-08-25'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          switchSociety(soc.id);
                          showToast('info', 'Switched Society Context', `You are now browsing as ${soc.name}`);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-soft-sm"
                        title="Enter & Inspect Society Admin Dashboard"
                      >
                        <ExternalLink className="w-3 h-3" /> Inspect
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingSociety(soc)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Subscription / Plan"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Society Modal */}
      {isOnboardOpen && (
        <OnboardSocietyModal
          isOpen={isOnboardOpen}
          onClose={() => setIsOnboardOpen(false)}
          onAdd={addSociety}
        />
      )}

      {/* Edit Subscription Modal */}
      {editingSociety && (
        <EditSubscriptionModal
          isOpen={Boolean(editingSociety)}
          society={editingSociety}
          onClose={() => setEditingSociety(null)}
          onUpdate={updateSociety}
          onDelete={deleteSociety}
        />
      )}
    </div>
  );
};

// Onboard New Society Modal
const OnboardSocietyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => Promise<Society>;
}> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Ahmedabad');
  const [state, setState] = useState<string>('Gujarat');
  const [pincode, setPincode] = useState<string>('380054');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [totalFlats, setTotalFlats] = useState<number>(100);
  const [totalBlocks, setTotalBlocks] = useState<number>(4);
  const [plan, setPlan] = useState<SubscriptionPlan>('GROWTH');
  const [monthlyCharge, setMonthlyCharge] = useState<number>(1999);
  
  // Secretary Admin Credentials
  const [adminName, setAdminName] = useState<string>('');
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [adminPhone, setAdminPhone] = useState<string>('+91 98220 55667');
  
  // OTP Verification State
  const [otp, setOtp] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpMessage, setOtpMessage] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  const handlePlanSelect = (selectedPlan: SubscriptionPlan) => {
    setPlan(selectedPlan);
    if (selectedPlan === 'STARTER') setMonthlyCharge(999);
    if (selectedPlan === 'GROWTH') setMonthlyCharge(1999);
    if (selectedPlan === 'ENTERPRISE') setMonthlyCharge(2999);
    if (selectedPlan === 'TRIAL') setMonthlyCharge(0);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!subdomain) {
      setSubdomain(val.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
  };

  const handleSendOtp = async () => {
    if (!adminPhone || adminPhone.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number for the Society Admin.');
      return;
    }
    setOtpError('');
    setIsSendingOtp(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: adminPhone, purpose: 'ADMIN_REGISTRATION' }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsOtpSent(true);
        if (data.otp) setOtp(data.otp); // Demo auto-fill convenience
        setOtpMessage(`OTP sent to ${adminPhone}. (Code: ${data.otp || 'Check SMS'})`);
      } else {
        setOtpError(data.message || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setOtpError(err.message || 'Network error sending OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }
    setOtpError('');
    setIsVerifyingOtp(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: adminPhone, otp, purpose: 'ADMIN_REGISTRATION' }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsOtpVerified(true);
        setOtpMessage(`Mobile number ${adminPhone} verified successfully!`);
      } else {
        setOtpError(data.message || 'Invalid OTP. Please check and try again.');
      }
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    if (!isOtpVerified) {
      setOtpError('Admin mobile number must be verified via OTP before onboarding.');
      return;
    }

    await onAdd({
      name,
      subdomain: subdomain || name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      registrationNumber,
      address,
      city,
      state,
      pincode,
      contactPhone: adminPhone,
      contactEmail: adminEmail || `admin@${subdomain || 'society'}.in`,
      totalFlats: Number(totalFlats),
      totalBlocks: Number(totalBlocks),
      subscriptionPlan: plan,
      subscriptionStatus: plan === 'TRIAL' ? 'TRIAL' : 'ACTIVE',
      monthlyCharge: Number(monthlyCharge),
      adminName: adminName || `${name} Secretary`,
      adminEmail: adminEmail || `admin@${subdomain || 'society'}.in`,
      adminPassword: adminPassword || 'admin123',
      adminPhone,
      otp,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Onboard New Housing Society</h3>
              <p className="text-xs text-slate-500">Create tenant account & verify admin mobile via OTP</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
          {/* Society Name & Subdomain */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Society Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Skyline Heights CHS"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tenant Subdomain *</label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  placeholder="skyline"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-l-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="px-2.5 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-xl text-slate-500 font-mono text-[11px]">
                  .saas
                </span>
              </div>
            </div>
          </div>

          {/* Location & Flats */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Total Flats</label>
              <input
                type="number"
                value={totalFlats}
                onChange={(e) => setTotalFlats(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Blocks / Wings</label>
              <input
                type="number"
                value={totalBlocks}
                onChange={(e) => setTotalBlocks(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Subscription Plan Selection */}
          <div className="space-y-2 pt-1">
            <label className="font-semibold text-slate-700 block">Select SaaS Subscription Plan</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePlanSelect('STARTER')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  plan === 'STARTER' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-slate-900 block text-xs">Starter</span>
                <span className="font-black text-indigo-600 block text-sm mt-0.5">₹999 / mo</span>
                <span className="text-[10px] text-slate-500">Up to 100 Flats</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlanSelect('GROWTH')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  plan === 'GROWTH' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-slate-900 block text-xs">Growth</span>
                <span className="font-black text-indigo-600 block text-sm mt-0.5">₹1,999 / mo</span>
                <span className="text-[10px] text-slate-500">Up to 250 Flats</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlanSelect('ENTERPRISE')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  plan === 'ENTERPRISE' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-slate-900 block text-xs">Enterprise</span>
                <span className="font-black text-indigo-600 block text-sm mt-0.5">₹2,999 / mo</span>
                <span className="text-[10px] text-slate-500">Unlimited Flats</span>
              </button>
            </div>
          </div>

          {/* Secretary Admin Credentials & Mobile OTP Verification */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Society Admin & Mobile OTP Verification
              </span>
              {isOtpVerified && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Mobile Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Admin Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kulkarni"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Admin Email *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@society.in"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Mobile Number & OTP Trigger */}
            <div className="space-y-2 pt-1 border-t border-indigo-100">
              <label className="text-[11px] font-bold text-slate-800 block">
                Admin Mobile Number * (Required for OTP)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="+91 98220 55667"
                  disabled={isOtpVerified}
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-xl text-slate-800 bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    isOtpVerified ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'border-slate-300'
                  }`}
                />
                {!isOtpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-soft-sm"
                  >
                    {isSendingOtp ? 'Sending...' : (isOtpSent ? 'Resend OTP' : 'Send OTP')}
                  </button>
                )}
              </div>

              {/* OTP Input box */}
              {isOtpSent && !isOtpVerified && (
                <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800">Enter 6-Digit Verification Code</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">5 mins valid</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-center font-mono font-black text-sm tracking-widest text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
                    >
                      {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </div>
              )}

              {otpMessage && (
                <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ✓ {otpMessage}
                </p>
              )}
              {otpError && (
                <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  ⚠️ {otpError}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isOtpVerified}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-soft transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" /> Provision & Launch Society
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Subscription Modal
const EditSubscriptionModal: React.FC<{
  isOpen: boolean;
  society: Society;
  onClose: () => void;
  onUpdate: (id: string, data: any) => Promise<Society>;
  onDelete: (id: string) => Promise<void>;
}> = ({ isOpen, society, onClose, onUpdate, onDelete }) => {
  const [plan, setPlan] = useState<SubscriptionPlan>(society.subscriptionPlan || 'GROWTH');
  const [status, setStatus] = useState<SubscriptionStatus>(society.subscriptionStatus || 'ACTIVE');
  const [monthlyCharge, setMonthlyCharge] = useState<number>(society.monthlyCharge || 1999);
  const [expiresAt, setExpiresAt] = useState<string>(society.planExpiresAt || '2027-08-25');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(society.id, {
      subscriptionPlan: plan,
      subscriptionStatus: status,
      monthlyCharge: Number(monthlyCharge),
      planExpiresAt: expiresAt,
    });
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${society.name} from the platform?`)) {
      await onDelete(society.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">{society.name}</h3>
            <p className="text-xs text-slate-500">Manage Subscription & Billing</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Subscription Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as SubscriptionPlan)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="STARTER">Starter (₹999/mo)</option>
                <option value="GROWTH">Growth (₹1,999/mo)</option>
                <option value="ENTERPRISE">Enterprise (₹2,999/mo)</option>
                <option value="TRIAL">Free Trial</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="ACTIVE">Active</option>
                <option value="TRIAL">Trial</option>
                <option value="PAST_DUE">Past Due / Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Monthly Charge (₹)</label>
              <input
                type="number"
                value={monthlyCharge}
                onChange={(e) => setMonthlyCharge(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Plan Expiration</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleDelete}
              className="text-rose-600 hover:text-rose-700 font-bold text-xs"
            >
              Delete Society
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-soft">
                Save Updates
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
