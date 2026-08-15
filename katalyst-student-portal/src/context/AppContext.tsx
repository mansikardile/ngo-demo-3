import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  EventInfo, 
  StudentRegistrationData, 
  ApplicationFormData, 
  OfflineSyncItem 
} from '../types';
import { 
  MOCK_EVENTS, 
  MOCK_STUDENTS, 
  INITIAL_APPLICATION_DRAFT 
} from '../data/mockData';
import { translations } from '../i18n/translations';

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
  
  // Lookup helper for status and links
  findStudentByTrackingOrPhone: (query: string) => StudentRegistrationData | undefined;
  registerNewStudent: (data: Omit<StudentRegistrationData, 'trackingId' | 'registeredAt' | 'status' | 'personalizedLink'>) => StudentRegistrationData;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_STUDENTS = 'katalyst_students_v1';
const LOCAL_STORAGE_KEY_APP_DRAFT = 'katalyst_app_draft_v1';
const LOCAL_STORAGE_KEY_SYNC_QUEUE = 'katalyst_offline_sync_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<ViewType>('event-landing');
  const [currentEvent, setCurrentEvent] = useState<EventInfo | null>(MOCK_EVENTS[0]);
  const [activeStudent, setActiveStudent] = useState<StudentRegistrationData | null>(MOCK_STUDENTS[0]);
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

  // Load from local storage on mount
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
    } catch (e) {
      console.warn('Storage read failed', e);
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

  const submitApplication = () => {
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
    
    // Simulate syncing
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
    const found = MOCK_EVENTS.find(e => e.id.toLowerCase() === id.toLowerCase() || e.code.toLowerCase() === id.toLowerCase());
    if (found) {
      setCurrentEvent(found);
      if (found.status === 'active') {
        setCurrentView('event-landing');
      } else {
        setCurrentView('event-error');
      }
    } else {
      // Invalid event code
      setCurrentEvent(null);
      setCurrentView('event-error');
    }
  };

  const findStudentByTrackingOrPhone = (query: string): StudentRegistrationData | undefined => {
    const clean = query.trim().toLowerCase();
    if (!clean) return undefined;
    
    // Check in-memory mock students + custom registered ones in localStorage
    let allStudents = [...MOCK_STUDENTS];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        allStudents = [...parsed, ...allStudents];
      }
    } catch (e) {
      console.warn(e);
    }

    return allStudents.find(s => 
      s.trackingId.toLowerCase() === clean ||
      s.phone.replace(/\D/g, '').endsWith(clean.replace(/\D/g, '')) ||
      s.email.toLowerCase() === clean
    );
  };

  const registerNewStudent = (data: Omit<StudentRegistrationData, 'trackingId' | 'registeredAt' | 'status' | 'personalizedLink'>): StudentRegistrationData => {
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

    // Save student
    setActiveStudent(newStudent);

    // Initialize application data with student info
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

  const navigateTo = (view: ViewType, trackingIdOrEventId?: string) => {
    if (view === 'event-landing' && trackingIdOrEventId) {
      selectEventById(trackingIdOrEventId);
      return;
    }
    if (view === 'apply' && trackingIdOrEventId) {
      const student = findStudentByTrackingOrPhone(trackingIdOrEventId);
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
