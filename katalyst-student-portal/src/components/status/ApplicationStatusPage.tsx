import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Building, 
  User, 
  ArrowRight, 
  Phone, 
  Mail, 
  ShieldCheck, 
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatusType, StudentRegistrationData } from '../../types';

export const ApplicationStatusPage: React.FC = () => {
  const { 
    findStudentByTrackingOrPhone, 
    activeStudent, 
    applicationData, 
    t, 
    navigateTo, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(activeStudent?.trackingId || 'STU-2026-000184');
  const [searchedStudent, setSearchedStudent] = useState<StudentRegistrationData | null>(activeStudent);
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const result = findStudentByTrackingOrPhone(searchQuery.trim());
    if (result) {
      setSearchedStudent(result);
      setHasSearched(true);
      showToast('Record Found', `Status loaded for ${result.fullName}`, 'success');
    } else {
      setSearchedStudent(null);
      setHasSearched(true);
      showToast('Not Found', 'No record matches this Tracking ID or mobile number.', 'warning');
    }
  };

  // Determine current status
  const currentStatus: ApplicationStatusType = searchedStudent
    ? (applicationData.isSubmitted && searchedStudent.trackingId === applicationData.trackingId ? 'APPLICATION_SUBMITTED' : searchedStudent.status)
    : 'APPLICATION_IN_PROGRESS';

  const timelineSteps: {
    key: ApplicationStatusType;
    label: string;
    description: string;
    date?: string;
  }[] = [
    {
      key: 'REGISTERED',
      label: t.statusRegistered,
      description: 'Interest registered during college outreach drive. Tracking ID issued.',
      date: searchedStudent?.registeredAt || '20 Aug 2026'
    },
    {
      key: 'APPLICATION_STARTED',
      label: t.statusStarted,
      description: 'Personal and academic details initialized in online application.',
      date: '20 Aug 2026'
    },
    {
      key: 'APPLICATION_IN_PROGRESS',
      label: t.statusInProgress,
      description: 'Documents and essay statement in progress (Draft saved).',
      date: 'In Progress'
    },
    {
      key: 'APPLICATION_SUBMITTED',
      label: t.statusSubmitted,
      description: 'Full application form and attached certificates received.',
      date: applicationData.isSubmitted ? 'Submitted' : 'Pending final submit'
    },
    {
      key: 'APPLICATION_UNDER_REVIEW',
      label: t.statusUnderReview,
      description: 'Document verification and eligibility criteria screening by Katalyst committee.',
      date: 'Estimated: 1–2 weeks'
    },
    {
      key: 'SELECTED',
      label: t.statusSelected,
      description: 'Induction into the Katalyst 4-Year STEM Scholarship & laptop allotment.',
      date: 'Upcoming'
    }
  ];

  const getStepState = (index: number) => {
    const statusOrder: ApplicationStatusType[] = [
      'REGISTERED',
      'APPLICATION_STARTED',
      'APPLICATION_IN_PROGRESS',
      'APPLICATION_SUBMITTED',
      'APPLICATION_UNDER_REVIEW',
      'SELECTED'
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full bg-slate-50/60 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Search Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalyst Scholar Tracker</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.statusPageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {t.statusPageSubtitle}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.inputTrackingOrPhone}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
              />
            </div>
            <button
              type="submit"
              id="btn-search-status"
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-rose-800 hover:bg-rose-900 transition shrink-0 cursor-pointer"
            >
              {t.btnCheckStatus}
            </button>
          </form>

          {/* Quick Preset Shortcuts for reviewers */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Quick Test IDs:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('STU-2026-000184');
                const s = findStudentByTrackingOrPhone('STU-2026-000184');
                if (s) setSearchedStudent(s);
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border border-slate-200 transition font-mono text-[11px]"
            >
              STU-2026-000184 (Draft)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('STU-2026-000142');
                const s = findStudentByTrackingOrPhone('STU-2026-000142');
                if (s) setSearchedStudent(s);
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border border-slate-200 transition font-mono text-[11px]"
            >
              STU-2026-000142 (Interview)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('STU-2026-000099');
                const s = findStudentByTrackingOrPhone('STU-2026-000099');
                if (s) setSearchedStudent(s);
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border border-slate-200 transition font-mono text-[11px]"
            >
              STU-2026-000099 (Selected)
            </button>
          </div>
        </div>

        {/* Results Area */}
        {hasSearched && searchedStudent && (
          <div className="space-y-6">
            
            {/* Student Overview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {searchedStudent.trackingId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{searchedStudent.fullName}</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {searchedStudent.college} • {searchedStudent.fieldOfStudy}
                  </p>
                </div>

                {/* Continue / Action Button */}
                <button
                  type="button"
                  onClick={() => navigateTo('apply', searchedStudent.trackingId)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-800 hover:bg-rose-900 transition flex items-center gap-1.5 shrink-0 self-start sm:self-center shadow-xs"
                >
                  <span>{applicationData.isSubmitted ? 'View Application Form' : 'Continue Application Form'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status Timeline */}
              <div className="pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Application Progress Milestone Timeline
                </h3>

                <div className="space-y-4">
                  {timelineSteps.map((step, idx) => {
                    const state = getStepState(idx);

                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        
                        {/* Timeline node icon & vertical connector line */}
                        <div className="relative flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold z-10 transition ${
                            state === 'completed'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : state === 'current'
                              ? 'bg-rose-800 text-white ring-4 ring-rose-100 animate-pulse'
                              : 'bg-slate-200 text-slate-400'
                          }`}>
                            {state === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : state === 'current' ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          
                          {idx < timelineSteps.length - 1 && (
                            <div className={`w-0.5 h-12 my-1 ${
                              state === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                            }`} />
                          )}
                        </div>

                        {/* Timeline Step Content */}
                        <div className="pt-1 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className={`text-sm font-bold ${
                              state === 'current' ? 'text-rose-900 font-extrabold' : state === 'completed' ? 'text-slate-900' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </h4>
                            {step.date && (
                              <span className="text-[11px] font-medium text-slate-400">
                                {step.date}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Regional Coordinator Contact Card */}
              <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assigned Regional Coordinator</span>
                  <p className="font-bold text-slate-900">Pooja Kulkarni (Western Regional Chapter)</p>
                  <p className="text-slate-500">pooja.kulkarni@katalystindia.org • +91 98200 45678</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('help')}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition shrink-0"
                >
                  Contact Helpdesk
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Empty / Not Found State */}
        {hasSearched && !searchedStudent && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Student Application Found</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We couldn't find an application matching "{searchQuery}". Please verify your 10-digit phone number or Tracking ID (e.g. STU-2026-000184).
              </p>
            </div>
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => navigateTo('register')}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-800 hover:bg-rose-900 transition"
              >
                Register as New Scholar
              </button>
              <button
                type="button"
                onClick={() => navigateTo('help')}
                className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Recover Tracking ID
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
