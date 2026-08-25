import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import {
  Bell,
  Search,
  Plus,
  Pin,
  Calendar,
  User,
  FileText,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CreateNoticeModal } from '../../components/modals/NoticeDetailModal';

export const NoticesPage: React.FC = () => {
  const { notices, setSelectedNotice, showToast } = useSociety();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.publishedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleDownload = (name?: string) => {
    showToast('info', 'Document Downloaded', `${name || 'Notice_Attachment.pdf'} saved to downloads.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notices & Circulars</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              {notices.length} Published
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Broadcast society announcements, meeting agendas, and operational schedules</p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> + Create Notice
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars (e.g. Water Supply, AGM, Parking Rules)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="All">All Categories</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Meeting">Meeting / AGM</option>
              <option value="Rules">Rules & Bylaws</option>
              <option value="Celebration">Celebration</option>
              <option value="Emergency">Emergency</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setSelectedNotice(notice)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-soft-md hover:border-cyan-300 p-5 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  {notice.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    notice.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-700'
                      : notice.priority === 'High'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {notice.priority}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{notice.publishDate}</span>
              </div>

              {/* Title & Body */}
              <div className="py-3">
                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-cyan-700 transition-colors line-clamp-2">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>
              </div>
            </div>

            {/* Bottom Meta & Attachment */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                {notice.publishedBy}
              </span>

              {notice.attachmentName ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(notice.attachmentName);
                  }}
                  className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3 h-3" /> Attachment
                </button>
              ) : (
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Published
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      <CreateNoticeModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
