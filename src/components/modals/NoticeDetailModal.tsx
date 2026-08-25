import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { NoticeCategory, NoticePriority } from '../../types';
import { X, Bell, Calendar, Pin, Download, FileText, Send } from 'lucide-react';

export const NoticeDetailModal: React.FC = () => {
  const { selectedNotice, setSelectedNotice, showToast } = useSociety();

  if (!selectedNotice) return null;

  const handleDownload = () => {
    showToast('info', 'Document Downloaded', `${selectedNotice.attachmentName || 'Notice_Document.pdf'} downloaded successfully.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-100 text-cyan-700 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">{selectedNotice.category} Bulletin</span>
              <p className="text-xs text-slate-500">{selectedNotice.publishDate}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedNotice(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {selectedNotice.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  <Pin className="w-3 h-3" /> Pinned
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedNotice.priority === 'Urgent'
                  ? 'bg-rose-100 text-rose-700'
                  : selectedNotice.priority === 'High'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {selectedNotice.priority} Priority
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">{selectedNotice.title}</h3>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-xs">
            {selectedNotice.content}
          </div>

          {selectedNotice.attachmentName && (
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-indigo-950 text-xs">{selectedNotice.attachmentName}</span>
              </div>
              <button
                onClick={handleDownload}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-soft-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          )}

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
            <span>Published by: <strong className="text-slate-600">{selectedNotice.publishedBy}</strong></span>
            <span>Valid till: <strong className="text-slate-600">{selectedNotice.validTill}</strong></span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedNotice(null)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const CreateNoticeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { createNotice } = useSociety();

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<NoticeCategory>('Maintenance');
  const [priority, setPriority] = useState<NoticePriority>('Normal');
  const [validTill, setValidTill] = useState<string>('31 Aug 2026');
  const [content, setContent] = useState<string>('');
  const [publishedBy, setPublishedBy] = useState<string>('Management Committee');
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [attachmentName, setAttachmentName] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    createNotice({
      title,
      category,
      priority,
      validTill,
      content,
      publishedBy,
      isPinned,
      attachmentName: attachmentName ? `${attachmentName}.pdf` : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-100 text-cyan-700 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Broadcast Society Notice</h3>
              <p className="text-xs text-slate-500">Post announcements to all residents & notice board</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Notice Headline / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Water Tank Deep Cleaning Schedule"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Meeting">Meeting / AGM</option>
                <option value="Rules">Rules & Bylaws</option>
                <option value="Celebration">Celebration</option>
                <option value="Emergency">Emergency</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as NoticePriority)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Valid Till</label>
              <input
                type="text"
                value={validTill}
                onChange={(e) => setValidTill(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Notice Description & Details</label>
            <textarea
              required
              rows={4}
              placeholder="Provide complete circular details for members..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Issued By</label>
              <input
                type="text"
                value={publishedBy}
                onChange={(e) => setPublishedBy(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Attachment File (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Schedule_Brochure"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-slate-700 font-medium">Pin this notice to top of the dashboard</span>
          </label>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-soft transition-colors flex items-center gap-1.5">
              <Send className="w-4 h-4" /> Publish Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
