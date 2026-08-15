export type Language = 'en' | 'hi' | 'mr';

export type ApplicationStatusType = 
  | 'REGISTERED'
  | 'APPLICATION_STARTED'
  | 'APPLICATION_IN_PROGRESS'
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_UNDER_REVIEW'
  | 'INTERVIEW_SCHEDULED'
  | 'SELECTED';

export interface EventInfo {
  id: string;
  code: string;
  title: string;
  collegeName: string;
  city: string;
  state: string;
  date: string;
  time: string;
  venue: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  status: 'active' | 'expired' | 'inactive';
  description: string;
  eligibleBranches: string[];
  bannerSubtitle?: string;
}

export interface StudentRegistrationData {
  trackingId: string;
  eventId: string;
  eventCode: string;
  eventName: string;
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  gender: string;
  college: string;
  customCollege?: string;
  yearOfStudy: string;
  fieldOfStudy: string;
  customField?: string;
  cgpaPercentage?: string;
  consentDataProcessing: boolean;
  consentFutureComms: boolean;
  signatureDataUrl?: string;
  registeredAt: string;
  status: ApplicationStatusType;
  personalizedLink: string;
}

export interface FamilyMember {
  relation: string;
  occupation: string;
  educationLevel: string;
  annualIncome: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'college_id' | 'tenth_marksheet' | 'twelfth_marksheet' | 'income_proof' | 'caste_cert' | 'applicant_photo';
  label: string;
  fileSize?: string;
  uploadedAt?: string;
  status: 'pending' | 'uploaded' | 'verified';
  previewUrl?: string;
  required: boolean;
}

export interface ApplicationFormData {
  // Step 1: Personal
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dob: string;
  gender: string;
  category: string; // General / OBC / SC / ST / EWS / PwD
  isFirstGenGraduate: boolean;
  currentAddress: string;
  permanentAddress: string;
  pincode: string;
  city: string;
  state: string;

  // Step 2: Academic
  collegeName: string;
  degree: string; // B.Tech, B.E., B.Sc Data Science, Integrated M.Tech, etc.
  branch: string;
  yearOfStudy: string;
  tenthPercentage: string;
  tenthBoard: string;
  twelfthPercentage: string;
  twelfthBoard: string;
  currentSemesterCgpa: string;
  entranceExamType: string; // MHT-CET, JEE Main, KCET, WBJEE, Direct/Merit
  entranceExamPercentile?: string;
  academicAchievements?: string;

  // Step 3: Family & Socio-economic
  annualFamilyIncome: string; // < 1.5 Lakhs, 1.5 - 3 Lakhs, 3 - 5 Lakhs, > 5 Lakhs
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  numberOfSiblings: string;
  familyMembersCount: string;
  houseType: string; // Rented, Owned, Ancestral
  hasLaptop: boolean;
  hasInternetAtHome: boolean;
  hasReceivedOtherScholarship: boolean;
  otherScholarshipDetails?: string;

  // Step 4: Aspirations & Goals
  careerGoal: string; // Software Engineer, AI/ML Specialist, Aerospace Engineer, Core R&D, etc.
  whyKatalyst: string;
  greatestChallengeOvercome: string;
  hobbiesAndInterests: string;
  mentorshipExpectations: string;

  // Step 5: Documents
  documents: UploadedDocument[];

  // Step 6: Review & Final Declaration
  finalDeclarationAccepted: boolean;
  parentConsentConfirmed: boolean;
  digitalSignatureUrl?: string;
  signatureDate?: string;
  
  // Metadata
  trackingId: string;
  lastSavedAt: string;
  completedSteps: number[];
  isSubmitted: boolean;
  submittedAt?: string;
}

export interface StatusTimelineStep {
  key: ApplicationStatusType;
  title: string;
  description: string;
  date?: string;
  isCurrent: boolean;
  isCompleted: boolean;
}

export interface FAQItem {
  id: string;
  category: 'general' | 'registration' | 'application' | 'eligibility' | 'documents' | 'selection';
  question: {
    en: string;
    hi: string;
    mr: string;
  };
  answer: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface OfflineSyncItem {
  id: string;
  type: 'REGISTRATION' | 'APPLICATION_DRAFT' | 'APPLICATION_SUBMIT';
  timestamp: string;
  data: any;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}
