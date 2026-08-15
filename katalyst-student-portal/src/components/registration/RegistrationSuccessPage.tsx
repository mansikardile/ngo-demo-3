import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Clock, 
  Share2, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  ExternalLink,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RegistrationSuccessPage: React.FC = () => {
  const { activeStudent, currentEvent, t, navigateTo, showToast } = useApp();
  const [isCopiedId, setIsCopiedId] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  const student = activeStudent || {
    trackingId: 'STU-2026-000184',
    fullName: 'Ananya Ramesh Sharma',
    college: 'MIT World Peace University (MIT-WPU), Pune',
    phone: '9876543210',
    email: 'ananya.sharma@mitwpu.edu.in',
    eventName: 'MIT Pune STEM Outreach 2026',
    registeredAt: 'Today, 11:35 AM',
    status: 'REGISTERED' as const,
    personalizedLink: '/apply/STU-2026-000184'
  };

  const appUrl = `${window.location.origin}/apply/${student.trackingId}`;

  const copyToClipboard = (text: string, type: 'id' | 'link') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'id') {
        setIsCopiedId(true);
        setTimeout(() => setIsCopiedId(false), 2500);
      } else {
        setIsCopiedLink(true);
        setTimeout(() => setIsCopiedLink(false), 2500);
      }
      showToast('Copied to Clipboard!', text, 'success');
    }).catch(() => {
      showToast('Copying failed', 'Please select and copy the text manually.', 'warning');
    });
  };

  const handleShareWhatsapp = () => {
    const text = `Hi ${student.fullName}, here is your official Katalyst Scholarship application link: ${appUrl} (Tracking ID: ${student.trackingId})`;
    const url = `https://wa.me/91${student.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full bg-slate-50 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center">
          
          {/* Top Celebration Banner */}
          <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-rose-800 p-8 text-white space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white/20 animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-1 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold tracking-wide uppercase text-rose-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.statusRegistered}</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {t.regSuccessTitle}
              </h1>
              <p className="text-rose-100 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-normal">
                {t.regSuccessSubtitle}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Student Registration Summary Badge */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Scholar Name</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{student.fullName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Institution</span>
                <p className="font-semibold text-slate-800 mt-0.5 truncate">{student.college}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Campus Outreach Drive</span>
                <p className="font-semibold text-slate-800 mt-0.5">{currentEvent?.collegeName || student.eventName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Registered At</span>
                <p className="font-semibold text-slate-800 mt-0.5">{student.registeredAt}</p>
              </div>
            </div>

            {/* Tracking ID Hero Box */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  {t.trackingIdLabel}
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Active & Verified
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-rose-200 shadow-inner">
                <span className="font-mono text-xl sm:text-2xl font-black text-rose-900 tracking-wider">
                  {student.trackingId}
                </span>
                <button
                  type="button"
                  id="btn-copy-tracking-id"
                  onClick={() => copyToClipboard(student.trackingId, 'id')}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5 shrink-0 active:scale-95"
                >
                  {isCopiedId ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span className="text-emerald-700">{t.btnCopied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t.btnCopyTrackingId}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-left leading-relaxed">
                {t.keepTrackingIdSafe}
              </p>
            </div>

            {/* Personalized Application Link Section */}
            <div className="text-left space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <h2 className="text-base font-bold text-slate-900">{t.appReadyTitle}</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.appReadyDesc}
              </p>

              {/* Personalized Link Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-600 truncate max-w-[280px] sm:max-w-md">
                    {appUrl}
                  </span>
                  <button
                    type="button"
                    id="btn-copy-app-link"
                    onClick={() => copyToClipboard(appUrl, 'link')}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition flex items-center gap-1 shrink-0"
                  >
                    {isCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Simulated Notification confirmation pill */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-900">{t.appLinkSentNotice}</p>
                  <p className="text-emerald-800 text-[11px]">
                    SMS / WhatsApp: <strong>+91 {student.phone}</strong> • Email: <strong>{student.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Next Step Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                type="button"
                id="btn-start-app-now"
                onClick={() => navigateTo('apply', student.trackingId)}
                className="w-full py-4 px-6 rounded-xl font-bold text-white text-base bg-rose-800 hover:bg-rose-900 active:scale-98 transition shadow-lg shadow-rose-900/15 flex items-center justify-center gap-2"
              >
                <span>{t.btnStartApp}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-save-continue-later"
                  onClick={() => {
                    showToast('Link Saved', 'You can return and continue anytime using your Tracking ID.', 'info');
                    navigateTo('event-landing');
                  }}
                  className="py-2.5 px-4 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{t.btnContinueLater}</span>
                </button>

                <button
                  type="button"
                  id="btn-whatsapp-share"
                  onClick={handleShareWhatsapp}
                  className="py-2.5 px-4 rounded-xl font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>{t.btnShareWhatsapp}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
