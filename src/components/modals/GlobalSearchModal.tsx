import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { Search, Home, Users, Receipt, FileText, Bell, AlertCircle, ArrowRight, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    flats,
    residents,
    payments,
    expenses,
    notices,
    complaints,
    setSelectedReceipt,
    setSelectedInvoice,
    setSelectedFlat,
    setSelectedResident,
    setSelectedNotice,
    setSelectedComplaint,
  } = useSociety();

  const [query, setQuery] = useState<string>('');

  if (!isGlobalSearchOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const matchedFlats = cleanQuery
    ? flats.filter((f) => f.flatNumber.toLowerCase().includes(cleanQuery) || f.residentName?.toLowerCase().includes(cleanQuery)).slice(0, 4)
    : [];

  const matchedResidents = cleanQuery
    ? residents.filter((r) => r.name.toLowerCase().includes(cleanQuery) || r.flatNumber.toLowerCase().includes(cleanQuery) || r.phone.includes(cleanQuery)).slice(0, 4)
    : [];

  const matchedPayments = cleanQuery
    ? payments.filter((p) => p.receiptNumber.toLowerCase().includes(cleanQuery) || p.residentName.toLowerCase().includes(cleanQuery) || p.flatNumber.toLowerCase().includes(cleanQuery)).slice(0, 4)
    : [];

  const matchedExpenses = cleanQuery
    ? expenses.filter((e) => e.invoiceNumber.toLowerCase().includes(cleanQuery) || e.vendor.toLowerCase().includes(cleanQuery) || e.category.toLowerCase().includes(cleanQuery) || e.description.toLowerCase().includes(cleanQuery)).slice(0, 4)
    : [];

  const matchedNotices = cleanQuery
    ? notices.filter((n) => n.title.toLowerCase().includes(cleanQuery) || n.content.toLowerCase().includes(cleanQuery)).slice(0, 3)
    : [];

  const matchedComplaints = cleanQuery
    ? complaints.filter((c) => c.ticketNumber.toLowerCase().includes(cleanQuery) || c.title.toLowerCase().includes(cleanQuery) || c.residentName.toLowerCase().includes(cleanQuery)).slice(0, 3)
    : [];

  const totalResults = matchedFlats.length + matchedResidents.length + matchedPayments.length + matchedExpenses.length + matchedNotices.length + matchedComplaints.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search flats, residents, receipts, invoices, notices, complaints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {!cleanQuery ? (
            <div className="py-8 text-center text-slate-400">
              <p className="font-medium text-slate-600">Type keywords to search across SocietyHub</p>
              <p className="text-[11px] mt-1">e.g. "A-101", "Rahul Sharma", "REC-2026-00842", "Torrent Power", "Water Leakage"</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p className="font-semibold text-slate-600">No records found for "{query}"</p>
              <p className="text-[11px] mt-1">Try searching by flat number, member name, or category.</p>
            </div>
          ) : (
            <>
              {/* Flats */}
              {matchedFlats.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-indigo-600" /> Flats ({matchedFlats.length})
                  </span>
                  <div className="space-y-1">
                    {matchedFlats.map((flat) => (
                      <button
                        key={flat.id}
                        onClick={() => {
                          setSelectedFlat(flat);
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                            {flat.flatNumber}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{flat.residentName || 'Vacant Flat'}</p>
                            <p className="text-[11px] text-slate-500">{flat.bhk} · Block {flat.block} · {flat.maintenanceStatus}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Residents */}
              {matchedResidents.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> Residents ({matchedResidents.length})
                  </span>
                  <div className="space-y-1">
                    {matchedResidents.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => {
                          setSelectedResident(res);
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${res.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                            {res.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{res.name}</p>
                            <p className="text-[11px] text-slate-500">Flat {res.flatNumber} · {res.phone} · {res.ownership}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments & Receipts */}
              {matchedPayments.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" /> Payment Receipts ({matchedPayments.length})
                  </span>
                  <div className="space-y-1">
                    {matchedPayments.map((pay) => (
                      <button
                        key={pay.id}
                        onClick={() => {
                          setSelectedReceipt(pay);
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{pay.receiptNumber} - {pay.residentName}</p>
                          <p className="text-[11px] text-slate-500">Flat {pay.flatNumber} · {pay.date} · {pay.paymentMode}</p>
                        </div>
                        <span className="font-bold text-emerald-600">{formatCurrency(pay.amount)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expenses */}
              {matchedExpenses.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-amber-600" /> Expenses & Invoices ({matchedExpenses.length})
                  </span>
                  <div className="space-y-1">
                    {matchedExpenses.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => {
                          setSelectedInvoice(exp);
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{exp.invoiceNumber} · {exp.vendor}</p>
                          <p className="text-[11px] text-slate-500">{exp.category} · {exp.description}</p>
                        </div>
                        <span className="font-bold text-amber-700">{formatCurrency(exp.amount)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices */}
              {matchedNotices.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-cyan-600" /> Notices ({matchedNotices.length})
                  </span>
                  <div className="space-y-1">
                    {matchedNotices.map((not) => (
                      <button
                        key={not.id}
                        onClick={() => {
                          setSelectedNotice(not);
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="truncate pr-4">
                          <p className="font-bold text-slate-800 truncate">{not.title}</p>
                          <p className="text-[11px] text-slate-500">{not.category} · {not.publishDate}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complaints */}
              {matchedComplaints.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Complaints ({matchedComplaints.length})
                  </span>
                  <div className="space-y-1">
                    {matchedComplaints.map((cmp) => (
                      <button
                        key={cmp.id}
                        onClick={() => {
                          setSelectedComplaint(cmp);
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{cmp.ticketNumber}: {cmp.title}</p>
                          <p className="text-[11px] text-slate-500">Flat {cmp.flatNumber} · {cmp.status} · {cmp.priority} Priority</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with arrow keys or click to open</span>
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="font-semibold text-slate-700 hover:text-slate-900"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
