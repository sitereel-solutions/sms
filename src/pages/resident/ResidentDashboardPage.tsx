import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import {
  Home,
  Receipt,
  CreditCard,
  Bell,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Plus,
  Clock,
  Printer,
  Sparkles,
  Zap,
  Car
} from 'lucide-react';
import { NewComplaintModal } from '../../components/modals/ComplaintDetailModal';

export const ResidentDashboardPage: React.FC = () => {
  const {
    authUser,
    currentResidentProfile,
    currentResidentFlat,
    societySettings,
    payments,
    notices,
    complaints,
    setSelectedReceipt,
    setSelectedNotice,
    setSelectedComplaint,
    setIsQuickPayOpen,
  } = useSociety();

  const [isComplaintOpen, setIsComplaintOpen] = useState<boolean>(false);

  const flatNumber = authUser?.flatNumber || currentResidentFlat?.flatNumber || 'A-101';
  const residentName = authUser?.name || currentResidentProfile?.name || 'Resident';
  const blockName = currentResidentFlat?.block || (flatNumber.length > 0 ? flatNumber.charAt(0) : 'A');

  const myPayments = payments.filter((p) => p.flatNumber === flatNumber);
  const myComplaints = complaints.filter((c) => c.flatNumber === flatNumber);
  const latestPayment = myPayments[0];

  const totalPaidYtd = myPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalCyclesCleared = myPayments.length;
  const maintenanceDueAmount = currentResidentFlat?.monthlyMaintenance || 3500;
  const isPaidThisMonth = latestPayment && (latestPayment.status === 'Success' || latestPayment.date.includes('2026'));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Greeting Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-300 border border-white/10 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Resident Portal · Flat {flatNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Good Morning, {residentName.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Flat {flatNumber} · Block {blockName} · {societySettings.name}
            </p>
          </div>

          {/* Quick Pay CTA Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsQuickPayOpen(true)}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-soft transition-all flex items-center gap-2 hover:scale-105"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isPaidThisMonth ? 'Pay Next Month Dues' : 'Pay Maintenance Dues'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Dues & Payment Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Maintenance Due Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-2xl p-6 text-white shadow-soft relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Monthly Maintenance
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-sm text-white">
                Flat {flatNumber}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight">{formatCurrency(maintenanceDueAmount)}</span>
              <span className="text-xs text-indigo-200">/ month</span>
            </div>
            <p className="text-xs text-indigo-100 mt-1">
              {currentResidentFlat?.bhk || '2 BHK'} ({currentResidentFlat?.areaSqFt || 1150} sq.ft) maintenance + water & sinking charges
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-indigo-200 block text-[10px]">Due Date</span>
              <span className="font-bold text-white">10th of every month</span>
            </div>
            <button
              type="button"
              onClick={() => setIsQuickPayOpen(true)}
              className="px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-bold text-xs shadow-soft-sm transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Pay Now (UPI / Card)
            </button>
          </div>
        </div>

        {/* Total Paid Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Paid (YTD)</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalPaidYtd)}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{totalCyclesCleared} Payment records</p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Account Status</span>
            <span className="font-bold text-emerald-600">Active Resident</span>
          </div>
        </div>

        {/* Last Payment Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Payment</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {latestPayment ? formatCurrency(latestPayment.amount) : '₹0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {latestPayment ? `${latestPayment.date} via ${latestPayment.paymentMode}` : 'No payments recorded'}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100">
            {latestPayment && (
              <button
                type="button"
                onClick={() => setSelectedReceipt(latestPayment)}
                className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> View Receipt #{latestPayment.receiptNumber}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Middle Grid: Flat Overview & Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment History Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Payment History</h3>
              <p className="text-xs text-slate-400">Maintenance receipts and transaction records for Flat {flatNumber}</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              All Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { month: 'August 2026', date: '24 Aug 2026', amount: 3500, receipt: 'REC-2026-00842', mode: 'UPI' },
              { month: 'July 2026', date: '08 Jul 2026', amount: 3500, receipt: 'REC-2026-00780', mode: 'Bank Transfer' },
              { month: 'June 2026', date: '07 Jun 2026', amount: 3500, receipt: 'REC-2026-00714', mode: 'UPI' },
              { month: 'May 2026', date: '09 May 2026', amount: 3500, receipt: 'REC-2026-00650', mode: 'UPI' },
            ].map((p, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const r = myPayments.find((x) => x.receiptNumber === p.receipt) || myPayments[0];
                  if (r) setSelectedReceipt(r);
                }}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{p.month}</span>
                    <span className="text-[11px] text-slate-400">{p.date} · via {p.mode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-black text-slate-900 text-sm">{formatCurrency(p.amount)}</span>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 text-[11px] font-bold transition-colors flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" /> Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flat Details & Utilities Card (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">My Flat Details</h3>
              <p className="text-xs text-slate-400">Unit specifications & allocated amenities</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              2 BHK (1,150 sq.ft)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Allocated Parking</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-indigo-600" /> Slot P-12
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Floor & Block</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5">Floor 1 · Block A</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Power Meter</span>
              <span className="font-mono font-bold text-slate-800 text-[11px] mt-0.5 block truncate">EL-GV-A10192</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Piped PNG Gas</span>
              <span className="font-mono font-bold text-slate-800 text-[11px] mt-0.5 block truncate">PNG-A-10111</span>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Registered Primary Vehicle
            </span>
            <p className="text-slate-700 font-medium">Hyundai Creta · <span className="font-mono font-bold text-indigo-700">GJ-01-MA-1037</span></p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Resident Notices & Resident Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resident Notices (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-600" />
              <h3 className="font-bold text-slate-900 text-sm">Society Notices</h3>
            </div>
            <span className="text-xs text-slate-400">Bulletin Feed</span>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 3).map((not) => (
              <div
                key={not.id}
                onClick={() => setSelectedNotice(not)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-slate-50 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                    {not.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{not.publishDate}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs group-hover:text-cyan-700 transition-colors">
                  {not.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {not.content}
                </p>
                <div className="pt-1 flex justify-end">
                  <span className="text-[11px] font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resident Complaints (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm">My Helpdesk Requests</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsComplaintOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-soft transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> + New Complaint
            </button>
          </div>

          <div className="space-y-3">
            {myComplaints.map((cmp) => (
              <div
                key={cmp.id}
                onClick={() => setSelectedComplaint(cmp)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-slate-50 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-600 text-xs">{cmp.ticketNumber}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(cmp.status)}`}>
                    ● {cmp.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{cmp.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{cmp.description}</p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Category: {cmp.category}</span>
                  <span className="font-bold text-indigo-600">Track Progress →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Complaint Modal */}
      <NewComplaintModal isOpen={isComplaintOpen} onClose={() => setIsComplaintOpen(false)} />
    </div>
  );
};
