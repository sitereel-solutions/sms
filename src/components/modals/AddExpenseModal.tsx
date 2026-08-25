import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { ExpenseCategory, PaymentMode, ExpenseStatus } from '../../types';
import { X, Plus, Receipt } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addExpense } = useSociety();

  const [category, setCategory] = useState<ExpenseCategory>('Electricity');
  const [description, setDescription] = useState<string>('');
  const [vendor, setVendor] = useState<string>('');
  const [vendorContact, setVendorContact] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>(`INV-2026-${Math.floor(1000 + Math.random() * 8999)}`);
  const [amount, setAmount] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Bank Transfer');
  const [status, setStatus] = useState<ExpenseStatus>('Paid');
  const [approvedBy, setApprovedBy] = useState<string>('Amit Patel (Treasurer)');
  const [date, setDate] = useState<string>('24 Aug 2026');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !vendor || !amount) return;

    addExpense({
      date,
      category,
      description,
      vendor,
      vendorContact,
      invoiceNumber,
      amount: Number(amount),
      paymentMode,
      status,
      approvedBy,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Add Society Expense</h3>
              <p className="text-xs text-slate-500">Record a new outgoing operational expenditure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expense Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Electricity">Electricity</option>
                <option value="Security">Security</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Lift">Lift AMC & Repairs</option>
                <option value="Water">Water Tanker & Supply</option>
                <option value="Gardening">Gardening & Landscaping</option>
                <option value="Repairs">Repairs & Maintenance</option>
                <option value="AMC">Equipment AMC & DG Set</option>
                <option value="Salary">Staff Salary</option>
                <option value="Other">Other / Misc</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Expense Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Common Area Electricity Bill for July-August"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Vendor & Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Vendor / Payee Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Torrent Power Ltd."
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Invoice Number</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Amount & Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                placeholder="e.g. 18500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI / QR</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Status & Approver */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ExpenseStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending Approval / Payment</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Authorized By</label>
              <input
                type="text"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Notes / Voucher Details (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Approved in monthly committee meeting"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-soft transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
