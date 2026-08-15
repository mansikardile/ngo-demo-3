import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Globe, 
  Plus, 
  Eye, 
  EyeOff, 
  Radio, 
  ChevronDown, 
  User, 
  FileSpreadsheet, 
  Calendar, 
  Users, 
  Sparkles,
  Shield,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Language } from '../../types';

interface TopNavbarProps {
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenMobileMenu,
  onOpenNotifications
}) => {
  const {
    activePage,
    currentUser,
    switchAdminRole,
    adminUsers,
    logout,
    globalSearch,
    setGlobalSearch,
    maskPII,
    setMaskPII,
    language,
    setLanguage,
    t,
    notifications,
    setIsCreateEventModalOpen,
    events,
    leads,
    setSelectedEventId,
    setSelectedLeadId,
    setActivePage
  } = useAdmin();

  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Search Results
  const filteredEvents = events.filter(e => 
    e.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
    e.collegeName.toLowerCase().includes(globalSearch.toLowerCase()) ||
    e.eventCode.toLowerCase().includes(globalSearch.toLowerCase())
  ).slice(0, 3);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
    l.college.toLowerCase().includes(globalSearch.toLowerCase()) ||
    l.trackingId.toLowerCase().includes(globalSearch.toLowerCase()) ||
    l.email.toLowerCase().includes(globalSearch.toLowerCase())
  ).slice(0, 3);

  const hasSearchResults = globalSearch.trim().length > 1 && (filteredEvents.length > 0 || filteredLeads.length > 0);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return t('nav_dashboard');
      case 'events': return t('nav_events');
      case 'event-detail': return 'Event Overview & Analytics';
      case 'leads': return t('nav_leads');
      case 'applications': return t('nav_applications');
      case 'analytics': return t('nav_analytics');
      case 'exports': return t('nav_exports');
      case 'integrations': return t('nav_integrations');
      case 'team': return t('nav_team');
      case 'settings': return t('nav_settings');
      case 'help': return t('nav_help');
      default: return 'Admin Portal';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between gap-4 transition-all">
      {/* Left section: Mobile toggle & Breadcrumb/Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>Katalyst</span>
            <span>/</span>
            <span className="text-rose-600 font-semibold">{getPageTitle()}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Global Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setIsSearchDropdownOpen(true);
            }}
            onFocus={() => setIsSearchDropdownOpen(true)}
            placeholder={t('search_placeholder')}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100/80 border border-slate-200/80 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => {
                setGlobalSearch('');
                setIsSearchDropdownOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold px-1 rounded"
            >
              ×
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchDropdownOpen && hasSearchResults && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden text-xs divide-y divide-slate-100">
            {filteredEvents.length > 0 && (
              <div className="p-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-rose-500" />
                  <span>Events</span>
                </div>
                {filteredEvents.map(evt => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedEventId(evt.id);
                      setActivePage('event-detail');
                      setIsSearchDropdownOpen(false);
                      setGlobalSearch('');
                    }}
                    className="p-2 rounded-lg hover:bg-rose-50/70 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-rose-700">
                        {evt.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {evt.collegeName} • <span className="font-mono">{evt.eventCode}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {evt.metrics.registered} registered
                    </span>
                  </div>
                ))}
              </div>
            )}

            {filteredLeads.length > 0 && (
              <div className="p-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-rose-500" />
                  <span>Student Leads</span>
                </div>
                {filteredLeads.map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLeadId(lead.id);
                      setIsSearchDropdownOpen(false);
                      setGlobalSearch('');
                    }}
                    className="p-2 rounded-lg hover:bg-rose-50/70 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-rose-700">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {lead.college} • <span className="font-mono text-slate-600">{lead.trackingId}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      lead.applicationStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      lead.applicationStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {lead.applicationStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Subtle Live Stream Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold">{t('live_indicator')}</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-700 truncate">{t('new_registrations_last_hour')}</span>
        </div>

        {/* PII Masking Privacy Toggle */}
        <button
          type="button"
          onClick={() => setMaskPII(!maskPII)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            maskPII 
              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
          title={maskPII ? "Sensitive phone/emails are masked for student privacy" : "Click to mask sensitive PII"}
        >
          {maskPII ? <EyeOff className="w-3.5 h-3.5 text-amber-700" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
          <span className="hidden sm:inline">{maskPII ? t('mask_toggle_show') : t('mask_toggle_hide')}</span>
        </button>

        {/* Language Selector */}
        <div ref={langRef} className="relative">
          <button
            type="button"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase font-semibold">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1 divide-y divide-slate-100">
              <button
                type="button"
                onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                  language === 'en' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>English</span>
                {language === 'en' && <span className="text-rose-600">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => { setLanguage('hi'); setIsLangMenuOpen(false); }}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                  language === 'hi' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {language === 'hi' && <span className="text-rose-600">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => { setLanguage('mr'); setIsLangMenuOpen(false); }}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                  language === 'mr' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>मराठी (Marathi)</span>
                {language === 'mr' && <span className="text-rose-600">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Quick Create Event Button */}
        <button
          type="button"
          onClick={() => setIsCreateEventModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-900/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('create_event_cta')}</span>
        </button>

        {/* Admin Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
              alt={currentUser?.name || "Admin"}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-rose-500/30"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 divide-y divide-slate-100">
              <div className="px-3 py-2">
                <div className="font-bold text-slate-900 text-sm">{currentUser?.name}</div>
                <div className="text-xs text-slate-500 truncate">{currentUser?.email}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                  <Shield className="w-3 h-3" />
                  <span>{currentUser?.role}</span>
                </div>
              </div>

              {/* Demo Role Switcher */}
              <div className="py-2">
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
                  Switch Admin Persona
                </div>
                {adminUsers.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      switchAdminRole(user.id);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                      currentUser?.id === user.id ? 'bg-rose-50 text-rose-800 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-[10px] text-slate-400">{user.role}</div>
                    </div>
                    {currentUser?.id === user.id && <span className="text-rose-600 font-bold">Active</span>}
                  </button>
                ))}
              </div>

              <div className="pt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('settings');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
