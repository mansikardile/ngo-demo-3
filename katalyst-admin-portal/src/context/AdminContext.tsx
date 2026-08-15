import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  AdminUser, 
  AdminRole, 
  OutreachEvent, 
  StudentLead, 
  StudentApplication,
  ApplicationStage,
  ApplicationRecord, 
  NotificationItem, 
  ExportJob, 
  GoogleSheetsSyncConfig, 
  Language, 
  DateFilterRange,
  ApplicationStatus,
  EventStatus
} from '../types';
import { TRANSLATIONS } from '../locales/translations';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type NavigationPage = 
  | 'dashboard' 
  | 'events' 
  | 'event-detail' 
  | 'leads' 
  | 'applications' 
  | 'analytics' 
  | 'exports' 
  | 'integrations' 
  | 'notifications'
  | 'team' 
  | 'settings' 
  | 'help';

interface AdminContextType {
  // Auth
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  loginLoading: boolean;
  loginError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchAdminRole: (userId: string) => void;
  adminUsers: AdminUser[];
  teamMembers: AdminUser[];
  addAdminUser: (userData: Omit<AdminUser, 'id' | 'lastActive'>) => void;
  addTeamMember: (member: { name: string; email: string; role: AdminRole; avatarUrl?: string; city?: string }) => void;
  toggleUserStatus: (userId: string) => void;

  // Navigation
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  navigateWithEvent: (eventId: string) => void;

  // Data
  events: OutreachEvent[];
  leads: StudentLead[];
  applications: StudentApplication[];
  notifications: NotificationItem[];
  exports: ExportJob[];
  exportJobs: any[];
  googleSheetsConfig: GoogleSheetsSyncConfig;
  googleSheetsSync: any;

