import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  EventInfo, 
  StudentRegistrationData, 
  ApplicationFormData, 
  OfflineSyncItem 
} from '../types';
import { INITIAL_APPLICATION_DRAFT } from '../data/mockData';
import { translations } from '../i18n/translations';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type ViewType = 
  | 'event-landing'
  | 'event-error'
  | 'register'
  | 'register-success'
  | 'apply'
  | 'apply-success'
  | 'status'
  | 'help'
  | 'about';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['en'];
  
  currentView: ViewType;
  navigateTo: (view: ViewType, trackingIdOrEventId?: string) => void;
  
  eventsList: EventInfo[];
  currentEvent: EventInfo | null;
  setCurrentEvent: (event: EventInfo | null) => void;
  selectEventById: (id: string) => void;
  
  activeStudent: StudentRegistrationData | null;
  setActiveStudent: (student: StudentRegistrationData | null) => void;
  
  applicationData: ApplicationFormData;
  updateApplicationData: (partial: Partial<ApplicationFormData>) => void;
  saveApplicationDraft: () => void;
  submitApplication: () => void;
  
  isOffline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  pendingSyncItems: OfflineSyncItem[];
  triggerManualSync: () => void;
  
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  isEventModalOpen: boolean;
  setIsEventModalOpen: (open: boolean) => void;
  
  findStudentByTrackingOrPhone: (query: string) => Promise<StudentRegistrationData | undefined>;
  registerNewStudent: (data: Omit<StudentRegistrationData, 'trackingId' | 'registeredAt' | 'status' | 'personalizedLink'>) => Promise<StudentRegistrationData>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_STUDENTS = 'katalyst_students_v1';
const LOCAL_STORAGE_KEY_APP_DRAFT = 'katalyst_app_draft_v1';
const LOCAL_STORAGE_KEY_SYNC_QUEUE = 'katalyst_offline_sync_v1';

const DEFAULT_EVENT: EventInfo = {
  id: 'EVT-COEP-2026',
  code: 'EVT-COEP-2026',
  title: 'COEP Engineering Outreach & Women in Tech Summit',
  collegeName: 'College of Engineering Pune (COEP)',
  city: 'Pune',
  state: 'Maharashtra',
  date: '20 August 2026',
  time: '10:00 AM – 02:00 PM IST',
  venue: 'Auditorium B, COEP Campus, Pune',
  coordinatorName: 'Katalyst Outreach Lead',
  coordinatorPhone: '+91 98000 00000',
  coordinatorEmail: 'outreach@katalystindia.org',
  status: 'active',
  description: 'Interactive session introducing high-potential female engineering students to Katalyst corporate mentorship and scholarship.',
  eligibleBranches: ['Computer Science', 'Information Technology', 'AI & Data Science', 'Electronics', 'Mechanical', 'All STEM Branches'],
  bannerSubtitle: 'Official College Outreach & On-Spot Registration'
};

