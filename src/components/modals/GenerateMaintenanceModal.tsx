import React, { useState, useEffect } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency } from '../../utils/formatters';
import { X, Calculator, Zap, Users } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const getCurrentBillingCycle = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getMonthYearFromCycle = (cycle: string): string => {
  if (!cycle || !cycle.includes('-')) return '';
  const [yearStr, monthStr] = cycle.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10);
  if (monthIdx >= 0 && monthIdx < 12 && !isNaN(year)) {
    return `${MONTH_NAMES[monthIdx]} ${year}`;
  }
  return '';
};

const getDefaultDueDate = (cycle: string): string => {
  if (!cycle || !cycle.includes('-')) return '10th of Month';
  const [yearStr, monthStr] = cycle.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10);
  if (monthIdx >= 0 && monthIdx < 12 && !isNaN(year)) {
    return `10 ${MONTH_SHORT_NAMES[monthIdx]} ${year}`;
  }
  return '10th of Month';
};

export const GenerateMaintenanceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { flats, generateMaintenanceCycle } = useSociety();
  const occupiedCount = flats.filter((f) => f.occupancyStatus === 'Occupied').length;
  const vacantCount = flats.length - occupiedCount;

  const [billingCycle, setBillingCycle] = useState<string>(() => getCurrentBillingCycle());
  const [month, setMonth] = useState<string>(() => getMonthYearFromCycle(getCurrentBillingCycle()));
  const [baseRate, setBaseRate] = useState<number>(3500);
  const [includeWater, setIncludeWater] = useState<boolean>(true);
  const [includeSinking, setIncludeSinking] = useState<boolean>(true);
  const [dueDate, setDueDate] = useState<string>(() => getDefaultDueDate(getCurrentBillingCycle()));

  useEffect(() => {
    if (isOpen) {
      const currentCycle = getCurrentBillingCycle();
      setBillingCycle(currentCycle);
      setMonth(getMonthYearFromCycle(currentCycle));
      setDueDate(getDefaultDueDate(currentCycle));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const estimatedTotal = occupiedCount * baseRate;

  const handleCycleChange = (newCycle: string) => {
    setBillingCycle(newCycle);
    if (newCycle) {
      const formattedMonth = getMonthYearFromCycle(newCycle);
      setMonth(formattedMonth);
      setDueDate(getDefaultDueDate(newCycle));
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingCycle || !month) return;
    generateMaintenanceCycle(month, billingCycle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Generate Maintenance Bills</h3>
              <p className="text-xs text-slate-500">Create new monthly billing cycle for all flats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="p-6 space-y-4 text-xs">
          {/* Target Cycle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Month & Year</label>
              <input
                type="month"
                required
                value={billingCycle}
                onChange={(e) => handleCycleChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white cursor-pointer"
              />
              <p className="text-[11px] text-indigo-600 font-medium mt-1">
                Cycle: <span className="font-bold">{month}</span> ({billingCycle})
              </p>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
              <input
                type="text"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="10 Sep 2026"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Scope Summary */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-200/60 text-indigo-800 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-indigo-950 text-sm">{occupiedCount} Occupied Flats</span>
                <p className="text-[11px] text-indigo-700">{vacantCount} vacant flats are excluded automatically</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-indigo-600 uppercase font-bold tracking-wider">Estimated Total</span>
              <p className="font-black text-indigo-950 text-base">{formatCurrency(estimatedTotal)}</p>
            </div>
          </div>

          {/* Base Configuration */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Default Flat Rate (₹ / month)</label>
            <input
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Additional Inclusions */}
          <div className="space-y-2 pt-1">
            <label className="font-semibold text-slate-700 block">Line Item Charges</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeWater}
                  onChange={(e) => setIncludeWater(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700">Include Common Water Supply & Pump charges (₹350/flat)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSinking}
                  onChange={(e) => setIncludeSinking(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700">Include 10% Sinking & Major Repair Reserve Fund</span>
              </label>
            </div>
          </div>

          {/* Actions */}
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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-soft transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> Generate & Dispatch Invoices
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
