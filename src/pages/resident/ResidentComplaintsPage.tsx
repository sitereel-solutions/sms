import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { getStatusBadgeClasses } from '../../utils/formatters';
import { MessageSquareWarning, Plus, AlertCircle, CheckCircle2, Clock, Wrench, Eye } from 'lucide-react';
import { NewComplaintModal } from '../../components/modals/ComplaintDetailModal';

export const ResidentComplaintsPage: React.FC = () => {
  const { authUser, currentResidentFlat, complaints, setSelectedComplaint } = useSociety();
  const [isNewOpen, setIsNewOpen] = useState<boolean>(false);

  const flatNumber = authUser?.flatNumber || currentResidentFlat?.flatNumber || 'A-101';
  const myComplaints = complaints.filter((c) => c.flatNumber === flatNumber);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Helpdesk Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track maintenance tickets and lodge new plumbing, electrical, or society requests</p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> + Log New Complaint
        </button>
      </div>

      <div className="space-y-4">
        {myComplaints.map((cmp) => (
          <div
            key={cmp.id}
            onClick={() => setSelectedComplaint(cmp)}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft hover:shadow-soft-md hover:border-rose-300 cursor-pointer transition-all space-y-4 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-rose-600 text-sm">{cmp.ticketNumber}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                  {cmp.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  cmp.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {cmp.priority} Priority
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border self-start sm:self-auto ${getStatusBadgeClasses(cmp.status)}`}>
                ● {cmp.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                {cmp.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {cmp.description}
              </p>
            </div>

            {/* Timeline Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Assigned to: <strong>{cmp.assignedTo || 'Facility Support Desk'}</strong></span>
              </div>
              <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Track Timeline & Remarks →
              </span>
            </div>
          </div>
        ))}
      </div>

      <NewComplaintModal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} />
    </div>
  );
};
