import React from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency } from '../../utils/formatters';
import { Layers, Calendar, CheckCircle2, Zap, Printer, ShieldCheck, HelpCircle } from 'lucide-react';

export const ResidentMaintenancePage: React.FC = () => {
  const { authUser, currentResidentFlat, payments, setSelectedReceipt, setIsQuickPayOpen } = useSociety();

  const flatNumber = authUser?.flatNumber || currentResidentFlat?.flatNumber || 'A-101';
  const myPayments = payments.filter((p) => p.flatNumber === flatNumber);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maintenance & Dues</h1>
          <p className="text-xs text-slate-500 mt-0.5">Itemized monthly billing breakdown, water charges, and sinking fund allocation</p>
        </div>

        <button
          type="button"
          onClick={() => setIsQuickPayOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Zap className="w-4 h-4" /> Pay Upcoming Cycle
        </button>
      </div>

      {/* Active Bill Breakdown Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Billing Cycle</span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">August 2026 Maintenance Statement</h2>
            <p className="text-xs text-slate-500">Bill No: GV-2026-08-A101 · Due Date: 10 August 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
            </span>
          </div>
        </div>

        {/* Line Item Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Component / Service Charge</th>
                <th className="pb-3">Calculation Basis</th>
                <th className="pb-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3.5 font-bold text-slate-900">
                  Base Society Maintenance & Security
                  <span className="text-[11px] text-slate-400 font-normal block">Common area electricity, security guard shifts, lift AMC</span>
                </td>
                <td className="py-3.5 font-mono text-slate-500">Fixed Flat Fee</td>
                <td className="py-3.5 text-right font-bold text-slate-900">₹2,550.00</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-slate-900">
                  Common Water Supply & Hydro-Pneumatic Pump
                  <span className="text-[11px] text-slate-400 font-normal block">Municipal connection & booster pump operation</span>
                </td>
                <td className="py-3.5 font-mono text-slate-500">₹350 / flat</td>
                <td className="py-3.5 text-right font-bold text-slate-900">₹350.00</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-slate-900">
                  Major Repair & Sinking Reserve Fund
                  <span className="text-[11px] text-slate-400 font-normal block">Statutory 10% society long-term corpus</span>
                </td>
                <td className="py-3.5 font-mono text-slate-500">10% Reserve</td>
                <td className="py-3.5 text-right font-bold text-slate-900">₹350.00</td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-slate-900">
                  Basement Parking Bay Maintenance
                  <span className="text-[11px] text-slate-400 font-normal block">Dedicated slot P-12 upkeep and lighting</span>
                </td>
                <td className="py-3.5 font-mono text-slate-500">1 Slot</td>
                <td className="py-3.5 text-right font-bold text-slate-900">₹250.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900 text-sm">
                <td className="pt-4 font-black text-slate-900" colSpan={2}>Total Monthly Billed Amount</td>
                <td className="pt-4 text-right font-black text-emerald-700 text-lg">₹3,500.00</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Receipt generated on 24 Aug 2026 (Ref: <strong>REC-2026-00842</strong>)</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const r = myPayments.find((p) => p.receiptNumber === 'REC-2026-00842') || myPayments[0];
              if (r) setSelectedReceipt(r);
            }}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 rounded-xl shadow-soft-sm transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> View Official Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
