import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  AdminUser, 
  AdminRole,
  OutreachEvent, 
  StudentLead, 
  ApplicationRecord, 
  NotificationItem, 
  ExportJob, 
  GoogleSheetsSyncConfig, 
  Language, 
  DateFilterRange,
  ApplicationStatus,
  EventStatus
} from '../types';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_EVENTS,
  INITIAL_STUDENT_LEADS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EXPORT_JOBS,
  INITIAL_GOOGLE_SHEETS_CONFIG
} from '../data/mockData';
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
  login: (email: string, role?: string) => void;
  logout: () => void;
  switchAdminRole: (userId: string) => void;
  adminUsers: AdminUser[];
  teamMembers: AdminUser[];
  addAdminUser: (user: Omit<AdminUser, 'id' | 'lastActive'>) => void;
  addTeamMember: (user: { name: string; email: string; role: AdminRole; avatarUrl?: string; city?: string }) => void;
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

  // Data & State
  events: OutreachEvent[];
  leads: StudentLead[];
  applications: ApplicationRecord[];
  notifications: NotificationItem[];
  exports: ExportJob[];
  exportJobs: { id: string; fileName: string; eventName: string; format: string; recordsCount: number; generatedBy: string; dateGenerated: string }[];
  googleSheetsConfig: GoogleSheetsSyncConfig;
  googleSheetsSync: {
    connected: boolean;
    sheetName: string;
    spreadsheetUrl: string;
    syncFrequency: string;
    lastSynced: string;
    fieldMapping: { leadField: string; sheetColumn: string; dataType: string }[];
    syncHistory: { id: string; timestamp: string; recordsPushed: number; status: string; triggeredBy: string }[];
  };

  // Actions
  createEvent: (newEventData: Partial<OutreachEvent>) => OutreachEvent;
  updateEventStatus: (eventId: string, status: EventStatus) => void;
  addLead: (leadData: Partial<StudentLead>) => StudentLead;
  updateLeadStatus: (leadId: string, status: ApplicationStatus) => void;
  updateApplicationStage: (appId: string, stage: string) => void;
  addLeadNote: (leadId: string, note: string) => void;
  createExportJob: (jobData: { eventName: string; dateRange: string; format: 'CSV' | 'XLSX' | 'PDF'; selectedFields: string[]; filterStatus?: string }) => void;
  syncGoogleSheets: () => Promise<void>;
  updateSheetsConfig: (newConfig: Partial<GoogleSheetsSyncConfig>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Global Controls
  dateRange: DateFilterRange;
  setDateRange: (range: DateFilterRange) => void;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  maskPII: boolean;
  setMaskPII: (mask: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // UI Modals & Live simulation
  isCreateEventModalOpen: boolean;
  setIsCreateEventModalOpen: (open: boolean) => void;
  createdEventSuccess: OutreachEvent | null;
  setCreatedEventSuccess: (event: OutreachEvent | null) => void;
  isQrModalOpen: boolean;
  setIsQrModalOpen: (open: boolean) => void;
  activeQrEvent: OutreachEvent | null;
  setActiveQrEvent: (event: OutreachEvent | null) => void;
  
  // Real-time notification toast
  liveToast: { show: boolean; message: string; subtext?: string } | null;
  setLiveToast: (toast: { show: boolean; message: string; subtext?: string } | null) => void;
  
  // Session timeout simulation
  isSessionWarningOpen: boolean;
  setIsSessionWarningOpen: (open: boolean) => void;
  resetSessionTimer: () => void;

  // Testing & Error State Viewers
  simulatedError: string | null;
  setSimulatedError: (err: string | null) => void;
  isSimulatedLoading: boolean;
  setIsSimulatedLoading: (loading: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(INITIAL_ADMIN_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);

  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const [events, setEvents] = useState<OutreachEvent[]>(INITIAL_EVENTS);
  const [leads, setLeads] = useState<StudentLead[]>(INITIAL_STUDENT_LEADS);
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [exports, setExports] = useState<ExportJob[]>(INITIAL_EXPORT_JOBS);
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState<GoogleSheetsSyncConfig>(INITIAL_GOOGLE_SHEETS_CONFIG);

  const [dateRange, setDateRange] = useState<DateFilterRange>({
    label: 'Last 30 Days',
    value: '30days'
  });
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [maskPII, setMaskPII] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');

  // Modals & Triggers
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState<boolean>(false);
  const [createdEventSuccess, setCreatedEventSuccess] = useState<OutreachEvent | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [activeQrEvent, setActiveQrEvent] = useState<OutreachEvent | null>(null);
  const [liveToast, setLiveToast] = useState<{ show: boolean; message: string; subtext?: string } | null>(null);
  const [isSessionWarningOpen, setIsSessionWarningOpen] = useState<boolean>(false);

  // States
  const [simulatedError, setSimulatedError] = useState<string | null>(null);
  const [isSimulatedLoading, setIsSimulatedLoading] = useState<boolean>(false);

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Live Supabase Integration & Realtime Subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchSupabaseData = async () => {
      try {
        // Fetch events
        const { data: dbEvents, error: eventsError } = await supabase.from('events').select('*').order('created_at', { ascending: false });
        if (!eventsError && dbEvents && dbEvents.length > 0) {
          setEvents(dbEvents.map(e => ({
            id: e.id,
            eventCode: e.event_code,
            name: e.title,
            collegeName: e.college_name,
            collegeTier: 'Tier 1',
            location: e.location,
            city: e.location.split(',')[1]?.trim() || 'Pune',
            state: 'Maharashtra',
            date: new Date(e.event_date).toISOString().split('T')[0],
            startTime: '10:00 AM',
            endTime: '04:00 PM',
            venue: e.location,
            eventType: 'Engineering Outreach',
            description: e.description || '',
            contactPerson: { name: 'Faculty Lead', role: 'Coordinator', email: 'coordinator@college.ac.in', phone: '+91 9800000000' },
            status: e.status === 'Completed' ? 'completed' : e.status === 'Ongoing' ? 'ongoing' : 'active',
            funnel: {
              registered: e.registered_count || 0,
              started: e.started_count || 0,
              completed: e.completed_count || 0
            },
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://katalyst.org/register/${e.event_code}`,
            registrationUrl: `https://katalyst.org/register/${e.event_code}`
          })));
        }

        // Fetch leads
        const { data: dbLeads, error: leadsError } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (!leadsError && dbLeads && dbLeads.length > 0) {
          setLeads(dbLeads.map(l => ({
            id: l.id,
            trackingId: l.tracking_token,
            name: l.full_name,
            email: l.email,
            phone: l.phone,
            college: l.college_name,
            city: 'Pune',
            state: 'Maharashtra',
            yearOfStudy: l.academic_year as any || '2nd Year',
            fieldOfStudy: l.field_of_study,
            currentGpaOrPercentage: '8.5 CGPA',
            annualFamilyIncome: '< ₹2,00,000 / annum',
            eventId: l.event_id || 'evt-1',
            eventName: l.event_code,
            eventCode: l.event_code,
            registrationDate: new Date(l.created_at).toISOString().split('T')[0],
            registrationTimestamp: new Date(l.created_at).toLocaleString(),
            applicationStatus: (l.status as ApplicationStatus) || 'Registered',
            completionPercentage: l.status === 'Completed' ? 100 : l.status === 'Started' ? 50 : 25,
            consent: {
              termsAccepted: l.consent_given || false,
              whatsappUpdates: true,
              futureCommunications: true,
              timestamp: new Date(l.created_at).toLocaleString()
            },
            timeline: [
              {
                id: `tl-${Date.now()}`,
                timestamp: new Date(l.created_at).toLocaleString(),
                title: 'Interest Registered',
                description: `Registered at event ${l.event_code}`,
                actor: 'Student',
                statusType: 'Registered'
              }
            ]
          })));
        }
      } catch (err) {
        console.warn('Supabase fetch error, maintaining local state:', err);
      }
    };

    fetchSupabaseData();

    // Supabase Realtime channel subscription for leads table
    let leadsChannel: any = null;
    try {
      leadsChannel = supabase
        .channel('realtime-leads-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'leads' },
          (payload) => {
            try {
              const newLead = payload.new;
              setLiveToast({
                show: true,
                message: '⚡ Live Student Registration!',
                subtext: `${newLead.full_name} registered for ${newLead.event_code}`
              });
              const formattedLead: StudentLead = {
                id: newLead.id,
                trackingId: newLead.tracking_token,
                name: newLead.full_name,
                email: newLead.email,
                phone: newLead.phone,
                college: newLead.college_name,
                city: 'Pune',
                state: 'Maharashtra',
                yearOfStudy: newLead.academic_year as any || '2nd Year',
                fieldOfStudy: newLead.field_of_study,
                currentGpaOrPercentage: '8.5 CGPA',
                annualFamilyIncome: '< ₹2,00,000 / annum',
                eventId: newLead.event_id || 'evt-1',
                eventName: newLead.event_code,
                eventCode: newLead.event_code,
                registrationDate: new Date(newLead.created_at).toISOString().split('T')[0],
                registrationTimestamp: new Date(newLead.created_at).toLocaleString(),
                applicationStatus: (newLead.status as ApplicationStatus) || 'Registered',
                completionPercentage: 25,
                consent: {
                  termsAccepted: newLead.consent_given || false,
                  whatsappUpdates: true,
                  futureCommunications: true,
                  timestamp: new Date(newLead.created_at).toLocaleString()
                },
                timeline: [
                  {
                    id: `tl-${Date.now()}`,
                    timestamp: new Date(newLead.created_at).toLocaleString(),
                    title: 'Interest Registered',
                    description: `Registered at event ${newLead.event_code}`,
                    actor: 'Student',
                    statusType: 'Registered'
                  }
                ]
              };
              setLeads(prev => [formattedLead, ...prev]);
            } catch (e) {
              console.warn('Realtime payload handling error:', e);
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Supabase realtime channel creation warning:', err);
    }

    return () => {
      if (leadsChannel) {
        try { supabase.removeChannel(leadsChannel); } catch (e) {}
      }
    };
  }, []);

  const login = async (email: string, roleName?: string) => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signInWithPassword({
          email,
          password: 'KatalystAdmin2026!'
        });
      } catch (e) {
        console.warn('Supabase auth fallback:', e);
      }
    }
    const found = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: (roleName as any) || 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      department: 'Outreach & Operations',
      lastActive: 'Just now',
      status: 'Active'
    };
    setCurrentUser(found);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const switchAdminRole = (userId: string) => {
    const user = adminUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const addAdminUser = (userData: Omit<AdminUser, 'id' | 'lastActive'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      lastActive: 'Just invited'
    };
    setAdminUsers(prev => [newUser, ...prev]);
  };

  const toggleUserStatus = (userId: string) => {
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const navigateWithEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setActivePage('event-detail');
  };

  const createEvent = (newEventData: Partial<OutreachEvent>): OutreachEvent => {
    // Generate clean short code
    const collegeAcronym = (newEventData.collegeName || 'CAMPUS')
      .split(' ')
      .map(w => w[0])
      .slice(0, 4)
      .join('')
      .toUpperCase();
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
        name: 'Faculty Coordinator',
        role: 'T&P Officer',
        phone: '+91 98000 00000',
        email: 'coordinator@college.edu',
      },
      registrationUrl,
      status: 'Active',
      metrics: {
        registered: 0,
        started: 0,
        completed: 0,
        conversionRate: 0,
        targetRegistrations: newEventData.metrics?.targetRegistrations || 300,
      },
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
      }).then(({ error }) => {
        if (error) console.warn('Supabase event insert error:', error);
      });
    }

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'system',
        title: `New Outreach Event Created: ${newEvent.name}`,
        message: `Generated Event ID ${newEvent.eventCode} with active registration link and QR code.`,
        timestamp: 'Just now',
        read: false,
        metadata: { eventId: newEvent.id }
      },
      ...prev
    ]);

    return newEvent;
  };

  const updateEventStatus = (eventId: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status } : e));
  };

  const addLead = (leadData: Partial<StudentLead>): StudentLead => {
    const leadCount = leads.length + 1;
    const trackingId = `STU-2026-${String(leadCount + 183).padStart(6, '0')}`;
    const newLead: StudentLead = {
      id: `lead-${Date.now()}`,
      trackingId,
      name: leadData.name || 'New Applicant',
      email: leadData.email || 'applicant@college.edu',
      phone: leadData.phone || '+91 98000 00000',
      college: leadData.college || 'Engineering Institute',
      city: leadData.city || 'Pune',
      state: leadData.state || 'Maharashtra',
      yearOfStudy: leadData.yearOfStudy || '1st Year',
      fieldOfStudy: leadData.fieldOfStudy || 'Computer Science & Engineering',
      currentGpaOrPercentage: leadData.currentGpaOrPercentage || '8.50 CGPA',
      annualFamilyIncome: leadData.annualFamilyIncome || '₹ 1,50,000 / annum',
      eventId: leadData.eventId || events[0]?.id || 'evt-001',
      eventName: leadData.eventName || events[0]?.name || 'STEM Outreach',
      eventCode: leadData.eventCode || events[0]?.eventCode || 'EVT-GEN-2026-001',
      registrationDate: new Date().toISOString().split('T')[0],
      registrationTimestamp: 'Just now',
      applicationStatus: 'Registered',
      completionPercentage: 25,
      consent: {
        termsAccepted: true,
        whatsappUpdates: true,
        futureCommunications: true,
        timestamp: new Date().toISOString(),
      },
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: 'Just now',
          title: 'Registered at Campus Outreach',
          description: 'Scanned registration QR code and verified phone number.',
          actor: 'Student',
          statusType: 'Registered',
        }
      ],
      notes: []
    };

    setLeads(prev => [newLead, ...prev]);

    // Also create application record
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
      lastActivityAt: 'Just now',
      status: 'Registered',
      progress: 25,
      completedSections: {
        personalDetails: true,
        academicHistory: false,
        financialEligibility: false,
        familyBackground: false,
        statementOfPurpose: false,
        documentUploads: false,
      },
      documentsStatus: {
        incomeCertificate: 'Not Uploaded',
        marksheet12th: 'Not Uploaded',
        collegeIdProof: 'Not Uploaded',
        aadhaarCard: 'Not Uploaded',
      }
    };
    setApplications(prev => [newApp, ...prev]);

    // Trigger subtle live toast
    setLiveToast({
      show: true,
      message: `New Lead Received: ${newLead.name}`,
      subtext: `${newLead.college} • ${newLead.eventCode}`
    });
    setTimeout(() => {
      setLiveToast(null);
    }, 4500);

    return newLead;
  };

  const updateLeadStatus = (leadId: string, status: ApplicationStatus) => {
    const percentage = status === 'Completed' ? 100 : status === 'In Progress' ? 75 : status === 'Started' ? 50 : 25;
    
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          applicationStatus: status,
          completionPercentage: percentage,
          timeline: [
            ...l.timeline,
            {
              id: `t-${Date.now()}`,
              timestamp: 'Just now',
              title: `Status Updated to ${status}`,
              description: `Application progress adjusted to ${percentage}% by admin ${currentUser?.name || 'Reviewer'}.`,
              actor: 'Admin',
              statusType: status
            }
          ]
        };
      }
      return l;
    }));

    setApplications(prev => prev.map(a => {
      if (a.leadId === leadId) {
        return {
          ...a,
          status,
          progress: percentage,
          lastActivityAt: 'Just now'
        };
      }
      return a;
    }));
  };

  const addLeadNote = (leadId: string, note: string) => {
    if (!note.trim()) return;
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          notes: [...(l.notes || []), `${note.trim()} (by ${currentUser?.name || 'Admin'} on ${new Date().toLocaleDateString()})`],
          timeline: [
            ...l.timeline,
            {
              id: `t-${Date.now()}`,
              timestamp: 'Just now',
              title: 'Admin Note Added',
              description: note.trim(),
              actor: 'Admin',
              statusType: 'Note'
            }
          ]
        };
      }
      return l;
    }));
  };

  const createExportJob = (jobData: { eventName: string; dateRange: string; format: 'CSV' | 'XLSX'; selectedFields: string[]; filterStatus?: string }) => {
    const count = leads.filter(l => jobData.filterStatus ? l.applicationStatus === jobData.filterStatus : true).length;
    const cleanEventSlug = jobData.eventName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const fileName = `Katalyst_${cleanEventSlug}_${dateStamp}.${jobData.format.toLowerCase()}`;

    const newJob: ExportJob = {
      id: `exp-${Date.now()}`,
      fileName,
      eventName: jobData.eventName,
      dateRange: jobData.dateRange,
      recordCount: count,
      format: jobData.format,
      status: 'Ready',
      generatedAt: 'Just now',
      generatedBy: currentUser?.name || 'Sunita Rao',
      downloadUrl: '#',
      selectedFields: jobData.selectedFields
    };

    setExports(prev => [newJob, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'export_ready',
        title: `Export Ready: ${fileName}`,
        message: `Successfully prepared ${count} records for ${jobData.eventName}. Click to download.`,
        timestamp: 'Just now',
        read: false,
        metadata: { exportId: newJob.id }
      },
      ...prev
    ]);
  };

  const syncGoogleSheets = async () => {
    setGoogleSheetsConfig(prev => ({ ...prev, syncStatus: 'Syncing' }));
    await new Promise(res => setTimeout(res, 1800));
    setGoogleSheetsConfig(prev => ({
      ...prev,
      syncStatus: 'Healthy',
      lastSyncedAt: 'Just now (Live)',
      recordsSynced: 4280 + leads.length - INITIAL_STUDENT_LEADS.length
    }));
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'sync_status',
        title: 'Google Sheets Synchronized',
        message: `Successfully synced ${4280 + leads.length - INITIAL_STUDENT_LEADS.length} lead rows to Katalyst Master Sheet.`,
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const updateSheetsConfig = (newConfig: Partial<GoogleSheetsSyncConfig>) => {
    setGoogleSheetsConfig(prev => ({ ...prev, ...newConfig }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetSessionTimer = () => {
    setIsSessionWarningOpen(false);
  };

  // Real-time simulated lead intake (every 60s adds a subtle real-time event lead)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time stream
      const sampleNames = ['Rhea Fernandes', 'Anwesha Paul', 'Mansi Patil', 'Pooja Iyer', 'Swati Deshmukh', 'Krutika Mane'];
      const sampleColleges = ['MIT World Peace University', 'COEP Tech', 'VJTI Mumbai', 'PICT Pune', 'PES University'];
      const sampleBranches = ['Computer Engineering', 'Artificial Intelligence', 'Data Science', 'Electronics & Comm', 'Mechanical Engg'];
      
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomCollege = sampleColleges[Math.floor(Math.random() * sampleColleges.length)];
      const randomBranch = sampleBranches[Math.floor(Math.random() * sampleBranches.length)];

      const newSimLead = addLead({
        name: randomName,
        college: randomCollege,
        fieldOfStudy: randomBranch,
        city: randomCollege.includes('Mumbai') ? 'Mumbai' : randomCollege.includes('Bengaluru') ? 'Bengaluru' : 'Pune',
        yearOfStudy: '2nd Year',
        annualFamilyIncome: '₹ 1,25,000 / annum',
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const updateApplicationStage = (appId: string, stage: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId || app.leadId === appId) {
        return {
          ...app,
          status: stage === 'Completed' ? 'Completed' : stage === 'Under Review' || stage === 'Shortlisted' ? 'Completed' : 'In Progress'
        };
      }
      return app;
    }));
  };

  const addTeamMember = (member: { name: string; email: string; role: AdminRole; avatarUrl?: string; city?: string }) => {
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: member.name,
      email: member.email,
      role: member.role,
      avatar: member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: member.city ? `${member.city} Outreach Operations` : 'Regional Operations',
      lastActive: 'Just now',
      status: 'Active'
    };
    setAdminUsers(prev => [newUser, ...prev]);
  };

  const exportJobs = useMemo(() => {
    return exports.map(exp => ({
      id: exp.id,
      fileName: exp.fileName,
      eventName: exp.eventName,
      format: exp.format,
      recordsCount: exp.recordCount,
      generatedBy: exp.generatedBy,
      dateGenerated: exp.generatedAt
    }));
  }, [exports]);

  const googleSheetsSync = useMemo(() => {
    return {
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
      syncHistory: [
        { id: 'sync-01', timestamp: '14 Aug 2026, 11:30 AM', recordsPushed: 18, status: 'Success (200 OK)', triggeredBy: 'Auto-Trigger (New Leads)' },
        { id: 'sync-02', timestamp: '14 Aug 2026, 10:15 AM', recordsPushed: 42, status: 'Success (200 OK)', triggeredBy: 'Manual Admin Sync (Sunita Rao)' },
        { id: 'sync-03', timestamp: '13 Aug 2026, 06:00 PM', recordsPushed: 110, status: 'Success (200 OK)', triggeredBy: 'Daily Scheduled Batch' },
      ]
    };
  }, [googleSheetsConfig]);

  return (
    <AdminContext.Provider
      value={{
        currentUser,
        isAuthenticated,
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
        exports,
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
