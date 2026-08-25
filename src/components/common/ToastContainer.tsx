import React from 'react';
import { useSociety } from '../../context/SocietyContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSociety();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-soft-xl border border-slate-200/80 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5"
        >
          {toast.type === 'success' && (
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
