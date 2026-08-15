import React from 'react';
import { 
  CheckCircle2, 
  Download, 
  Calendar, 
  ArrowRight, 
  Home, 
  FileText, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Award,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApplicationSuccessPage: React.FC = () => {
  const { applicationData, activeStudent, t, navigateTo, showToast } = useApp();

  const trackingId = applicationData.trackingId || activeStudent?.trackingId || 'STU-2026-000184';
  const submissionDate = applicationData.submittedAt || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleDownloadPdf = () => {
    showToast('Downloading Summary', `Application_Summary_${trackingId}.pdf generated.`, 'info');
  };

  return (
    <div className="w-full bg-slate-50 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center">
          
          {/* Green Confirmation Header */}
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-8 text-white space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white text-emerald-800 flex items-center justify-center shadow-lg ring-4 ring-white/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1 pt-1">
              <span className="px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold tracking-wide uppercase text-emerald-100 border border-white/20">
                Application Submitted
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Application Submitted Successfully!
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Your application for the Katalyst STEM Scholarship has been securely recorded.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Submission Receipt Details */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Tracking ID</span>
                <p className="font-mono font-bold text-rose-900 text-base mt-0.5">{trackingId}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Submission Timestamp</span>
                <p className="font-semibold text-slate-800 mt-0.5">{submissionDate}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Applicant Name</span>
                <p className="font-semibold text-slate-800 mt-0.5">{applicationData.fullName || activeStudent?.fullName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Status</span>
                <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Under Review (Phase 1)</span>
                </p>
              </div>
            </div>

            {/* Next Steps Roadmap */}
            <div className="text-left space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-800" />
                <span>What happens next in the selection process?</span>
              </h3>

              <div className="space-y-3 text-xs">
                
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Document & Academic Screening (1–2 Weeks)</p>
                    <p className="text-slate-600 mt-0.5">
                      The Katalyst regional team verifies your marksheets, college ID, and annual income certificate.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Personal Interaction & Assessment</p>
                    <p className="text-slate-600 mt-0.5">
                      Shortlisted candidates will be invited for an interactive discussion round with senior mentors. You will receive an SMS/WhatsApp invite.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Final Scholar Induction & Laptop Grant</p>
                    <p className="text-slate-600 mt-0.5">
                      Formal induction into the Katalyst 4-Year STEM cohort, laptop distribution, and 1-on-1 corporate mentor assignment.
                    </p>
                  </div>
                </div>

              </div>

              <p className="text-[11px] text-slate-500 italic pt-1">
                * Note: Application submission confirms your eligibility review and does not automatically guarantee scholarship allocation until final panel verification.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                type="button"
                id="btn-view-status-from-success"
                onClick={() => navigateTo('status')}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm bg-rose-800 hover:bg-rose-900 active:scale-98 transition shadow-md flex items-center justify-center gap-2"
              >
                <span>{t.btnViewStatus}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-download-pdf-summary"
                  onClick={handleDownloadPdf}
                  className="py-2.5 px-4 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download PDF Receipt</span>
                </button>

                <button
                  type="button"
                  id="btn-back-home-from-success"
                  onClick={() => navigateTo('event-landing')}
                  className="py-2.5 px-4 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>{t.btnHome}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
