import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { PaymentMode } from '../../types';
import { X, CheckCircle, IndianRupee } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { flats, recordPayment, setSelectedReceipt } = useSociety();
  
  const occupiedFlats = flats.filter((f) => f.occupancyStatus === 'Occupied');
  
  const [selectedFlatNum, setSelectedFlatNum] = useState<string>(occupiedFlats[0]?.flatNumber || 'A-101');
  const selectedFlat = flats.find((f) => f.flatNumber === selectedFlatNum);

  const [amount, setAmount] = useState<number>(selectedFlat?.monthlyMaintenance || 3500);
  const [forMonth, setForMonth] = useState<string>('August 2026 Maintenance');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [referenceId, setReferenceId] = useState<string>(`UPI${Math.floor(100000000000 + Math.random() * 899999999999)}`);
  const [date, setDate] = useState<string>('24 Aug 2026');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleFlatChange = (flatNum: string) => {
    setSelectedFlatNum(flatNum);
    const flat = flats.find((f) => f.flatNumber === flatNum);
    if (flat) {
      setAmount(flat.monthlyMaintenance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdPayment = recordPayment({
      residentName: selectedFlat?.residentName || 'Resident',
      flatNumber: selectedFlatNum,
      amount: Number(amount),
      forMonth,
      paymentMode,
      referenceId: referenceId || `TXN${Math.floor(100000000 + Math.random() * 899999999)}`,
      date,
      notes: notes || `Payment recorded for ${selectedFlatNum}`,
    });

    onClose();
    setSelectedReceipt(createdPayment);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Record Maintenance Payment</h3>
              <p className="text-xs text-slate-500">Add payment transaction and issue receipt</p>
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
          {/* Select Flat */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Flat</label>
            <select
              value={selectedFlatNum}
              onChange={(e) => handleFlatChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {occupiedFlats.map((f) => (
                <option key={f.flatNumber} value={f.flatNumber}>
                  {f.flatNumber} - {f.residentName} ({f.bhk}, Block {f.block})
                </option>
              ))}
            </select>
          </div>

          {/* Resident Details Pill */}
          {selectedFlat && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Resident Name</span>
                <p className="font-bold text-slate-800">{selectedFlat.residentName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Ownership</span>
                <p className="font-semibold text-indigo-600">{selectedFlat.ownershipType}</p>
              </div>
            </div>
          )}

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Amount Paid (₹)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Date</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment For */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Payment For</label>
            <input
              type="text"
              required
              value={forMonth}
              onChange={(e) => setForMonth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Payment Mode & Reference */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Online">Online / Gateway</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Reference / UTR / Cheque No</label>
              <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Remarks / Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Paid in full for Aug cycle"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-soft transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Save & Issue Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
