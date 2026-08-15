import React from 'react';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const Footer: React.FC = () => {
  const { setActivePage } = useAdmin();

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-xs py-4 px-4 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 tracking-tight">Katalyst India</span>
          <span>•</span>
          <span className="text-slate-500">Student Outreach & Application System</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-[11px] px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
            v2.6.4 (Production Ready)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <button 
            type="button"
            onClick={() => setActivePage('help')}
            className="hover:text-rose-600 transition-colors"
          >
            Documentation
          </button>
          <button 
            type="button"
            onClick={() => setActivePage('settings')}
            className="hover:text-rose-600 transition-colors"
          >
            Privacy & Compliance
          </button>
          <a 
            href="https://katalystindia.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-rose-600 transition-colors text-slate-600"
          >
            <span>katalystindia.org</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};
