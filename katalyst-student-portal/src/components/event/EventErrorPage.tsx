import React from 'react';
import { AlertTriangle, Clock, CalendarX, QrCode, Phone, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EventErrorPage: React.FC = () => {
  const { currentEvent, t, navigateTo, setIsEventModalOpen } = useApp();

  const isExpired = currentEvent?.status === 'expired';
  const isInactive = currentEvent?.status === 'inactive';
  const isNotFound = !currentEvent;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-center space-y-6">
        
        {/* Error Icon badge */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
          {isExpired ? (
            <Clock className="w-8 h-8" />
          ) : isInactive ? (
            <CalendarX className="w-8 h-8" />
          ) : (
            <AlertTriangle className="w-8 h-8" />
          )}
        </div>

        {/* Headline & Description */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
            {isExpired ? 'Event Completed / Expired' : isInactive ? 'Event Draft / Pending' : 'Event QR Not Found'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.eventErrorTitle}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
            {isExpired
              ? t.eventErrorExpired
              : isNotFound
              ? t.eventErrorInvalid.replace('{id}', 'Scanned Code')
              : 'This outreach drive is scheduled but not yet open for live student registrations.'}
          </p>
        </div>

        {/* Helpful Explanation box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-2">
          <p className="font-semibold text-slate-900">What should you do next?</p>
          <p className="leading-relaxed">
            {t.eventErrorHelpText}
          </p>
          {currentEvent && (
            <div className="pt-1 text-[11px] text-slate-500 font-mono">
              Attempted Event Code: <strong>{currentEvent.code}</strong> ({currentEvent.collegeName})
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsEventModalOpen(true)}
            className="px-5 py-3 rounded-xl font-bold text-white bg-rose-800 hover:bg-rose-900 transition flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md"
          >
            <QrCode className="w-4 h-4" />
            <span>{t.btnTryAnotherEvent}</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('help')}
            className="px-5 py-3 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-slate-500" />
            <span>{t.btnContactSupport}</span>
          </button>
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigateTo('event-landing', 'EVT-MIT-2026-001')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 hover:text-rose-900 underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Active MIT Pune Event (EVT-MIT-2026-001)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
