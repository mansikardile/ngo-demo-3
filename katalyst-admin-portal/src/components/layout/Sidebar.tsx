import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users2, 
  FileCheck2, 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  Bell, 
  Settings, 
  HelpCircle, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAdmin, NavigationPage } from '../../context/AdminContext';

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed: controlledCollapsed,
  setIsCollapsed: controlledSetCollapsed,
  isMobileOpen: controlledMobileOpen,
  setIsMobileOpen: controlledSetMobileOpen
}) => {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = React.useState(false);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setIsCollapsed = controlledSetCollapsed || setInternalCollapsed;
  const isMobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen;
  const setIsMobileOpen = controlledSetMobileOpen || setInternalMobileOpen;
  const { 
    activePage, 
    setActivePage, 
    notifications, 
    currentUser, 
    logout, 
    t, 
    events, 
    leads, 
    applications,
    setIsCreateEventModalOpen 
  } = useAdmin();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: { id: NavigationPage; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { id: 'events', label: t('nav_events'), icon: CalendarDays, badge: events.length },
    { id: 'leads', label: t('nav_leads'), icon: Users2, badge: leads.length },
    { id: 'applications', label: t('nav_applications'), icon: FileCheck2, badge: applications.length },
    { id: 'analytics', label: t('nav_analytics'), icon: BarChart3 },
    { id: 'exports', label: t('nav_exports'), icon: Download },
    { id: 'integrations', label: t('nav_integrations'), icon: FileSpreadsheet },
    { id: 'notifications', label: t('nav_notifications'), icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'settings', label: t('nav_settings'), icon: Settings },
    { id: 'help', label: t('nav_help'), icon: HelpCircle },
  ];

  const handleNavClick = (pageId: NavigationPage) => {
    setActivePage(pageId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-950/50 shrink-0 ring-1 ring-rose-400/30">
              <span className="font-black text-xl text-white tracking-wider font-mono">K</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-tight leading-none group-hover:text-rose-400 transition-colors">
                    KATALYST
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  Outreach & Tracking
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => setIsCreateEventModalOpen(true)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 shadow-md ${
              isCollapsed 
                ? 'bg-rose-600 hover:bg-rose-500 text-white justify-center px-0' 
                : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-950/40'
            }`}
            title="Create New Outreach Event"
          >
            <Sparkles className="w-4 h-4 shrink-0 text-rose-200" />
            {!isCollapsed && <span className="truncate">{t('create_event_cta')}</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1">
            {!isCollapsed ? 'Navigation' : '•'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-rose-600/15 text-rose-300 border border-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-rose-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">
                    {item.label}
                  </span>
                )}

                {item.badge !== undefined && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive 
                      ? 'bg-rose-500 text-white' 
                      : typeof item.badge === 'number' && item.id === 'notifications'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Left Active indicator pill */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-rose-500 rounded-r-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Security & NGO Info Note */}
        {!isCollapsed && (
          <div className="mx-3 my-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-medium mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('secure_badge')}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Strictly confidential student demographic and academic records.
            </p>
          </div>
        )}

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div 
              onClick={() => handleNavClick('settings')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            >
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
                alt={currentUser?.name || "Admin"}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-rose-500 transition-all shrink-0"
              />
              {!isCollapsed && (
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-semibold text-white truncate group-hover:text-rose-300 transition-colors">
                    {currentUser?.name || 'Sunita Rao'}
                  </span>
                  <span className="text-[10px] text-rose-400 font-medium truncate">
                    {currentUser?.role || 'Super Admin'}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
