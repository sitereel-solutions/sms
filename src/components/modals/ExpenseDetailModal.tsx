import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency } from '../../utils/formatters';
import { X, FileText, Building2, Calendar, CreditCard, UserCheck, Receipt, ExternalLink, Printer } from 'lucide-react';

export const ExpenseDetailModal: React.FC = () => {
  const { selectedInvoice, setSelectedInvoice, societySettings } = useSociety();
  const [showFullInvoice, setShowFullInvoice] = useState<boolean>(false);

  if (!selectedInvoice) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">{selectedInvoice.category} Expense</h3>
              <p className="text-xs text-slate-500">Invoice: {selectedInvoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedInvoice(null);
              setShowFullInvoice(false);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Main Amount Card */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">Total Expense Amount</span>
              <div className="text-3xl font-black text-white mt-0.5">{formatCurrency(selectedInvoice.amount)}</div>
              <p className="text-xs text-slate-300 mt-1">{selectedInvoice.description}</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              {selectedInvoice.status.toUpperCase()}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="text-slate-400 font-medium block">Expense Date</span>
                <span className="font-bold text-slate-800 text-sm">{selectedInvoice.date}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="text-slate-400 font-medium block">Category</span>
                <span className="font-bold text-slate-800 text-sm">{selectedInvoice.category}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="text-slate-400 font-medium block">Vendor / Payee</span>
                <span className="font-bold text-slate-800 text-sm">{selectedInvoice.vendor}</span>
                {selectedInvoice.vendorContact && (
                  <span className="text-[11px] text-slate-500">{selectedInvoice.vendorContact}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="text-slate-400 font-medium block">Payment Mode</span>
                <span className="font-bold text-slate-800 text-sm">{selectedInvoice.paymentMode}</span>
              </div>
            </div>
          </div>

          {/* Approved By & Notes */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-900">
              <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="font-medium text-slate-500">Authorized & Approved By: </span>
                <span className="font-bold text-indigo-950">{selectedInvoice.approvedBy}</span>
              </div>
            </div>

            {selectedInvoice.notes && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-semibold text-slate-600 block mb-1">Audit Notes</span>
                <p className="text-slate-600 leading-relaxed">{selectedInvoice.notes}</p>
              </div>
            )}
          </div>

          {/* Mock Invoice Preview Drawer */}
          {showFullInvoice && (
            <div className="p-5 border-2 border-dashed border-slate-300 rounded-xl bg-white space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedInvoice.vendor}</h4>
                  <p className="text-[11px] text-slate-500">Tax Invoice & Cash Receipt Voucher</p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-slate-800">#{selectedInvoice.invoiceNumber}</span>
                  <p className="text-[11px] text-slate-500">{selectedInvoice.date}</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Billed To:</p>
                <p>{societySettings.name}</p>
                <p>{societySettings.address}, {societySettings.city}</p>
                <p>GSTIN / Reg: {societySettings.registrationNumber}</p>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-2 px-2">Item Description</th>
                    <th className="py-2 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-2 font-medium">{selectedInvoice.description}</td>
                    <td className="py-2 px-2 text-right font-bold">{formatCurrency(selectedInvoice.amount)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Invoice
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowFullInvoice((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {showFullInvoice ? 'Hide Invoice Details' : 'View Invoice Document'}
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedInvoice(null);
              setShowFullInvoice(false);
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
