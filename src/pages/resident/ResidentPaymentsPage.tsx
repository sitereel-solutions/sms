import React from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency } from '../../utils/formatters';
import { Receipt, CheckCircle2, Printer, Zap, Calendar, Smartphone, Landmark, AlertCircle } from 'lucide-react';

export const ResidentPaymentsPage: React.FC = () => {
  const { authUser, currentResidentFlat, payments, setSelectedReceipt, setIsQuickPayOpen } = useSociety();

  const flatNumber = authUser?.flatNumber || currentResidentFlat?.flatNumber || 'A-101';
  const myPayments = payments.filter((p) => p.flatNumber === flatNumber);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Receipts & History</h1>
          <p className="text-xs text-slate-500 mt-0.5">Official downloadable vouchers and transaction reference records for Flat {flatNumber}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsQuickPayOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Zap className="w-4 h-4" /> Pay Maintenance Online
        </button>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt Number</th>
                <th className="py-3.5 px-4">Payment Date</th>
                <th className="py-3.5 px-4">Billing Purpose</th>
                <th className="py-3.5 px-4">Amount Paid</th>
                <th className="py-3.5 px-4">Payment Mode</th>
                <th className="py-3.5 px-4">Transaction / UTR</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myPayments.length > 0 ? (
                myPayments.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedReceipt(item)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{item.receiptNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.forMonth}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">{formatCurrency(item.amount)}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {item.paymentMode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{item.referenceId || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" /> View Voucher
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No payment records found for Flat {flatNumber}</p>
                    <p className="text-[11px] mt-1">Make an online maintenance payment to generate your first official receipt.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
