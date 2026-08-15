export type ApplicationStatus = 'Registered' | 'Started' | 'In Progress' | 'Completed';

export type ApplicationStage = 'Draft' | 'Personal Info' | 'Academic Details' | 'Document Verification' | 'Submitted' | 'Under Review' | 'Shortlisted' | 'Rejected';

export interface StudentApplication {
  id: string;
  leadId: string;
  applicationId: string;
  trackingId: string;
  studentName: string;
  email: string;
  phone: string;
  college: string;
  fieldOfStudy: string;
  yearOfStudy: string;
  stage: ApplicationStage;
  academicScore: string;
  incomeVerificationStatus: 'Verified' | 'Pending' | 'Rejected';
  documentsUploaded: number;
  submissionDate?: string;
}

export type EventStatus = 'Active' | 'Upcoming' | 'Completed' | 'Archived';

export type EventType = 'Engineering Outreach' | 'Polytechnic STEM' | 'Women in Tech' | 'General STEM' | 'Campus Seminar';

export type AdminRole = 'Super Admin' | 'Outreach Lead' | 'Operations Officer' | 'Viewer';

export type Language = 'en' | 'hi' | 'mr';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  department: string;
  lastActive: string;
  status: 'Active' | 'Inactive';
  phone?: string;
}

export interface OutreachEvent {
  id: string;
  eventCode: string; // e.g. EVT-MIT-2026-001
  name: string;
  collegeName: string;
  collegeTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  location: string;
  city: string;
  state: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  eventType: EventType;
  description: string;
  contactPerson: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
  registrationUrl: string;
  status: EventStatus;
  metrics: {
    registered: number;
    started: number;
    completed: number;
    conversionRate: number; // completed / registered * 100
    targetRegistrations: number;
  };
  createdAt: string;
}

export interface StudentLead {
  id: string;
  trackingId: string; // e.g. STU-2026-000184
  name: string;
  email: string;
  phone: string;
  college: string;
  city: string;
  state: string;
  yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  fieldOfStudy: string; // e.g. Computer Engineering, Mechanical, E&TC
  currentGpaOrPercentage: string; // e.g. 8.4 CGPA or 82%
  annualFamilyIncome: string; // e.g. < ₹1,80,000 / annum
  eventId: string;
  eventName: string;
  eventCode: string;
  registrationDate: string;
  registrationTimestamp: string;
  applicationStatus: ApplicationStatus;
  completionPercentage: number; // 25, 50, 75, 100
  consent: {
    termsAccepted: boolean;
    whatsappUpdates: boolean;
    futureCommunications: boolean;
    timestamp: string;
  };
  timeline: {
    id: string;
    timestamp: string;
    title: string;
    description: string;
    actor: 'Student' | 'System' | 'Admin';
    statusType: ApplicationStatus | 'Note';
  }[];
  notes?: string[];
  documentsPending?: string[];
}

export interface ApplicationRecord {
  id: string;
  leadId: string;
  trackingId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  college: string;
  fieldOfStudy: string;
  yearOfStudy: string;
  eventId: string;
  eventName: string;
  eventCode: string;
  startedAt: string;
  lastActivityAt: string;
  status: ApplicationStatus;
  progress: number; // 0 - 100
  completedSections: {
    personalDetails: boolean;
    academicHistory: boolean;
    financialEligibility: boolean;
    familyBackground: boolean;
    statementOfPurpose: boolean;
    documentUploads: boolean;
  };
  documentsStatus: {
    incomeCertificate: 'Verified' | 'Pending Review' | 'Not Uploaded' | 'Rejected';
    marksheet12th: 'Verified' | 'Pending Review' | 'Not Uploaded' | 'Rejected';
    collegeIdProof: 'Verified' | 'Pending Review' | 'Not Uploaded' | 'Rejected';
    aadhaarCard: 'Verified' | 'Pending Review' | 'Not Uploaded' | 'Rejected';
  };
  assignedReviewer?: string;
  reviewNotes?: string;
}

export interface NotificationItem {
  id: string;
  type: 'lead_alert' | 'milestone' | 'export_ready' | 'sync_status' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    eventId?: string;
    leadId?: string;
    exportId?: string;
  };
}

export interface ExportJob {
  id: string;
  fileName: string;
  eventName: string;
  dateRange: string;
  recordCount: number;
  format: 'CSV' | 'XLSX';
  status: 'Ready' | 'Processing' | 'Failed';
  generatedAt: string;
  generatedBy: string;
  downloadUrl: string;
  selectedFields: string[];
}

export interface GoogleSheetsSyncConfig {
  isConnected: boolean;
  spreadsheetId: string;
  spreadsheetName: string;
  spreadsheetUrl: string;
  lastSyncedAt: string;
  syncStatus: 'Healthy' | 'Syncing' | 'Failed' | 'Disconnected';
  autoSyncInterval: 'Real-time' | '15_min' | 'hourly' | 'daily';
  recordsSynced: number;
  sheetTabName: string;
}

export interface DateFilterRange {
  label: string;
  value: 'today' | '7days' | '30days' | 'quarter' | 'custom';
  startDate?: string;
  endDate?: string;
}
