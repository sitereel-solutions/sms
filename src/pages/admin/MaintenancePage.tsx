import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import {
  Layers,
  Search,
  Plus,
  Send,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Eye,
  Filter,
  Users
} from 'lucide-react';
import { GenerateMaintenanceModal } from '../../components/modals/GenerateMaintenanceModal';

export const MaintenancePage: React.FC = () => {
  const {
    maintenanceRecords,
    setSelectedReceipt,
    setSelectedFlat,
    flats,
    payments,
    sendReminder,
    sendBulkReminders,
    showToast,
  } = useSociety();

  const [selectedMonth, setSelectedMonth] = useState<string>('August 2026');
  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerateOpen, setIsGenerateOpen] = useState<boolean>(false);

  const availableMonths = Array.from(
    new Set([
      'September 2026',
      'August 2026',
      'July 2026',
      'June 2026',
      ...maintenanceRecords.map((r) => r.month),
    ])
  ).filter(Boolean);
  const filteredRecords = maintenanceRecords.filter((rec) => {
    const matchesSearch =
      rec.flatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.residentName.toLowerCase().includes(searchQuery.toLowerCase());

    const flatBlock = rec.flatNumber.split('-')[0];
    const matchesBlock = selectedBlock === 'All' || flatBlock === selectedBlock;
    const matchesStatus = selectedStatus === 'All' || rec.status === selectedStatus;
    const matchesMonth = selectedMonth === 'All' || rec.month === selectedMonth;

    return matchesSearch && matchesBlock && matchesStatus && matchesMonth;
  });

  const totalBilled = 420000;
  const collected = 384000;
  const pending = 28000;
  const overdue = 8000;

  const handleExportBilling = () => {
    showToast('success', 'Billing Sheet Exported', 'Maintenance_Billing_August_2026.xlsx exported successfully.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maintenance Billing</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {selectedMonth}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Automated billing cycles, water & sinking charges, and payment reconciliations</p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={sendBulkReminders}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors"
          >
            <Send className="w-3.5 h-3.5" /> Broadcast Reminders
          </button>
          <button
            type="button"
            onClick={() => setIsGenerateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-soft transition-colors"
          >
            <Plus className="w-4 h-4" /> Generate Maintenance
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Billed</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalBilled)}</p>
          <span className="text-[10px] text-slate-400">108 Occupied flats</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Collected</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(collected)}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">91.4% Collected</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{formatCurrency(pending)}</p>
          <span className="text-[10px] text-slate-400">Due by 10th Aug</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Overdue</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(overdue)}</p>
          <span className="text-[10px] text-rose-600 font-semibold">Late fine applicable</span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by flat number (A-101) or resident name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
              <option value="All">All Cycles</option>
            </select>

            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Blocks</option>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((b) => (
                <option key={b} value={b}>Block {b}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>

            <button
              type="button"
              onClick={handleExportBilling}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Download Excel Spreadsheet"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Flat</th>
                <th className="py-3.5 px-4">Resident</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Paid</th>
                <th className="py-3.5 px-4">Balance</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">{rec.flatNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{rec.residentName}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">{formatCurrency(rec.totalAmount)}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{formatCurrency(rec.paidAmount)}</td>
                  <td className="py-3.5 px-4 font-bold text-rose-600">{formatCurrency(rec.balanceAmount)}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{rec.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(rec.status)}`}>
                      ● {rec.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {rec.status === 'Paid' ? (
                        <button
                          type="button"
                          onClick={() => {
                            const p = payments.find((x) => x.flatNumber === rec.flatNumber) || payments[0];
                            setSelectedReceipt(p);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <Receipt className="w-3 h-3" /> Receipt
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => sendReminder(rec.flatNumber, rec.residentName, rec.balanceAmount)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> Remind
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Maintenance Modal */}
      <GenerateMaintenanceModal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} />
    </div>
  );
};
