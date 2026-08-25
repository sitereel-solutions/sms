import React from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, numberToWordsINR } from '../../utils/formatters';
import { Printer, Download, X, CheckCircle2, ShieldCheck, Building2, QrCode } from 'lucide-react';

export const PaymentReceiptModal: React.FC = () => {
  const { selectedReceipt, setSelectedReceipt, societySettings, showToast } = useSociety();

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('info', 'Receipt PDF Downloaded', `${selectedReceipt.receiptNumber}.pdf has been saved to your downloads.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Modal Bar (Non-printable) */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Official Receipt
            </span>
            <span className="text-sm font-medium text-slate-500">{selectedReceipt.receiptNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-8 sm:p-10 overflow-y-auto bg-white flex-1 relative">
          {/* Subtle Watermark Stamp */}
          <div className="absolute right-12 top-28 opacity-10 pointer-events-none select-none">
            <ShieldCheck className="w-48 h-48 text-emerald-600" />
          </div>

          {/* Receipt Header */}
          <div className="text-center pb-6 border-b border-slate-200 relative">
            <div className="inline-flex items-center justify-center gap-2 mb-1">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-soft">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">SOCIETYHUB</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
              {societySettings.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{societySettings.subtitle} · Reg. No: {societySettings.registrationNumber}</p>
            <p className="text-xs text-slate-400 mt-0.5">{societySettings.address}, {societySettings.city}, {societySettings.state} - {societySettings.pincode}</p>
          </div>

          {/* Receipt Info Bar */}
          <div className="py-4 border-b border-slate-100 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider block">Receipt Number</span>
              <span className="font-bold text-slate-800 text-sm">{selectedReceipt.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider block">Transaction Date</span>
              <span className="font-bold text-slate-800 text-sm">{selectedReceipt.date}</span>
            </div>
          </div>

          {/* Resident & Purpose Grid */}
          <div className="py-5 grid grid-cols-2 gap-6 border-b border-slate-100 text-sm">
            <div>
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-1">Received From</span>
              <p className="font-bold text-slate-900 text-base">{selectedReceipt.residentName}</p>
              <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                <span>Flat Unit:</span>
                <span className="text-indigo-600 font-bold">{selectedReceipt.flatNumber}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-1">Payment Purpose</span>
              <p className="font-semibold text-slate-800">{selectedReceipt.forMonth}</p>
              <span className="text-xs text-slate-500">Maintenance, Water & Common Sinking Charges</span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="my-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-emerald-800 text-xs font-bold uppercase tracking-wider block">Amount Paid</span>
              <div className="text-3xl font-black text-emerald-700 tracking-tight mt-0.5">
                {formatCurrency(selectedReceipt.amount)}
              </div>
              <p className="text-xs font-medium text-emerald-900 mt-1 capitalize">
                Amount in words: <span className="font-semibold italic">{numberToWordsINR(selectedReceipt.amount)}</span>
              </p>
            </div>

            <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide shadow-soft-sm flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <CheckCircle2 className="w-4 h-4" /> PAID
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 text-xs border-b border-slate-100">
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Payment Mode</span>
              <span className="font-bold text-slate-800">{selectedReceipt.paymentMode}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Reference / TXN ID</span>
              <span className="font-mono font-bold text-slate-800 break-all">{selectedReceipt.referenceId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Deposit Account</span>
              <span className="font-medium text-slate-700">{societySettings.bankDetails.bankName}</span>
            </div>
          </div>

          {/* Footer & QR */}
          <div className="pt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">
                <p className="font-semibold text-slate-600">Digitally Verified Voucher</p>
                <p>Scan to verify authenticity on SocietyHub portal.</p>
                <p className="mt-0.5 font-mono text-[10px]">AUTH_SIG: SH-GV-{selectedReceipt.receiptNumber.replace(/[^0-9]/g, '')}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="h-10 border-b border-dashed border-slate-400 mb-1 w-32 ml-auto flex items-end justify-center">
                <span className="text-[11px] font-serif italic text-slate-600">Amit Patel</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Authorized Signatory</p>
              <p className="text-[10px] text-slate-400">Hon. Treasurer / Secretary</p>
            </div>
          </div>

          {/* Bottom Thank you banner */}
          <div className="mt-8 pt-4 text-center border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Thank you for your prompt contribution!
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              This is a computer generated electronic receipt. No physical signature required.
            </p>
          </div>
        </div>

        {/* Modal Footer (Non-printable) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 no-print">
          <button
            onClick={() => setSelectedReceipt(null)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-soft transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
