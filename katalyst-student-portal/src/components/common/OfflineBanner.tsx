import React from 'react';
import { WifiOff, RefreshCw, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { 
    isOffline, 
    isSimulatedOffline, 
    toggleSimulatedOffline, 
    pendingSyncItems, 
    triggerManualSync,
    t 
  } = useApp();

  return (
    <aside aria-label="Network status and test controls" className="w-full bg-slate-900 text-slate-200 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Offline indicator */}
        {isOffline ? (
          <div className="flex items-center gap-2 text-amber-400 font-medium animate-pulse">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {t.offlineTitle} — Registrations stored locally on this device.
            </span>
            {pendingSyncItems.length > 0 && (
              <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                {pendingSyncItems.length} Pending Sync
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-medium text-slate-300">Live Secure Gateway: Ready for Student Registration</span>
          </div>
        )}

        {/* Sync Actions & Simulator toggle */}
        <div className="flex items-center gap-3 ml-auto">
          {pendingSyncItems.length > 0 && (
            <button
              type="button"
              id="btn-sync-offline"
              onClick={triggerManualSync}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-md transition shadow-xs"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync {pendingSyncItems.length} Record(s)</span>
            </button>
          )}

          <button
            type="button"
            id="btn-toggle-offline-simulation"
            onClick={toggleSimulatedOffline}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition border ${
              isSimulatedOffline 
                ? 'bg-amber-950 text-amber-300 border-amber-700' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Smartphone className="w-3 h-3 text-slate-400" />
            <span>{isSimulatedOffline ? 'Exit Offline Simulation' : 'Test Auditorium Offline Mode'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
