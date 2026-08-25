import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import { X, QrCode, CreditCard, Landmark, CheckCircle2, ShieldCheck, Loader2, Smartphone, ArrowRight } from 'lucide-react';

export const QuickPayModal: React.FC = () => {
  const { authUser, currentResidentFlat, isQuickPayOpen, setIsQuickPayOpen, recordPayment, setSelectedReceipt } = useSociety();
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('PhonePe');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isQuickPayOpen) return null;

  const dueAmount = currentResidentFlat?.monthlyMaintenance || 3500;
  const flatNumber = authUser?.flatNumber || currentResidentFlat?.flatNumber || 'A-101';
  const residentName = authUser?.name || 'Resident Member';

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      triggerConfetti();

      const newPayment = recordPayment({
        residentName,
        flatNumber,
        amount: dueAmount,
        date: '24 Aug 2026',
        forMonth: 'August 2026 Maintenance',
        paymentMode: paymentMode === 'Card' ? 'Online' : paymentMode === 'NetBanking' ? 'Bank Transfer' : 'UPI',
        referenceId: paymentMode === 'UPI' ? `UPI${Math.floor(100000000000 + Math.random() * 899999999999)}` : `TXN${Math.floor(100000000 + Math.random() * 899999999)}`,
        notes: `Online resident payment via ${paymentMode}`,
      });

      setTimeout(() => {
        setIsQuickPayOpen(false);
        setIsSuccess(false);
        setSelectedReceipt(newPayment);
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Pay Maintenance Dues</h3>
            <p className="text-xs text-slate-500">Green Valley Residency · Unit {flatNumber}</p>
          </div>
          <button
            onClick={() => setIsQuickPayOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Payment Successful!</h4>
              <p className="text-sm text-slate-600 mt-1">₹{dueAmount.toLocaleString('en-IN')} received for August 2026 Maintenance.</p>
              <p className="text-xs text-emerald-600 font-semibold mt-3">Opening electronic receipt voucher...</p>
            </div>
          ) : (
            <>
              {/* Due Summary Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-soft mb-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-100 font-medium uppercase tracking-wider block">Total Amount Payable</span>
                  <div className="text-2xl font-black mt-0.5">{formatCurrency(dueAmount)}</div>
                  <span className="text-xs text-indigo-200">August 2026 Maintenance Cycle</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-xs font-semibold">
                  Due: 10 Aug 2026
                </div>
              </div>

              {/* Payment Mode Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPaymentMode('UPI')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    paymentMode === 'UPI' ? 'bg-white text-indigo-600 shadow-soft-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('Card')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    paymentMode === 'Card' ? 'bg-white text-indigo-600 shadow-soft-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Debit / Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('NetBanking')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    paymentMode === 'NetBanking' ? 'bg-white text-indigo-600 shadow-soft-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" /> Net Banking
                </button>
              </div>

              {/* UPI Tab View */}
              {paymentMode === 'UPI' && (
                <div className="space-y-4">
                  <div className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/40 flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-soft-sm">
                      <QrCode className="w-20 h-20 text-indigo-900" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-800 text-sm">Scan with any UPI App</p>
                      <p className="text-slate-500 mt-0.5">Google Pay, PhonePe, Paytm, or BHIM</p>
                      <p className="font-mono text-indigo-600 font-semibold mt-1">UPI ID: greenvalleychs@hdfcbank</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-2">Or select instant UPI App</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['PhonePe', 'Google Pay', 'Paytm', 'BHIM'].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app)}
                          className={`p-2.5 text-center rounded-xl border text-xs font-semibold transition-all ${
                            selectedUpiApp === app
                              ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 ring-2 ring-indigo-600/20'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Card Tab View */}
              {paymentMode === 'Card' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8821"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        defaultValue="09/28"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        defaultValue="842"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Tab View */}
              {paymentMode === 'NetBanking' && (
                <div className="space-y-3 text-xs">
                  <label className="font-semibold text-slate-700 block">Select Your Bank</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Bank of Baroda'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 text-left rounded-xl border text-xs font-semibold transition-all ${
                          selectedBank === bank
                            ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 ring-2 ring-indigo-600/20'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-bit SSL Encrypted Society Payment Gateway</span>
              </div>

              {/* Submit Button */}
              <div className="mt-5">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayNow}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white font-bold rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying Payment...
                    </>
                  ) : (
                    <>
                      <span>Pay {formatCurrency(dueAmount)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