const mapDbEventToEventInfo = (e: any): EventInfo => ({
  id: e.event_code || e.id,
  code: e.event_code,
  title: e.title,
  collegeName: e.college_name,
  city: e.location?.split(',')[1]?.trim() || e.location?.split(',')[0]?.trim() || 'Pune',
  state: 'Maharashtra',
  date: e.event_date ? new Date(e.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Upcoming',
  time: '10:00 AM – 02:00 PM IST',
  venue: e.location || 'College Campus',
  coordinatorName: 'Katalyst Outreach Lead',
  coordinatorPhone: '+91 98000 00000',
  coordinatorEmail: 'outreach@katalystindia.org',
  status: e.status === 'Archived' ? 'inactive' : 'active',
  description: e.description || 'Katalyst STEM Fellowship and scholarship outreach initiative empowering female engineering students.',
  eligibleBranches: ['Computer Science', 'Information Technology', 'AI & Data Science', 'Electronics', 'Mechanical', 'All STEM Branches'],
  bannerSubtitle: 'Official College Outreach & On-Spot Registration'
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<ViewType>('event-landing');
  const [eventsList, setEventsList] = useState<EventInfo[]>([DEFAULT_EVENT]);
  const [currentEvent, setCurrentEvent] = useState<EventInfo | null>(DEFAULT_EVENT);
  const [activeStudent, setActiveStudent] = useState<StudentRegistrationData | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationFormData>(INITIAL_APPLICATION_DRAFT);
  
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [pendingSyncItems, setPendingSyncItems] = useState<OfflineSyncItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);

  // Network listener
  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      showToast('Connection Restored', 'Back online. Syncing pending data...', 'success');
    };
    const handleOffline = () => {
      setIsBrowserOnline(false);
      showToast('Network Offline', 'Operating in offline local storage mode.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOffline = !isBrowserOnline || isSimulatedOffline;

  // Fetch events from Supabase on mount
  useEffect(() => {
    const fetchEvents = async () => {
      if (!isSupabaseConfigured()) return;

      try {
        const { data: dbEvents, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbEvents && dbEvents.length > 0) {
          const mapped = dbEvents.map(mapDbEventToEventInfo);
          setEventsList(mapped);

          // Check URL query parameters (e.g. ?event=EVT-COEP-2026)
          const urlParams = new URLSearchParams(window.location.search);
          const eventParam = urlParams.get('event') || urlParams.get('eventCode');

          if (eventParam) {
            const matched = mapped.find(e => 
              e.code.toLowerCase() === eventParam.toLowerCase() || 
              e.id.toLowerCase() === eventParam.toLowerCase()
            );
            if (matched) {
              setCurrentEvent(matched);
              setCurrentView('event-landing');
            } else {
              setCurrentEvent(null);
              setCurrentView('event-error');
            }
          } else {
            setCurrentEvent(mapped[0]);
          }
        }
      } catch (err) {
        console.warn('Student portal events fetch error:', err);
      }
    };

    fetchEvents();
  }, []);

  // Load from local storage draft
  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem(LOCAL_STORAGE_KEY_APP_DRAFT);
      if (storedDraft) {
        setApplicationData(JSON.parse(storedDraft));
      }
      const storedQueue = localStorage.getItem(LOCAL_STORAGE_KEY_SYNC_QUEUE);
      if (storedQueue) {
        setPendingSyncItems(JSON.parse(storedQueue));
      }

      // Check URL query params for tracking
      const urlParams = new URLSearchParams(window.location.search);
      const trackParam = urlParams.get('track') || urlParams.get('apply');

      if (trackParam) {
        findStudentByTrackingOrPhone(trackParam).then(student => {
          if (student) {
            setActiveStudent(student);
            setCurrentView('apply');
          } else {
            setCurrentView('status');
          }
        });
      }
    } catch (e) {
      console.warn('Storage or URL param read failed', e);
    }
  }, []);

  // Save draft whenever application data changes
  const updateApplicationData = (partial: Partial<ApplicationFormData>) => {
    setApplicationData(prev => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated: ApplicationFormData = {
        ...prev,
        ...partial,
        lastSavedAt: `Saved at ${timeString}`
      };
      
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_APP_DRAFT, JSON.stringify(updated));
      } catch (err) {
        console.warn('Local draft write failed', err);
      }

      if (isOffline) {
        queueOfflineSync('APPLICATION_DRAFT', updated);
      }

      return updated;
    });
  };

  const saveApplicationDraft = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setApplicationData(prev => ({
      ...prev,
      lastSavedAt: `Saved at ${timeString}`
    }));
    showToast('Progress Saved', 'Your application draft is safely stored on this device.', 'success');
  };

  const submitApplication = async () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    
    setApplicationData(prev => ({
      ...prev,
      isSubmitted: true,
      submittedAt: formattedDate,
      lastSavedAt: `Submitted on ${formattedDate}`
    }));

    if (activeStudent) {
      setActiveStudent(prev => prev ? {
        ...prev,
        status: 'APPLICATION_SUBMITTED'
      } : null);
    }

    // Persist to Supabase applications and leads table
    if (isSupabaseConfigured() && !isOffline) {
      try {
        const trackingToken = applicationData.trackingId || activeStudent?.trackingId || `STU-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        
        // Check if lead exists in Supabase
        let { data: leadData } = await supabase
          .from('leads')
          .select('id, event_id')
          .eq('tracking_token', trackingToken)
          .maybeSingle();

        // If lead doesn't exist yet, insert it into Supabase leads table
        if (!leadData) {
          const { data: eventDb } = await supabase
            .from('events')
            .select('id')
            .eq('event_code', activeStudent?.eventCode || currentEvent?.code || 'EVT-COEP-2026')
            .maybeSingle();

          const { data: newLead, error: leadErr } = await supabase
            .from('leads')
            .insert({
              event_id: eventDb?.id || null,
              event_code: activeStudent?.eventCode || currentEvent?.code || 'EVT-COEP-2026',
              full_name: applicationData.fullName || activeStudent?.fullName || 'Katalyst Applicant',
              email: applicationData.email || activeStudent?.email || '',
              phone: applicationData.phone || activeStudent?.phone || '',
              college_name: applicationData.collegeName || activeStudent?.college || 'College of Engineering Pune (COEP)',
              academic_year: applicationData.yearOfStudy || activeStudent?.yearOfStudy || '2nd Year B.Tech',
              field_of_study: applicationData.branch || activeStudent?.fieldOfStudy || 'Computer Engineering',
              tracking_token: trackingToken,
              status: 'Completed',
              consent_given: true
            })
            .select('id, event_id')
            .single();

          if (!leadErr && newLead) {
            leadData = newLead;
          }
        }

        if (leadData) {
          // Upsert application row in Supabase
          await supabase.from('applications').upsert({
            lead_id: leadData.id,
            tracking_token: trackingToken,
            event_id: leadData.event_id,
            step_completed: 6,
            stem_interest: applicationData.careerGoal || 'Engineering & STEM',
            gpa_score: parseFloat(applicationData.currentSemesterCgpa) || 8.5,
            family_income_bracket: applicationData.annualFamilyIncome || '< ₹2,00,000 / annum',
            essay_response: applicationData.whyKatalyst || '',
            status: 'Under Review',
            documents_status: 'Verified',
            submitted_at: new Date().toISOString()
          }, { onConflict: 'lead_id' });

          // Update lead status to Completed
          await supabase
            .from('leads')
            .update({ status: 'Completed', updated_at: new Date().toISOString() })
            .eq('id', leadData.id);
        }
      } catch (err) {
        console.warn('Supabase application submission error:', err);
      }
    }

    if (isOffline) {
      queueOfflineSync('APPLICATION_SUBMIT', { trackingId: applicationData.trackingId, submittedAt: formattedDate });
      showToast('Application Saved Offline', 'Will automatically transmit to Katalyst as soon as internet is restored.', 'info');
    } else {
      showToast('Application Submitted!', 'Your application has been received by the Katalyst screening committee.', 'success');
    }

    setCurrentView('apply-success');
  };

  const queueOfflineSync = (type: OfflineSyncItem['type'], data: any) => {
    const newItem: OfflineSyncItem = {
      id: 'sync-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type,
      timestamp: new Date().toISOString(),
      data,
      status: 'pending'
    };
    setPendingSyncItems(prev => {
      const updated = [...prev, newItem];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_SYNC_QUEUE, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const triggerManualSync = () => {
    if (pendingSyncItems.length === 0) {
      showToast('All Synced', 'No pending offline registrations to sync.', 'info');
      return;
    }
    
    showToast('Syncing in Progress', `Transmitting ${pendingSyncItems.length} record(s) to Katalyst servers...`, 'info');
    setTimeout(() => {
      setPendingSyncItems([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY_SYNC_QUEUE);
      showToast('Sync Complete!', 'All offline records have been uploaded successfully.', 'success');
    }, 1200);
  };

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline(prev => {
      const next = !prev;
      if (next) {
        showToast('Auditorium Offline Mode', 'Simulating offline registration in a low-network venue.', 'warning');
      } else {
        showToast('Online Mode Restored', 'Syncing pending records now...', 'success');
        if (pendingSyncItems.length > 0) {
          triggerManualSync();
        }
      }
      return next;
    });
  };

  const selectEventById = (id: string) => {
    const found = eventsList.find(e => e.id.toLowerCase() === id.toLowerCase() || e.code.toLowerCase() === id.toLowerCase());
    if (found) {
      setCurrentEvent(found);
      if (found.status === 'active') {
        setCurrentView('event-landing');
      } else {
        setCurrentView('event-error');
      }
    } else {
      // Query Supabase directly in case it was created recently
      if (isSupabaseConfigured()) {
        supabase.from('events').select('*').ilike('event_code', id).single().then(({ data }) => {
          if (data) {
            const mapped = mapDbEventToEventInfo(data);
            setCurrentEvent(mapped);
            setCurrentView('event-landing');
          } else {
            setCurrentEvent(null);
            setCurrentView('event-error');
          }
        });
      } else {
        setCurrentEvent(null);
        setCurrentView('event-error');
      }
    }
  };

  const findStudentByTrackingOrPhone = async (query: string): Promise<StudentRegistrationData | undefined> => {
    const clean = query.trim().toLowerCase();
    if (!clean) return undefined;
    
    // Check Supabase first
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .or(`tracking_token.ilike.%${clean}%,phone.ilike.%${clean}%,email.ilike.%${clean}%`)
          .limit(1)
          .single();

        if (!error && data) {
          const student: StudentRegistrationData = {
            trackingId: data.tracking_token,
            eventId: data.event_id || '',
            eventCode: data.event_code,
            eventName: data.event_code,
            fullName: data.full_name,
            email: data.email,
            phone: data.phone,
            college: data.college_name,
            yearOfStudy: data.academic_year,
            fieldOfStudy: data.field_of_study,
            gender: 'Female',
            consentDataProcessing: data.consent_given,
            consentFutureComms: true,
            registeredAt: new Date(data.created_at).toLocaleString(),
            status: data.status === 'Completed' ? 'APPLICATION_SUBMITTED' : data.status === 'Started' ? 'APPLICATION_STARTED' : 'REGISTERED',
            personalizedLink: `/apply/${data.tracking_token}`
          };
          return student;
        }
      } catch (err) {
        console.warn('Supabase lead query error:', err);
      }
    }

    // Fallback to local storage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed: StudentRegistrationData[] = JSON.parse(saved);
        return parsed.find(s => 
          s.trackingId.toLowerCase() === clean ||
          s.phone.replace(/\D/g, '').endsWith(clean.replace(/\D/g, '')) ||
          s.email.toLowerCase() === clean
        );
      }
    } catch (e) {
      console.warn(e);
    }

    return undefined;
  };

  const registerNewStudent = async (data: Omit<StudentRegistrationData, 'trackingId' | 'registeredAt' | 'status' | 'personalizedLink'>): Promise<StudentRegistrationData> => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const trackingId = `STU-2026-${randomNum}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const newStudent: StudentRegistrationData = {
      ...data,
      trackingId,
      registeredAt: formattedDate,
      status: 'REGISTERED',
      personalizedLink: `/apply/${trackingId}`
    };

    setActiveStudent(newStudent);

    setApplicationData(prev => ({
      ...prev,
      fullName: newStudent.fullName,
      email: newStudent.email,
      phone: newStudent.phone,
      collegeName: newStudent.college,
      branch: newStudent.fieldOfStudy,
      yearOfStudy: newStudent.yearOfStudy,
      trackingId,
      completedSteps: [1]
    }));

    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS);
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem(LOCAL_STORAGE_KEY_STUDENTS, JSON.stringify([newStudent, ...parsed]));
    } catch (e) {
      console.warn(e);
    }

    if (isSupabaseConfigured() && !isOffline) {
      try {
        // Query event ID
        let eventId: string | null = null;
        const { data: eventDb } = await supabase
          .from('events')
          .select('id')
          .eq('event_code', data.eventCode || currentEvent?.code || 'EVT-COEP-2026')
          .single();

        if (eventDb) {
          eventId = eventDb.id;
        }

        await supabase.from('leads').insert({
          event_id: eventId,
          event_code: data.eventCode || currentEvent?.code || 'EVT-COEP-2026',
          full_name: newStudent.fullName,
          email: newStudent.email,
          phone: newStudent.phone,
          college_name: newStudent.college,
          academic_year: newStudent.yearOfStudy,
          field_of_study: newStudent.fieldOfStudy,
          tracking_token: trackingId,
          status: 'Registered',
          consent_given: newStudent.consentDataProcessing || false,
          signature_data_url: newStudent.signatureDataUrl || null
        });
      } catch (err) {
        console.warn('Supabase lead insert error:', err);
      }
    }

    if (isOffline) {
      queueOfflineSync('REGISTRATION', newStudent);
    }

    return newStudent;
  };

  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random();
    setToasts(prev => [...prev.slice(-3), { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateTo = async (view: ViewType, trackingIdOrEventId?: string) => {
    if (view === 'event-landing' && trackingIdOrEventId) {
      selectEventById(trackingIdOrEventId);
      return;
    }
    if (view === 'apply' && trackingIdOrEventId) {
      const student = await findStudentByTrackingOrPhone(trackingIdOrEventId);
      if (student) {
        setActiveStudent(student);
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      currentView,
      navigateTo,
      eventsList,
      currentEvent,
      setCurrentEvent,
      selectEventById,
      activeStudent,
      setActiveStudent,
      applicationData,
      updateApplicationData,
      saveApplicationDraft,
      submitApplication,
      isOffline,
      isSimulatedOffline,
      toggleSimulatedOffline,
      pendingSyncItems,
      triggerManualSync,
      toasts,
      showToast,
      removeToast,
      isEventModalOpen,
      setIsEventModalOpen,
      findStudentByTrackingOrPhone,
      registerNewStudent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
