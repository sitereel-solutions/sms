import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import {
  TrendingDown,
  Search,
  Plus,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { AddExpenseModal } from '../../components/modals/AddExpenseModal';

export const ExpensesPage: React.FC = () => {
  const { expenses, setSelectedInvoice } = useSociety();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState<boolean>(false);

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || exp.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Society Expenses</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              ₹1,72,400 This Month
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Track and manage society expenses, vendor contracts, and tax invoices</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddExpenseOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> + Add Expense
        </button>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-slate-400">This Month Expenses</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₹1,72,400</p>
          <span className="text-[10px] text-slate-400">August 2026 operational bills</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-slate-400">This Year Total</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₹18,42,000</p>
          <span className="text-[10px] text-slate-400">FY 2026-27 cumulative spend</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending Bills</span>
          <p className="text-2xl font-black text-amber-600 mt-1">₹24,500</p>
          <span className="text-[10px] text-amber-600 font-semibold">2 Invoices awaiting approval</span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses by vendor (Torrent Power), category, invoice (INV-2026-0824)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Categories</option>
              <option value="Electricity">Electricity</option>
              <option value="Security">Security</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Lift">Lift AMC</option>
              <option value="Water">Water Supply</option>
              <option value="Gardening">Gardening</option>
              <option value="Repairs">Repairs & Maintenance</option>
              <option value="AMC">Equipment AMC</option>
              <option value="Salary">Staff Salary</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Invoice No</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Mode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr
                  key={exp.id}
                  onClick={() => setSelectedInvoice(exp)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{exp.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">{exp.description}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{exp.vendor}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{exp.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">{formatCurrency(exp.amount)}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{exp.paymentMode}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(exp.status)}`}>
                      ● {exp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvoice(exp);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} />
    </div>
  );
};
