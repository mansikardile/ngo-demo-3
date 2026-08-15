import React, { useState } from 'react';
import { 
  GraduationCap, 
  Globe, 
  Menu, 
  X, 
  QrCode, 
  Search, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  ChevronDown,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    currentView, 
    navigateTo, 
    currentEvent, 
    setIsEventModalOpen,
    activeStudent
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleNav = (view: any) => {
    navigateTo(view);
    setIsMobileMenuOpen(false);
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'EN' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('event-landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-900 to-rose-700 flex items-center justify-center text-white shadow-sm ring-2 ring-rose-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">KATALYST</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 uppercase tracking-wide">STEM</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-tight">
                {t.brandTagline}
              </p>
            </div>
          </div>

          {/* Event Context Pill (Desktop) */}
          {currentEvent && currentEvent.status === 'active' && (
            <div 
              onClick={() => setIsEventModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
              title="Click to simulate scanning another campus QR event"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-900 truncate max-w-[190px]">
                {currentEvent.collegeName.split('(')[0]}
              </span>
              <span className="text-slate-400 font-mono text-[10px]">({currentEvent.code})</span>
              <QrCode className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
            </div>
          )}

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              type="button"
              id="nav-home"
              onClick={() => handleNav('event-landing')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentView === 'event-landing' || currentView === 'register'
                  ? 'text-rose-800 bg-rose-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navHome}
            </button>

            <button
              type="button"
              id="nav-about"
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentView === 'about'
                  ? 'text-rose-800 bg-rose-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navAbout}
            </button>

            <button
              type="button"
              id="nav-apply"
              onClick={() => handleNav('apply')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentView === 'apply' || currentView === 'apply-success'
                  ? 'text-rose-800 bg-rose-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navApply}
            </button>

            <button
              type="button"
              id="nav-status"
              onClick={() => handleNav('status')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentView === 'status'
                  ? 'text-rose-800 bg-rose-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navStatus}
            </button>

            <button
              type="button"
              id="nav-help"
              onClick={() => handleNav('help')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentView === 'help'
                  ? 'text-rose-800 bg-rose-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navHelp}
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                id="btn-language-selector"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{languages.find(l => l.code === language)?.native || 'EN'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition ${
                        language === lang.code
                          ? 'bg-rose-50 text-rose-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[11px] text-slate-400 font-semibold">{lang.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Continue Application CTA Button */}
            <button
              type="button"
              id="header-cta-continue"
              onClick={() => handleNav(activeStudent ? 'apply' : 'status')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-800 hover:bg-rose-900 transition shadow-sm active:scale-98"
            >
              <span>{t.navContinueApp}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Event Switcher Button on Mobile/Tablet */}
            <button
              type="button"
              onClick={() => setIsEventModalOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              title="Switch Event QR"
            >
              <QrCode className="w-5 h-5 text-rose-800" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {currentEvent && (
            <div 
              onClick={() => {
                setIsEventModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between text-xs"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">Campus Event Linked</span>
                <p className="font-bold text-slate-900">{currentEvent.collegeName}</p>
                <p className="text-slate-500 font-mono text-[11px]">{currentEvent.code}</p>
              </div>
              <span className="text-rose-800 font-semibold text-[11px] underline">Change</span>
            </div>
          )}

          <div className="grid gap-1">
            <button
              type="button"
              onClick={() => handleNav('event-landing')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                currentView === 'event-landing' || currentView === 'register'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.navHome}
            </button>

            <button
              type="button"
              onClick={() => handleNav('about')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                currentView === 'about'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.navAbout}
            </button>

            <button
              type="button"
              onClick={() => handleNav('apply')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                currentView === 'apply' || currentView === 'apply-success'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.navApply}
            </button>

            <button
              type="button"
              onClick={() => handleNav('status')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                currentView === 'status'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.navStatus}
            </button>

            <button
              type="button"
              onClick={() => handleNav('help')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                currentView === 'help'
                  ? 'bg-rose-50 text-rose-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.navHelp}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleNav('apply')}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-rose-800 hover:bg-rose-900 transition text-center shadow-sm flex items-center justify-center gap-2"
            >
              <span>{t.navContinueApp}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
