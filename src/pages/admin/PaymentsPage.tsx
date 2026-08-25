import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  Smartphone,
  Landmark,
  Banknote,
  FileCheck
} from 'lucide-react';
import { RecordPaymentModal } from '../../components/modals/RecordPaymentModal';

export const PaymentsPage: React.FC = () => {
  const { payments, setSelectedReceipt, showToast } = useSociety();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);

  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.flatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.referenceId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMode = selectedMode === 'All' || pay.paymentMode === selectedMode;

    return matchesSearch && matchesMode;
  });

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const upiCount = payments.filter((p) => p.paymentMode === 'UPI').length;
  const bankCount = payments.filter((p) => p.paymentMode === 'Bank Transfer').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payments & Receipts</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ₹3,84,000 Collected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Real-time payment audit log, transaction IDs, and printable vouchers</p>
        </div>

        <button
          type="button"
          onClick={() => setIsRecordModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {/* Payment Mode KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Collections</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(totalCollected)}</p>
          <span className="text-[10px] text-slate-400">{payments.length} Transactions recorded</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">UPI / QR</span>
            <Smartphone className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{upiCount} TXNs</p>
          <span className="text-[10px] text-indigo-600 font-semibold">GPay, PhonePe, Paytm</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">NetBanking / NEFT</span>
            <Landmark className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{bankCount} TXNs</p>
          <span className="text-[10px] text-blue-600 font-semibold">HDFC Society A/C</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Cheque / Cash</span>
            <Banknote className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {payments.filter((p) => p.paymentMode === 'Cheque' || p.paymentMode === 'Cash').length} TXNs
          </p>
          <span className="text-[10px] text-slate-400">Manual vouchers</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by receipt no (REC-2026-00842), resident, flat, or TXN ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Payment Modes</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
              <option value="Online">Online Gateway</option>
              <option value="Cheque">Cheque</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt No</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Resident</th>
                <th className="py-3.5 px-4">Flat</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Mode</th>
                <th className="py-3.5 px-4">Reference / TXN</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((pay) => (
                <tr
                  key={pay.id}
                  onClick={() => setSelectedReceipt(pay)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">{pay.receiptNumber}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{pay.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{pay.residentName}</td>
                  <td className="py-3 px-4 font-bold text-slate-700">{pay.flatNumber}</td>
                  <td className="py-3 px-4 font-black text-slate-900 text-sm">{formatCurrency(pay.amount)}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {pay.paymentMode}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[140px]">
                    {pay.referenceId}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Success
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReceipt(pay);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" /> View Voucher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} />
    </div>
  );
};
