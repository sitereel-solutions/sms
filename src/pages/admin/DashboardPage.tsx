import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Building2,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Receipt,
  Download,
  Calendar,
  Layers,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { RecordPaymentModal } from '../../components/modals/RecordPaymentModal';
import { AddExpenseModal } from '../../components/modals/AddExpenseModal';
import { GenerateMaintenanceModal } from '../../components/modals/GenerateMaintenanceModal';

const MONTHLY_CHART_DATA = [
  // { month: 'Jan', collection: 375000, expenses: 162000, balance: 480000 },
  // { month: 'Feb', collection: 380000, expenses: 158000, balance: 502000 },
  // { month: 'Mar', collection: 368000, expenses: 184000, balance: 520000 },
  // { month: 'Apr', collection: 392000, expenses: 165000, balance: 547000 },
  // { month: 'May', collection: 385000, expenses: 178000, balance: 574000 },
  // { month: 'Jun', collection: 378000, expenses: 190000, balance: 592000 },
  // { month: 'Jul', collection: 390000, expenses: 168000, balance: 614000 },
  { month: 'Aug', collection: 384000, expenses: 172400, balance: 642800 },
];

export const DashboardPage: React.FC = () => {
  const {
    societySettings,
    authUser,
    flats,
    residents,
    maintenanceRecords,
    payments,
    expenses,
    complaints,
    activities,
    setSelectedReceipt,
    setSelectedFlat,
    sendReminder,
    showToast,
  } = useSociety();

  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState<boolean>(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState<boolean>(false);
  const [isGenerateMaintOpen, setIsGenerateMaintOpen] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('August 2026');

  // Real database-calculated stats
  const totalFlatsCount = flats.length || societySettings.totalFlats || 0;
  const occupiedFlatsCount = flats.filter((f) => f.occupancyStatus === 'Occupied').length;
  const vacantFlatsCount = Math.max(0, totalFlatsCount - occupiedFlatsCount);
  const occupancyRate = totalFlatsCount > 0 ? Math.round((occupiedFlatsCount / totalFlatsCount) * 100) : 0;

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalPending = maintenanceRecords
    .filter((m) => m.status !== 'Paid')
    .reduce((acc, m) => acc + (m.balanceAmount || m.totalAmount || 0), 0);
  const currentBalance = totalCollected - totalExpenses;
  const totalBilled = totalCollected + totalPending;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const openComplaintsCount = complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress').length;

  const totalMaint = maintenanceRecords.length || 1;
  const paidCount = maintenanceRecords.filter((m) => m.status === 'Paid').length;
  const pendingCount = maintenanceRecords.filter((m) => m.status === 'Pending').length;
  const overdueCount = maintenanceRecords.filter((m) => m.status === 'Overdue').length;

  const collectionDonutData = [
    { name: `Paid (${Math.round((paidCount / totalMaint) * 100)}%)`, value: paidCount || 1, color: '#10b981' },
    { name: `Pending (${Math.round((pendingCount / totalMaint) * 100)}%)`, value: pendingCount, color: '#f59e0b' },
    { name: `Overdue (${Math.round((overdueCount / totalMaint) * 100)}%)`, value: overdueCount, color: '#f43f5e' },
  ].filter((d) => d.value > 0);

  // Group live expenses by category from database
  const expenseCategories = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const colorPalette = ['#6366f1', '#f59e0b', '#06b6d4', '#8b5cf6', '#f43f5e', '#64748b'];
  const expenseDonutData = Object.keys(expenseCategories).length > 0
    ? Object.entries(expenseCategories).map(([name, value], idx) => ({
        name,
        value,
        color: colorPalette[idx % colorPalette.length],
      }))
    : [
        { name: 'General', value: totalExpenses || 1000, color: '#6366f1' },
      ];

  const pendingMaintenanceRows = maintenanceRecords
    .filter((m) => m.status !== 'Paid')
    .slice(0, 8)
    .map((m) => ({
      flat: m.flatNumber,
      resident: m.residentName,
      month: m.month,
      amount: m.balanceAmount || m.totalAmount,
      due: m.dueDate,
      status: m.status,
    }));

  const handleExport = () => {
    showToast('success', 'Monthly Summary Exported', `${societySettings.name}_Report.pdf generated successfully.`);
  };

  console.log(authUser);
  
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Good Morning,{authUser?.name}</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Here’s what’s happening in <strong className="text-slate-800 font-semibold">{authUser?.societyName}</strong> today.
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2.5">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="August 2026">August 2026 (Active)</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
            <option value="FY 2026-27">FY 2026-27 YTD</option>
          </select>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-soft transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* Quick Launch Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setIsRecordPaymentOpen(true)}
          className="p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl flex items-center gap-3 transition-all text-left group"
        >
          <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-soft-sm group-hover:scale-105 transition-transform">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-emerald-950 block">Record Payment</span>
            <span className="text-[10px] text-emerald-700 font-medium">Issue manual receipt</span>
          </div>
        </button>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-2xl flex items-center gap-3 transition-all text-left group"
        >
          <div className="p-2 bg-amber-600 text-white rounded-xl shadow-soft-sm group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-amber-950 block">+ Add Expense</span>
            <span className="text-[10px] text-amber-700 font-medium">Log vendor bill</span>
          </div>
        </button>

        <button
          onClick={() => setIsGenerateMaintOpen(true)}
          className="p-3 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-2xl flex items-center gap-3 transition-all text-left group"
        >
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-soft-sm group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-indigo-950 block">Generate Bills</span>
            <span className="text-[10px] text-indigo-700 font-medium">New monthly cycle</span>
          </div>
        </button>

        <button
          onClick={() => {
            const r = payments.find((p) => p.receiptNumber === 'REC-2026-00842') || payments[0];
            if (r) setSelectedReceipt(r);
          }}
          className="p-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-2xl flex items-center gap-3 transition-all text-left group"
        >
          <div className="p-2 bg-slate-800 text-white rounded-xl shadow-soft-sm group-hover:scale-105 transition-transform">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block">Print Voucher</span>
            <span className="text-[10px] text-slate-500 font-medium">REC-2026-00842</span>
          </div>
        </button>
      </div>

      {/* Primary KPI Stats Cards (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Flats */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Flats</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalFlatsCount}</span>
            <span className="text-xs font-semibold text-slate-400">Flats Registered</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-emerald-600">{occupiedFlatsCount} Occupied</span>
            <span>·</span>
            <span className="font-semibold text-slate-400">{vacantFlatsCount} Vacant</span>
          </div>
        </div>

        {/* Occupied */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Occupied</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{occupiedFlatsCount}</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{occupancyRate}% Rate</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {residents.length} Active residents registered
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Dues</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 tracking-tight">{formatCurrency(totalPending)}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-rose-600 font-semibold">
            <span>{pendingCount + overdueCount} Bills pending payment</span>
          </div>
        </div>

        {/* Collected This Month */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collections</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">{formatCurrency(totalCollected)}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <span className="font-semibold text-emerald-600">{payments.length} Payments</span>
            <span>recorded in database</span>
          </div>
        </div>
      </div>

      {/* Additional Stats Cards (Row 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Expenses</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">{formatCurrency(totalExpenses)}</span>
            <span className="text-[10px] text-slate-400">{expenses.length} Vouchers in database</span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Society Balance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Current Balance</span>
            <span className="text-xl font-black text-emerald-600 mt-0.5 block">{formatCurrency(currentBalance)}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{currentBalance >= 0 ? 'Net Surplus' : 'Deficit'}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        {/* Open Complaints */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Complaints</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-slate-900">{openComplaintsCount} Active</span>
            </div>
            <span className="text-[10px] text-slate-400">{complaints.length} Total tickets logged</span>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Collection Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Collection Rate</span>
            <span className="text-xl font-black text-indigo-600 mt-0.5 block">{collectionRate}%</span>
            <span className="text-[10px] text-slate-400">{paidCount} of {totalMaint} records cleared</span>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collection vs Expenses Line/Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Collection vs Expenses Trend</h3>
              <p className="text-xs text-slate-400">Monthly financial cashflow for Jan – Aug 2026</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-slate-600 font-medium">Collection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500" />
                <span className="text-slate-600 font-medium">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="collection" name="Maintenance Collection" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expenses" name="Operational Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Charts Column (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Maintenance Collection Donut */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs">Maintenance Collection Ratio</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">August 2026</span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-32 h-32 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={collectionDonutData}
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {collectionDonutData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => `${v}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-black text-slate-800">{Math.round((paidCount / totalMaint) * 100)}%</span>
                  <span className="text-[9px] text-slate-400 font-bold">PAID</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 text-xs">
                {collectionDonutData.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 font-medium text-xs">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expense Breakdown Donut */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs">Expense Category Breakdown</h3>
              <span className="text-[10px] font-bold text-slate-600">Total: {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}</span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-32 h-32 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseDonutData}
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseDonutData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-black text-slate-800">₹{(expenses.reduce((s, e) => s + e.amount, 0) / 100000).toFixed(2)}L</span>
                  <span className="text-[8px] text-slate-400 font-bold">SPENT</span>
                </div>
              </div>

              <div className="flex-1 space-y-1 text-[11px]">
                {expenseDonutData.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 truncate">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section: Pending Maintenance Table + Society Overview & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Maintenance Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pending Maintenance Dues</h3>
                <p className="text-xs text-slate-400">Flats requiring fee collection or automated reminders</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                12 Pending
              </span>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-2">Flat</th>
                    <th className="pb-2">Resident</th>
                    <th className="pb-2">Month</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Due Date</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingMaintenanceRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-800">{row.flat}</td>
                      <td className="py-3 font-medium text-slate-700">{row.resident}</td>
                      <td className="py-3 text-slate-500">{row.month}</td>
                      <td className="py-3 font-black text-slate-900">{formatCurrency(row.amount)}</td>
                      <td className="py-3 text-slate-500">{row.due}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(row.status)}`}>
                          ● {row.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const f = flats.find((x) => x.flatNumber === row.flat);
                              if (f) setSelectedFlat(f);
                            }}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Flat Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => sendReminder(row.flat, row.resident, row.amount)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Remind
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Showing priority overdue accounts</span>
            <a href="#/admin/maintenance" className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All 120 Flats Billing →
            </a>
          </div>
        </div>

        {/* Right Column: Society Overview & Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Society Overview Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-soft relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-wide">{societySettings.name}</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Society
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Capacity</span>
                <span className="font-black text-lg text-white mt-0.5 block">120 Flats</span>
                <span className="text-[10px] text-slate-300">6 Blocks (A, B, C, D, E, F)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Occupancy</span>
                <span className="font-black text-lg text-emerald-400 mt-0.5 block">108 Occupied</span>
                <span className="text-[10px] text-slate-300">12 Vacant Flats</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Society Treasury Balance</span>
                  <span className="font-black text-xl text-white mt-0.5 block">₹6,42,800</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Next Cycle</span>
                  <span className="font-bold text-emerald-300 text-xs">1 Sep 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-900 text-sm">Recent Activity</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Live Timeline</span>
            </div>

            <div className="mt-3 space-y-3">
              {activities.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-start gap-3 text-xs">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${item.iconColor}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{item.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment, Add Expense, Generate Maintenance Modals */}
      <RecordPaymentModal isOpen={isRecordPaymentOpen} onClose={() => setIsRecordPaymentOpen(false)} />
      <AddExpenseModal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} />
      <GenerateMaintenanceModal isOpen={isGenerateMaintOpen} onClose={() => setIsGenerateMaintOpen(false)} />
    </div>
  );
};