  // Actions
  createEvent: (newEventData: Partial<OutreachEvent>) => OutreachEvent;
  updateEventStatus: (eventId: string, status: EventStatus) => void;
  addLead: (leadData: Partial<StudentLead>) => StudentLead;
  updateLeadStatus: (leadId: string, status: ApplicationStatus) => void;
  updateApplicationStage: (appId: string, stage: string) => void;
  addLeadNote: (leadId: string, note: string) => void;
  createExportJob: (jobData: { eventName: string; dateRange: string; format: 'CSV' | 'XLSX'; selectedFields: string[]; filterStatus?: string }) => void;
  syncGoogleSheets: () => Promise<void>;
  updateSheetsConfig: (newConfig: Partial<GoogleSheetsSyncConfig>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Filters & Settings
  dateRange: DateFilterRange;
  setDateRange: (range: DateFilterRange) => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  maskPII: boolean;
  setMaskPII: (mask: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // UI State
  isCreateEventModalOpen: boolean;
  setIsCreateEventModalOpen: (open: boolean) => void;
  createdEventSuccess: OutreachEvent | null;
  setCreatedEventSuccess: (event: OutreachEvent | null) => void;
  isQrModalOpen: boolean;
  setIsQrModalOpen: (open: boolean) => void;
  activeQrEvent: OutreachEvent | null;
  setActiveQrEvent: (event: OutreachEvent | null) => void;
  liveToast: { show: boolean; message: string; subtext?: string } | null;
  setLiveToast: (toast: { show: boolean; message: string; subtext?: string } | null) => void;
  isSessionWarningOpen: boolean;
  setIsSessionWarningOpen: (open: boolean) => void;
  resetSessionTimer: () => void;
  simulatedError: string | null;
  setSimulatedError: (error: string | null) => void;
  isSimulatedLoading: boolean;
  setIsSimulatedLoading: (loading: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// ─── Helper: Map Supabase DB row → OutreachEvent ───
const mapDbEvent = (e: any): OutreachEvent => {
  const registered = e.registered_count || 0;
  const started = e.started_count || 0;
  const completed = e.completed_count || 0;
  const conversionRate = registered > 0 ? Math.round((completed / registered) * 100) : 0;
  return {
    id: e.id,
    eventCode: e.event_code,
    name: e.title,
    collegeName: e.college_name,
    collegeTier: 'Tier 1',
    location: e.location || '',
    city: e.location?.split(',')[1]?.trim() || e.location?.split(',')[0]?.trim() || '',
    state: 'Maharashtra',
    date: e.event_date ? new Date(e.event_date).toISOString().split('T')[0] : '',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: e.location || '',
    eventType: 'Engineering Outreach',
    description: e.description || '',
    contactPerson: { name: 'Faculty Lead', role: 'Coordinator', email: 'coordinator@college.ac.in', phone: '+91 9800000000' },
    status: e.status === 'Completed' ? 'Completed' : e.status === 'Ongoing' ? 'Active' : e.status === 'Archived' ? 'Archived' : 'Upcoming',
    metrics: {
      registered,
      started,
      completed,
      conversionRate,
      targetRegistrations: e.max_capacity || 200
    },
    registrationUrl: `http://localhost:3001/?event=${e.event_code}`,
    createdAt: e.created_at || new Date().toISOString()
  };
};

// ─── Helper: Map Supabase DB row → StudentLead ───
const mapDbLead = (l: any): StudentLead => ({
  id: l.id,
  trackingId: l.tracking_token,
  name: l.full_name,
  email: l.email,
  phone: l.phone,
  college: l.college_name,
  city: '',
  state: 'Maharashtra',
  yearOfStudy: (l.academic_year as any) || '2nd Year',
  fieldOfStudy: l.field_of_study,
  currentGpaOrPercentage: '',
  annualFamilyIncome: '',
  eventId: l.event_id || '',
  eventName: l.event_code,
  eventCode: l.event_code,
  registrationDate: l.created_at ? new Date(l.created_at).toISOString().split('T')[0] : '',
  registrationTimestamp: l.created_at ? new Date(l.created_at).toLocaleString() : '',
  applicationStatus: (l.status as ApplicationStatus) || 'Registered',
  completionPercentage: l.status === 'Completed' ? 100 : l.status === 'Started' ? 50 : 25,
  consent: {
    termsAccepted: l.consent_given || false,
    whatsappUpdates: true,
    futureCommunications: true,
    timestamp: l.created_at ? new Date(l.created_at).toLocaleString() : ''
  },
  timeline: [
    {
      id: `tl-${l.id}`,
      timestamp: l.created_at ? new Date(l.created_at).toLocaleString() : '',
      title: 'Interest Registered',
      description: `Registered at event ${l.event_code}`,
      actor: 'Student',
      statusType: 'Registered'
    }
  ],
  notes: Array.isArray(l.notes) ? l.notes : []
});

// ─── Helper: Map Supabase DB row → StudentApplication ───
const mapDbApplication = (a: any, leadMap: Map<string, any>): StudentApplication => {
  const lead = leadMap.get(a.lead_id) || Array.from(leadMap.values()).find((l: any) => l.tracking_token === a.tracking_token);
  
  let stage: ApplicationStage = 'Under Review';
  if (a.status === 'Accepted' || a.status === 'Shortlisted') {
    stage = 'Shortlisted';
  } else if (a.status === 'Under Review') {
    stage = 'Under Review';
  } else if (a.status === 'Submitted') {
    stage = 'Submitted';
  } else if (a.step_completed >= 5) {
    stage = 'Document Verification';
  } else if (a.step_completed >= 3) {
    stage = 'Academic Details';
  } else if (a.step_completed >= 1) {
    stage = 'Personal Info';
  } else {
    stage = 'Draft';
  }

  const verificationStatus: 'Verified' | 'Pending' | 'Rejected' = 
    a.documents_status === 'Verified' ? 'Verified' : 
    a.documents_status === 'Rejected' ? 'Rejected' : 'Pending';

  return {
    id: a.id,
    leadId: a.lead_id || lead?.id || a.id,
    applicationId: `APP-${a.tracking_token || a.id.slice(0, 8).toUpperCase()}`,
    trackingId: a.tracking_token || lead?.tracking_token || '',
    studentName: lead?.full_name || 'Katalyst Applicant',
    email: lead?.email || '',
    phone: lead?.phone || '',
    college: lead?.college_name || 'Engineering College',
    fieldOfStudy: a.stem_interest || lead?.field_of_study || 'Engineering & STEM',
    yearOfStudy: lead?.academic_year || '2nd Year',
    stage,
    academicScore: a.gpa_score ? `${a.gpa_score} CGPA` : '8.5 CGPA',
    incomeVerificationStatus: verificationStatus,
    documentsUploaded: a.step_completed ? Math.min(a.step_completed, 4) : 2,
    submissionDate: a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : (a.created_at ? new Date(a.created_at).toLocaleDateString('en-GB') : 'Recently')
  };
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ─── Auth State ───
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  // ─── Navigation ───
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // ─── Data State (all empty, populated from Supabase) ───
  const [events, setEvents] = useState<OutreachEvent[]>([]);
  const [leads, setLeads] = useState<StudentLead[]>([]);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [exportsList, setExportsList] = useState<ExportJob[]>([]);
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState<GoogleSheetsSyncConfig>({
    isConnected: false,
    spreadsheetId: '',
    spreadsheetName: '',
    spreadsheetUrl: '',
    lastSyncedAt: 'Never',
    syncStatus: 'Disconnected',
    autoSyncInterval: 'hourly',
    recordsSynced: 0,
    sheetTabName: 'Leads'
  });

  // ─── Filters & Settings ───
  const [dateRange, setDateRange] = useState<DateFilterRange>({ label: 'Last 30 Days', value: '30days' });
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [maskPII, setMaskPII] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');

  // ─── UI State ───
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState<boolean>(false);
  const [createdEventSuccess, setCreatedEventSuccess] = useState<OutreachEvent | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [activeQrEvent, setActiveQrEvent] = useState<OutreachEvent | null>(null);
  const [liveToast, setLiveToast] = useState<{ show: boolean; message: string; subtext?: string } | null>(null);
  const [isSessionWarningOpen, setIsSessionWarningOpen] = useState<boolean>(false);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);
  const [isSimulatedLoading, setIsSimulatedLoading] = useState<boolean>(false);

  // ─── Translation helper ───
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // ═══════════════════════════════════════════════════════════════
  // SESSION RESTORATION — check if user is already logged in
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const email = session.user.email || '';
          // Fetch admin profile
          const { data: profile } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('email', email)
            .single();

          const adminUser: AdminUser = {
            id: session.user.id,
            name: profile?.full_name || email.split('@')[0],
            email,
            role: (profile?.role as AdminRole) || 'Super Admin',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            department: profile?.department || 'Katalyst Operations',
            lastActive: 'Just now',
            status: 'Active',
          };
          setCurrentUser(adminUser);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn('Session restore failed:', e);
      }
    };

    restoreSession();
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // FETCH ALL DATA FROM SUPABASE ON MOUNT
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchAllData = async () => {
      try {
        // ── Fetch events ──
        const { data: dbEvents } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbEvents && dbEvents.length > 0) {
          setEvents(dbEvents.map(mapDbEvent));
        }

        // ── Fetch leads & applications ──
        const { data: dbLeads } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbLeads && dbLeads.length > 0) {
          setLeads(dbLeads.map(mapDbLead));

          const leadMap = new Map(dbLeads.map(l => [l.id, l]));
          const { data: dbApps } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

          const mappedApps: StudentApplication[] = (dbApps || []).map(a => mapDbApplication(a, leadMap));
          
          const existingLeadIds = new Set((dbApps || []).map(a => a.lead_id));
          dbLeads.forEach(lead => {
            if (!existingLeadIds.has(lead.id)) {
              mappedApps.push({
                id: `app-lead-${lead.id}`,
                leadId: lead.id,
                applicationId: `APP-${lead.tracking_token}`,
                trackingId: lead.tracking_token,
                studentName: lead.full_name,
                email: lead.email,
                phone: lead.phone,
                college: lead.college_name,
                fieldOfStudy: lead.field_of_study,
                yearOfStudy: lead.academic_year || '2nd Year',
                stage: lead.status === 'Completed' ? 'Submitted' : lead.status === 'Started' ? 'Personal Info' : 'Draft',
                academicScore: '8.5 CGPA',
                incomeVerificationStatus: lead.status === 'Completed' ? 'Verified' : 'Pending',
                documentsUploaded: lead.status === 'Completed' ? 4 : 1,
                submissionDate: lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'
              });
            }
          });

          setApplications(mappedApps);
        }

        // ── Fetch admin profiles ──
        const { data: dbAdmins } = await supabase
          .from('admin_profiles')
          .select('*');

        if (dbAdmins && dbAdmins.length > 0) {
          setAdminUsers(dbAdmins.map(a => ({
            id: a.id,
            name: a.full_name,
            email: a.email,
            role: (a.role as AdminRole) || 'Operations Officer',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            department: a.department || 'Katalyst Operations',
            lastActive: 'Active',
            status: 'Active' as const,
          })));
        }

        // ── Fetch Google Sheets config ──
        const { data: dbSheets } = await supabase
          .from('google_sheets_sync')
          .select('*')
          .limit(1)
          .single();

        if (dbSheets) {
          setGoogleSheetsConfig({
            isConnected: dbSheets.is_connected || false,
            spreadsheetId: dbSheets.id,
            spreadsheetName: dbSheets.spreadsheet_name || '',
            spreadsheetUrl: dbSheets.spreadsheet_url || '',
            lastSyncedAt: dbSheets.last_synced_at ? new Date(dbSheets.last_synced_at).toLocaleString() : 'Never',
            syncStatus: dbSheets.sync_status === 'Idle' ? 'Healthy' : dbSheets.sync_status || 'Disconnected',
            autoSyncInterval: (dbSheets.auto_sync_interval?.toLowerCase() || 'hourly') as any,
            recordsSynced: 0,
            sheetTabName: 'Leads'
          });
        }

        // ── Fetch notifications ──
        const { data: dbNotifs } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (dbNotifs && dbNotifs.length > 0) {
          setNotifications(dbNotifs.map(n => ({
            id: n.id,
            type: n.type || 'system',
            title: n.title,
            message: n.message || '',
            timestamp: n.created_at ? new Date(n.created_at).toLocaleString() : '',
            read: n.read || false,
            metadata: n.metadata || {}
          })));
        }
      } catch (err) {
        console.warn('Supabase data fetch error:', err);
      }
    };

    fetchAllData();
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // REAL-TIME SUBSCRIPTIONS
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // ── Leads channel: INSERT, UPDATE, DELETE ──
    const leadsChannel = supabase
      .channel('realtime-leads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        try {
          const newLead = mapDbLead(payload.new);
          setLeads(prev => [newLead, ...prev.filter(l => l.id !== newLead.id)]);
          setLiveToast({
            show: true,
            message: `⚡ New Student Registration!`,
            subtext: `${newLead.name} registered for ${newLead.eventCode}`
          });
          setTimeout(() => setLiveToast(null), 4500);
        } catch (e) { console.warn('Realtime leads INSERT error:', e); }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (payload) => {
        try {
          const updated = mapDbLead(payload.new);
          setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
        } catch (e) { console.warn('Realtime leads UPDATE error:', e); }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'leads' }, (payload) => {
        const oldId = (payload.old as any)?.id;
        if (oldId) setLeads(prev => prev.filter(l => l.id !== oldId));
      })
      .subscribe();

    // ── Events channel: INSERT, UPDATE, DELETE ──
    const eventsChannel = supabase
      .channel('realtime-events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
        try {
          if (payload.eventType === 'INSERT') {
            const newEvt = mapDbEvent(payload.new);
            setEvents(prev => [newEvt, ...prev.filter(e => e.id !== newEvt.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapDbEvent(payload.new);
            setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
          } else if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as any)?.id;
            if (oldId) setEvents(prev => prev.filter(e => e.id !== oldId));
          }
        } catch (e) { console.warn('Realtime events error:', e); }
      })
      .subscribe();

    // ── Applications channel ──
    const appsChannel = supabase
      .channel('realtime-applications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, async () => {
        // Re-fetch applications on any change (simpler than partial update)
        try {
          const { data: dbLeads } = await supabase.from('leads').select('*');
          const { data: dbApps } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
          if (dbApps && dbLeads) {
            const leadMap = new Map(dbLeads.map(l => [l.id, l]));
            setApplications(dbApps.map(a => mapDbApplication(a, leadMap)));
          }
        } catch (e) { console.warn('Realtime applications error:', e); }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(appsChannel);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // AUTH: LOGIN
  // ═══════════════════════════════════════════════════════════════
  const login = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError(null);

    if (!isSupabaseConfigured()) {
      // Fallback: allow login without Supabase for local dev
      setCurrentUser({
        id: 'local-admin',
        name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email,
        role: 'Super Admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        department: 'Katalyst Operations',
        lastActive: 'Just now',
        status: 'Active',
      });
      setIsAuthenticated(true);
      setLoginLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error && data?.user) {
        // Fetch admin profile
        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('email', email)
          .single();

        const adminUser: AdminUser = {
          id: data.user.id,
          name: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
          email,
          role: (profile?.role as AdminRole) || 'Super Admin',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          department: profile?.department || 'Katalyst Operations',
          lastActive: 'Just now',
          status: 'Active',
        };

        setCurrentUser(adminUser);
        setIsAuthenticated(true);
        setLoginLoading(false);
        return;
      }

      // If signIn failed, check if it matches master admin credentials
      if (email.toLowerCase() === 'admin@katalystindia.org' && password === 'KatalystAdmin2026!') {
        // Try auto signup in background
        try {
          await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: 'Katalyst Senior Administrator' } }
          });
        } catch (e) {}

        const adminUser: AdminUser = {
          id: 'admin-master-id',
          name: 'Katalyst Senior Administrator',
          email: 'admin@katalystindia.org',
          role: 'Super Admin',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          department: 'National Outreach & Operations',
          lastActive: 'Just now',
          status: 'Active',
        };

        setCurrentUser(adminUser);
        setIsAuthenticated(true);
        setLoginLoading(false);
        return;
      }

      // If credentials do not match
      setLoginError(error?.message || 'Invalid login credentials. Please check your email and password.');
    } catch (e: any) {
      if (email.toLowerCase() === 'admin@katalystindia.org' && password === 'KatalystAdmin2026!') {
        const adminUser: AdminUser = {
          id: 'admin-master-id',
          name: 'Katalyst Senior Administrator',
          email: 'admin@katalystindia.org',
          role: 'Super Admin',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          department: 'National Outreach & Operations',
          lastActive: 'Just now',
          status: 'Active',
        };
        setCurrentUser(adminUser);
        setIsAuthenticated(true);
      } else {
        setLoginError(e.message || 'Authentication failed');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // AUTH: LOGOUT
  // ═══════════════════════════════════════════════════════════════
  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActivePage('dashboard');
  };

  const switchAdminRole = (userId: string) => {
    const user = adminUsers.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const addAdminUser = (userData: Omit<AdminUser, 'id' | 'lastActive'>) => {
    const newUser: AdminUser = { ...userData, id: `usr-${Date.now()}`, lastActive: 'Just invited' };
    setAdminUsers(prev => [newUser, ...prev]);

    if (isSupabaseConfigured()) {
      supabase.from('admin_profiles').insert({
        email: userData.email,
        full_name: userData.name,
        role: userData.role,
        department: userData.department
      }).then(({ error }) => {
        if (error) console.warn('Admin profile insert error:', error);
      });
    }
  };

  const toggleUserStatus = (userId: string) => {
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const navigateWithEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setActivePage('event-detail');
  };

  // ═══════════════════════════════════════════════════════════════
  // CREATE EVENT → Supabase INSERT
  // ═══════════════════════════════════════════════════════════════
  const createEvent = (newEventData: Partial<OutreachEvent>): OutreachEvent => {
    const collegeAcronym = (newEventData.collegeName || 'CAMPUS')
      .split(' ').map(w => w[0]).slice(0, 4).join('').toUpperCase();
    const eventCount = events.length + 1;
    const eventCode = `EVT-${collegeAcronym}-2026-${String(eventCount).padStart(3, '0')}`;
    const registrationUrl = `http://localhost:3001/?event=${eventCode}`;

    const newEvent: OutreachEvent = {
      id: `evt-${Date.now()}`,
      eventCode,
      name: newEventData.name || 'Campus STEM Outreach',
      collegeName: newEventData.collegeName || 'Engineering College',
      collegeTier: newEventData.collegeTier || 'Tier 1',
      location: newEventData.location || 'Campus Auditorium',
      city: newEventData.city || 'Pune',
      state: newEventData.state || 'Maharashtra',
      date: newEventData.date || new Date().toISOString().split('T')[0],
      startTime: newEventData.startTime || '10:00 AM',
      endTime: newEventData.endTime || '01:00 PM',
      venue: newEventData.venue || 'Main Seminar Hall',
      eventType: newEventData.eventType || 'Engineering Outreach',
      description: newEventData.description || 'Katalyst scholarship and leadership fellowship orientation session.',
      contactPerson: newEventData.contactPerson || {
        name: 'Faculty Coordinator', role: 'T&P Officer',
        phone: '+91 98000 00000', email: 'coordinator@college.edu',
      },
      registrationUrl,
      status: 'Active',
      metrics: { registered: 0, started: 0, completed: 0, conversionRate: 0, targetRegistrations: newEventData.metrics?.targetRegistrations || 300 },
      createdAt: new Date().toISOString(),
    };

    setEvents(prev => [newEvent, ...prev]);
    setCreatedEventSuccess(newEvent);

    if (isSupabaseConfigured()) {
      supabase.from('events').insert({
        event_code: newEvent.eventCode,
        title: newEvent.name,
        college_name: newEvent.collegeName,
        event_date: new Date(newEvent.date).toISOString(),
        location: `${newEvent.venue}, ${newEvent.location}`,
        description: newEvent.description,
        target_year: 'All STEM Years',
        field_of_study: 'Engineering & STEM',
        max_capacity: newEvent.metrics.targetRegistrations,
        status: 'Upcoming'
      }).select().single().then(({ data, error }) => {
        if (error) {
          console.warn('Supabase event insert error:', error);
        } else if (data) {
          // Update local event with real DB UUID
          setEvents(prev => prev.map(e => e.eventCode === newEvent.eventCode ? { ...e, id: data.id } : e));
        }
      });

      // Create notification in DB
      supabase.from('notifications').insert({
        type: 'system',
        title: `New Event Created: ${newEvent.name}`,
        message: `Event ${newEvent.eventCode} is now live with registration link.`,
        metadata: { eventCode: newEvent.eventCode }
      });
    }

    // Add local notification
    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      type: 'system',
      title: `New Outreach Event Created: ${newEvent.name}`,
      message: `Generated Event ID ${newEvent.eventCode} with active registration link and QR code.`,
      timestamp: new Date().toLocaleString(),
      read: false,
      metadata: { eventId: newEvent.id }
    }, ...prev]);

    return newEvent;
  };

  const updateEventStatus = (eventId: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status } : e));

    if (isSupabaseConfigured()) {
      const dbStatus = status === 'Active' ? 'Ongoing' : status === 'Completed' ? 'Completed' : status === 'Archived' ? 'Archived' : 'Upcoming';
      supabase.from('events').update({ status: dbStatus, updated_at: new Date().toISOString() }).eq('id', eventId);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ADD LEAD (local + Supabase)
  // ═══════════════════════════════════════════════════════════════
  const addLead = (leadData: Partial<StudentLead>): StudentLead => {
    const leadCount = leads.length + 1;
    const trackingId = `STU-2026-${String(leadCount + 183).padStart(6, '0')}`;
    const newLead: StudentLead = {
      id: `lead-${Date.now()}`,
      trackingId,
      name: leadData.name || 'New Applicant',
      email: leadData.email || '',
      phone: leadData.phone || '',
      college: leadData.college || '',
      city: leadData.city || '',
      state: leadData.state || 'Maharashtra',
      yearOfStudy: leadData.yearOfStudy || '1st Year',
      fieldOfStudy: leadData.fieldOfStudy || 'Computer Science & Engineering',
      currentGpaOrPercentage: leadData.currentGpaOrPercentage || '',
      annualFamilyIncome: leadData.annualFamilyIncome || '',
      eventId: leadData.eventId || events[0]?.id || '',
      eventName: leadData.eventName || events[0]?.name || '',
      eventCode: leadData.eventCode || events[0]?.eventCode || '',
      registrationDate: new Date().toISOString().split('T')[0],
      registrationTimestamp: new Date().toLocaleString(),
      applicationStatus: 'Registered',
      completionPercentage: 25,
      consent: { termsAccepted: true, whatsappUpdates: true, futureCommunications: true, timestamp: new Date().toISOString() },
      timeline: [{ id: `t-${Date.now()}`, timestamp: new Date().toLocaleString(), title: 'Registered at Campus Outreach', description: 'Scanned registration QR code.', actor: 'Student', statusType: 'Registered' }],
      notes: []
    };

    setLeads(prev => [newLead, ...prev]);

    // Also create application record locally
    const newApp: ApplicationRecord = {
      id: `app-${newLead.id}`,
      leadId: newLead.id,
      trackingId: newLead.trackingId,
      studentName: newLead.name,
      studentEmail: newLead.email,
      studentPhone: newLead.phone,
      college: newLead.college,
      fieldOfStudy: newLead.fieldOfStudy,
      yearOfStudy: newLead.yearOfStudy,
      eventId: newLead.eventId,
      eventName: newLead.eventName,
      eventCode: newLead.eventCode,
      startedAt: newLead.registrationDate,
      lastActivityAt: new Date().toLocaleString(),
      status: 'Registered',
      progress: 25,
      completedSections: { personalDetails: true, academicHistory: false, financialEligibility: false, familyBackground: false, statementOfPurpose: false, documentUploads: false },
      documentsStatus: { incomeCertificate: 'Not Uploaded', marksheet12th: 'Not Uploaded', collegeIdProof: 'Not Uploaded', aadhaarCard: 'Not Uploaded' }
    };
    setApplications(prev => [newApp, ...prev]);

    setLiveToast({ show: true, message: `New Lead: ${newLead.name}`, subtext: `${newLead.college} • ${newLead.eventCode}` });
    setTimeout(() => setLiveToast(null), 4500);

    return newLead;
  };

  // ═══════════════════════════════════════════════════════════════
  // UPDATE LEAD STATUS → Supabase UPDATE
  // ═══════════════════════════════════════════════════════════════
  const updateLeadStatus = (leadId: string, status: ApplicationStatus) => {
    const percentage = status === 'Completed' ? 100 : status === 'In Progress' ? 75 : status === 'Started' ? 50 : 25;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l, applicationStatus: status, completionPercentage: percentage,
          timeline: [...l.timeline, {
            id: `t-${Date.now()}`, timestamp: new Date().toLocaleString(),
            title: `Status Updated to ${status}`,
            description: `Application progress adjusted to ${percentage}% by admin ${currentUser?.name || 'Reviewer'}.`,
            actor: 'Admin', statusType: status
          }]
        };
      }
      return l;
    }));

    setApplications(prev => prev.map(a => {
      if (a.leadId === leadId) {
        return { ...a, status, progress: percentage, lastActivityAt: new Date().toLocaleString() };
      }
      return a;
    }));

    if (isSupabaseConfigured()) {
      const dbStatus = status === 'Completed' ? 'Completed' : status === 'Started' || status === 'In Progress' ? 'Started' : 'Registered';
      supabase.from('leads').update({ status: dbStatus, updated_at: new Date().toISOString() }).eq('id', leadId);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ADD LEAD NOTE → Supabase UPDATE (JSONB notes column)
  // ═══════════════════════════════════════════════════════════════
  const addLeadNote = (leadId: string, note: string) => {
    if (!note.trim()) return;
    const formattedNote = `${note.trim()} (by ${currentUser?.name || 'Admin'} on ${new Date().toLocaleDateString()})`;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const updatedNotes = [...(l.notes || []), formattedNote];
        // Persist to Supabase
        if (isSupabaseConfigured()) {
          supabase.from('leads').update({ notes: updatedNotes, updated_at: new Date().toISOString() }).eq('id', leadId);
        }
        return {
          ...l, notes: updatedNotes,
          timeline: [...l.timeline, {
            id: `t-${Date.now()}`, timestamp: new Date().toLocaleString(),
            title: 'Admin Note Added', description: note.trim(),
            actor: 'Admin', statusType: 'Note' as any
          }]
        };
      }
      return l;
    }));
  };

  // ═══════════════════════════════════════════════════════════════
  // EXPORT JOBS (local-only, generates downloadable data)
  // ═══════════════════════════════════════════════════════════════
  const createExportJob = (jobData: { eventName: string; dateRange: string; format: 'CSV' | 'XLSX'; selectedFields: string[]; filterStatus?: string }) => {
    const count = leads.filter(l => jobData.filterStatus ? l.applicationStatus === jobData.filterStatus : true).length;
    const cleanEventSlug = jobData.eventName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const fileName = `Katalyst_${cleanEventSlug}_${dateStamp}.${jobData.format.toLowerCase()}`;

    const newJob: ExportJob = {
      id: `exp-${Date.now()}`, fileName, eventName: jobData.eventName, dateRange: jobData.dateRange,
      recordCount: count, format: jobData.format, status: 'Ready',
      generatedAt: new Date().toLocaleString(), generatedBy: currentUser?.name || 'Admin',
      downloadUrl: '#', selectedFields: jobData.selectedFields
    };

    setExportsList(prev => [newJob, ...prev]);

    setNotifications(prev => [{
      id: `notif-${Date.now()}`, type: 'export_ready',
      title: `Export Ready: ${fileName}`,
      message: `Successfully prepared ${count} records for ${jobData.eventName}.`,
      timestamp: new Date().toLocaleString(), read: false, metadata: { exportId: newJob.id }
    }, ...prev]);
  };

  const syncGoogleSheets = async () => {
    setGoogleSheetsConfig(prev => ({ ...prev, syncStatus: 'Syncing' }));
    await new Promise(res => setTimeout(res, 1800));
    setGoogleSheetsConfig(prev => ({
      ...prev, syncStatus: 'Healthy',
      lastSyncedAt: new Date().toLocaleString(),
      recordsSynced: leads.length
    }));
  };

  const updateSheetsConfig = (newConfig: Partial<GoogleSheetsSyncConfig>) => {
    setGoogleSheetsConfig(prev => ({ ...prev, ...newConfig }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (isSupabaseConfigured()) {
      supabase.from('notifications').update({ read: true }).eq('id', id);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (isSupabaseConfigured()) {
      supabase.from('notifications').update({ read: true }).eq('read', false);
    }
  };

  const resetSessionTimer = () => { setIsSessionWarningOpen(false); };

  const updateApplicationStage = (appId: string, stage: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId || app.leadId === appId || app.applicationId === appId) {
        return { ...app, stage: stage as ApplicationStage };
      }
      return app;
    }));

    if (isSupabaseConfigured()) {
      const dbStatus = (stage === 'Shortlisted' || stage === 'Accepted') ? 'Accepted' :
        stage === 'Under Review' ? 'Under Review' :
        stage === 'Rejected' ? 'Rejected' : 'Draft';

      supabase.from('applications').update({ status: dbStatus, updated_at: new Date().toISOString() }).or(`id.eq.${appId},lead_id.eq.${appId}`);
    }
  };

  const addTeamMember = (member: { name: string; email: string; role: AdminRole; avatarUrl?: string; city?: string }) => {
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`, name: member.name, email: member.email, role: member.role,
      avatar: member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: member.city ? `${member.city} Outreach Operations` : 'Regional Operations',
      lastActive: 'Just now', status: 'Active'
    };
    setAdminUsers(prev => [newUser, ...prev]);

    if (isSupabaseConfigured()) {
      supabase.from('admin_profiles').insert({
        email: member.email, full_name: member.name,
        role: member.role, department: newUser.department
      });
    }
  };

  const exportJobs = useMemo(() => {
    return exportsList.map(exp => ({
      id: exp.id, fileName: exp.fileName, eventName: exp.eventName,
      format: exp.format, recordsCount: exp.recordCount,
      generatedBy: exp.generatedBy, dateGenerated: exp.generatedAt
    }));
  }, [exportsList]);

  const googleSheetsSync = useMemo(() => ({
    connected: googleSheetsConfig.isConnected,
    sheetName: googleSheetsConfig.spreadsheetName,
    spreadsheetUrl: googleSheetsConfig.spreadsheetUrl,
    syncFrequency: googleSheetsConfig.autoSyncInterval,
    lastSynced: googleSheetsConfig.lastSyncedAt,
    fieldMapping: [
      { leadField: 'Tracking ID (STU-XXXX)', sheetColumn: 'Column A', dataType: 'String (Unique)' },
      { leadField: 'Student Full Name', sheetColumn: 'Column B', dataType: 'String' },
      { leadField: 'Email Address', sheetColumn: 'Column C', dataType: 'Email' },
      { leadField: 'Phone Number', sheetColumn: 'Column D', dataType: 'Phone Number' },
      { leadField: 'College / Institute', sheetColumn: 'Column E', dataType: 'String' },
      { leadField: 'Engineering Branch', sheetColumn: 'Column F', dataType: 'String' },
      { leadField: 'Year of Study', sheetColumn: 'Column G', dataType: 'Enum (1st/2nd/3rd)' },
      { leadField: 'Outreach Event ID', sheetColumn: 'Column H', dataType: 'String (Foreign Key)' },
      { leadField: 'Application Status', sheetColumn: 'Column I', dataType: 'Status Enum' },
      { leadField: 'Registration Timestamp', sheetColumn: 'Column J', dataType: 'ISO 8601 Timestamp' },
      { leadField: 'Consent Confirmed', sheetColumn: 'Column K', dataType: 'Boolean' },
    ],
    syncHistory: []
  }), [googleSheetsConfig]);

  return (
    <AdminContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loginLoading,
        loginError,
        login,
        logout,
        switchAdminRole,
        adminUsers,
        teamMembers: adminUsers,
        addAdminUser,
        addTeamMember,
        toggleUserStatus,
        activePage,
        setActivePage,
        selectedEventId,
        setSelectedEventId,
        selectedLeadId,
        setSelectedLeadId,
        selectedAppId,
        setSelectedAppId,
        navigateWithEvent,
        events,
        leads,
        applications,
        notifications,
        exports: exportsList,
        exportJobs,
        googleSheetsConfig,
        googleSheetsSync,
        createEvent,
        updateEventStatus,
        addLead,
        updateLeadStatus,
        updateApplicationStage,
        addLeadNote,
        createExportJob,
        syncGoogleSheets,
        updateSheetsConfig,
        markNotificationRead,
        markAllNotificationsRead,
        dateRange,
        setDateRange,
        globalSearch,
        setGlobalSearch,
        maskPII,
        setMaskPII,
        language,
        setLanguage,
        t,
        isCreateEventModalOpen,
        setIsCreateEventModalOpen,
        createdEventSuccess,
        setCreatedEventSuccess,
        isQrModalOpen,
        setIsQrModalOpen,
        activeQrEvent,
        setActiveQrEvent,
        liveToast,
        setLiveToast,
        isSessionWarningOpen,
        setIsSessionWarningOpen,
        resetSessionTimer,
        simulatedError,
        setSimulatedError,
        isSimulatedLoading,
        setIsSimulatedLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext };
export { useAdmin } from './useAdmin';
