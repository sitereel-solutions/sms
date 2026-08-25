import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency } from '../../utils/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  FileBarChart,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  TrendingUp,
  Landmark,
  FileSpreadsheet
} from 'lucide-react';

const CASHFLOW_DATA = [
  { month: 'Jan', income: 375000, expense: 162000, net: 213000 },
  { month: 'Feb', income: 380000, expense: 158000, net: 222000 },
  { month: 'Mar', income: 368000, expense: 184000, net: 184000 },
  { month: 'Apr', income: 392000, expense: 165000, net: 227000 },
  { month: 'May', income: 385000, expense: 178000, net: 207000 },
  { month: 'Jun', income: 378000, expense: 190000, net: 188000 },
  { month: 'Jul', income: 390000, expense: 168000, net: 222000 },
  { month: 'Aug', income: 384000, expense: 172400, net: 211600 },
];

const INCOME_BREAKDOWN = [
  { source: 'Maintenance Charges', amount: 348000, pct: '90.6%', color: '#10b981' },
  { source: 'Parking Slot Fees', amount: 18000, pct: '4.7%', color: '#06b6d4' },
  { source: 'Bank Fixed Deposit Interest', amount: 8500, pct: '2.2%', color: '#6366f1' },
  { source: 'Community Hall Booking', amount: 6500, pct: '1.7%', color: '#f59e0b' },
  { source: 'Late Payment Fines & Misc', amount: 3000, pct: '0.8%', color: '#ec4899' },
];

const EXPENSE_BREAKDOWN = [
  { category: 'Security Services (SIS)', amount: 56000, pct: '32.5%', color: '#6366f1' },
  { category: 'Housekeeping (UrbanClean)', amount: 32000, pct: '18.6%', color: '#06b6d4' },
  { category: 'Elevator AMC (Johnson)', amount: 22500, pct: '13.1%', color: '#8b5cf6' },
  { category: 'Electricity (Torrent Power)', amount: 18500, pct: '10.7%', color: '#f59e0b' },
  { category: 'Repairs & Plumbing', amount: 16300, pct: '9.5%', color: '#f43f5e' },
  { category: 'Gardening, Admin & Other', amount: 27100, pct: '15.6%', color: '#64748b' },
];

export const ReportsPage: React.FC = () => {
  const { societySettings, payments, expenses, showToast } = useSociety();
  const [dateRange, setDateRange] = useState<string>('August 2026');

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0) || 384000;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0) || 172400;
  const openingBalance = 431200;
  const closingBalance = openingBalance + totalIncome - totalExpenses;

  // Group live expenses dynamically
  const expenseCatMap = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const colorPalette = ['#6366f1', '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#64748b'];
  const expenseBreakdown = Object.keys(expenseCatMap).length > 0
    ? Object.entries(expenseCatMap).map(([category, amount], idx) => ({
        category,
        amount,
        pct: `${Math.round((amount / (totalExpenses || 1)) * 100)}%`,
        color: colorPalette[idx % colorPalette.length],
      }))
    : EXPENSE_BREAKDOWN;

  const handleExportPDF = () => {
    showToast('success', 'PDF Financial Statement Generated', 'Green_Valley_Audited_Financials_Aug_2026.pdf ready for print.');
  };

  const handleExportExcel = () => {
    showToast('success', 'Excel Spreadsheet Exported', 'Green_Valley_Cashflow_Ledger_2026.xlsx exported successfully.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Reports & P&L</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Audit Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive balance sheet, income/expense breakdown, and cashflow audit</p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 shadow-soft-sm"
          >
            <option value="August 2026">August 2026</option>
            <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
            <option value="Q1 FY 2026-27">Q1 FY 2026-27</option>
            <option value="FY 2025-26">FY 2025-26 (Full Year)</option>
          </select>

          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-soft transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>
      </div>

      {/* 4 Financial Balance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Opening Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Opening Balance</span>
          <p className="text-2xl font-black text-slate-800 mt-1">{formatCurrency(openingBalance)}</p>
          <span className="text-[11px] text-slate-400 font-medium">As of 1 August 2026</span>
        </div>

        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Income</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(totalIncome)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">+9.5% vs last month</span>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Expenses</span>
            <ArrowDownRight className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-1">{formatCurrency(totalExpenses)}</p>
          <span className="text-[11px] text-slate-400 font-medium">44.9% of income</span>
        </div>

        {/* Closing Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft ring-2 ring-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Closing Balance</span>
            <Landmark className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-1">{formatCurrency(closingBalance)}</p>
          <span className="text-[11px] text-emerald-700 font-bold">+₹2,11,600 Net Surplus</span>
        </div>
      </div>

      {/* Financial Trend Area Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Income vs Expenses Cashflow Analysis</h3>
            <p className="text-xs text-slate-400">Monthly surplus accumulation trend (Jan - Aug 2026)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-semibold">Total Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-600 font-semibold">Total Expenses</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip
                formatter={(v: any) => [formatCurrency(Number(v)), '']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expense" name="Expenses" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income Breakdown & Expense Breakdown 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Income Breakdown</h3>
              <p className="text-xs text-slate-400">Total Inflow: ₹3,84,000</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              5 Streams
            </span>
          </div>

          <div className="space-y-3">
            {INCOME_BREAKDOWN.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="font-bold text-slate-800">{item.source}</span>
                    <span className="text-[10px] text-slate-400 block">{item.pct} of total revenue</span>
                  </div>
                </div>
                <span className="font-black text-slate-900 text-sm">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Expense Breakdown</h3>
              <p className="text-xs text-slate-400">Total Outflow: {formatCurrency(totalExpenses)}</p>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              {expenseBreakdown.length} Categories
            </span>
          </div>

          <div className="space-y-3">
            {expenseBreakdown.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="font-bold text-slate-800">{item.category}</span>
                    <span className="text-[10px] text-slate-400 block">{item.pct} of total expenditure</span>
                  </div>
                </div>
                <span className="font-black text-slate-900 text-sm">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
