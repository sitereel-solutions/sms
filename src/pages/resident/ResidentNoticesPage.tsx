import React from 'react';
import { useSociety } from '../../context/SocietyContext';
import { Bell, Pin, Calendar, FileText, ArrowRight } from 'lucide-react';

export const ResidentNoticesPage: React.FC = () => {
  const { notices, setSelectedNotice } = useSociety();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Society Bulletins & Circulars</h1>
        <p className="text-xs text-slate-500 mt-0.5">Stay informed about upcoming maintenance shutdowns, society events, and committee decisions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setSelectedNotice(notice)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-soft-md hover:border-cyan-300 p-5 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
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
                    {notice.category}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{notice.publishDate}</span>
              </div>

              <div className="py-3">
                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-cyan-700 transition-colors">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium">
                {notice.publishedBy}
              </span>
              <span className="text-[11px] font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                View Details →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
