import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../../types';
import { getStatusBadgeClasses } from '../../utils/formatters';
import { X, AlertCircle, CheckCircle2, Clock, Wrench, User, Phone, Check, Plus, MessageSquare } from 'lucide-react';

export const ComplaintDetailModal: React.FC = () => {
  const { selectedComplaint, setSelectedComplaint, updateComplaintStatus } = useSociety();
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(selectedComplaint?.status || 'Open');
  const [noteText, setNoteText] = useState<string>('');

  if (!selectedComplaint) return null;

  const handleUpdate = () => {
    updateComplaintStatus(selectedComplaint.id, newStatus, noteText || undefined);
    setSelectedComplaint(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 text-sm">{selectedComplaint.ticketNumber}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeClasses(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedComplaint.priority === 'High'
                    ? 'bg-rose-100 text-rose-700'
                    : selectedComplaint.priority === 'Medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {selectedComplaint.priority} Priority
                </span>
              </div>
              <p className="text-xs text-slate-500">{selectedComplaint.category} · Registered {selectedComplaint.date}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedComplaint(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Issue Summary */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">{selectedComplaint.title}</h3>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
              {selectedComplaint.description}
            </div>
          </div>

          {/* Resident & Assigned Technician Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600" /> Resident Details
              </span>
              <p className="font-bold text-slate-800 text-sm mt-1">{selectedComplaint.residentName}</p>
              <p className="text-slate-500">Flat {selectedComplaint.flatNumber} · {selectedComplaint.phone}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-amber-600" /> Assigned Technician
              </span>
              <p className="font-bold text-slate-800 text-sm mt-1">{selectedComplaint.assignedTo || 'Unassigned'}</p>
              <p className="text-slate-500">{selectedComplaint.assignedTo ? 'Direct contact available' : 'Awaiting dispatch'}</p>
            </div>
          </div>

          {/* Resolution Timeline */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" /> Resolution Activity Timeline
            </span>
            <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-2">
              {selectedComplaint.timeline.map((item, idx) => (
                <div key={idx} className="relative pl-4">
                  <div className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    item.status === 'Resolved' ? 'bg-emerald-500' : item.status === 'In Progress' ? 'bg-amber-500' : 'bg-indigo-500'
                  }`} />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{item.status}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update Control */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-3">
            <span className="font-bold text-indigo-950 block">Update Ticket Status & Progress</span>
            <div className="grid grid-cols-3 gap-2">
              {(['Open', 'In Progress', 'Resolved'] as ComplaintStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setNewStatus(st)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    newStatus === st
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-soft-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Add Note / Resolution Remarks</label>
              <input
                type="text"
                placeholder="e.g. Technician completed leak sealing and verified flow"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => setSelectedComplaint(null)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-soft transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Ticket Update
          </button>
        </div>
      </div>
    </div>
  );
};

export const NewComplaintModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { authUser, flats, addComplaint, role, currentResidentFlat, currentResidentProfile } = useSociety();

  const isResident = role === 'resident';
  const defaultFlat = authUser?.flatNumber || currentResidentFlat?.flatNumber || (flats[0]?.flatNumber || 'A-101');
  const defaultName = authUser?.name || currentResidentProfile?.name || 'Resident Member';

  const [category, setCategory] = useState<ComplaintCategory>('Plumbing');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [flatNumber, setFlatNumber] = useState<string>(defaultFlat);
  const [residentName, setResidentName] = useState<string>(defaultName);
  const [phone, setPhone] = useState<string>(currentResidentProfile?.phone || '+91 98765 43210');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addComplaint({
      residentName: isResident ? defaultName : residentName,
      flatNumber: isResident ? defaultFlat : flatNumber,
      phone: isResident ? (currentResidentProfile?.phone || phone) : phone,
      category,
      title,
      description,
      priority,
      status: 'Open',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Lodge Maintenance Request</h3>
              <p className="text-xs text-slate-500">Report plumbing, electrical, lift or society issues</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {!isResident && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Flat Unit</label>
                <select
                  value={flatNumber}
                  onChange={(e) => {
                    setFlatNumber(e.target.value);
                    const f = flats.find((x) => x.flatNumber === e.target.value);
                    if (f && f.residentName) {
                      setResidentName(f.residentName);
                      setPhone(f.residentPhone || '+91 98000 00000');
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  {flats.filter((f) => f.occupancyStatus === 'Occupied').map((f) => (
                    <option key={f.flatNumber} value={f.flatNumber}>
                      {f.flatNumber} - {f.residentName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Resident Name</label>
                <input
                  type="text"
                  required
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="Plumbing">Plumbing & Water</option>
                <option value="Electrical">Electrical & Lighting</option>
                <option value="Lift">Lift & Elevator</option>
                <option value="Security">Security & Parking</option>
                <option value="Cleanliness">Cleanliness & Waste</option>
                <option value="Noise">Noise Disturbance</option>
                <option value="Carpentry">Carpentry & Civil</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Urgency Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Issue Summary / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Water leakage in master bathroom ceiling"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Detailed Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the issue, location, and severity in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-soft transition-colors flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
