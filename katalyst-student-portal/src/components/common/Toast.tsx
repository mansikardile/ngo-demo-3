import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div id="katalyst-toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
            default:
              return <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-emerald-50/95 text-emerald-950';
            case 'warning':
              return 'border-amber-200 bg-amber-50/95 text-amber-950';
            case 'error':
              return 'border-rose-200 bg-rose-50/95 text-rose-950';
            default:
              return 'border-blue-200 bg-blue-50/95 text-blue-950';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${getBorderColor()}`}
          >
            {getIcon()}
            <div className="flex-1 text-xs">
              <p className="font-semibold text-slate-900 leading-tight">{toast.title}</p>
              {toast.description && (
                <p className="text-slate-600 mt-0.5 leading-normal">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
