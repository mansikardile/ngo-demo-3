import React from 'react';
import { 
  Building, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Laptop, 
  Users, 
  Award, 
  QrCode,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EventLandingPage: React.FC = () => {
  const { 
    currentEvent, 
    t, 
    navigateTo, 
    setIsEventModalOpen,
    activeStudent 
  } = useApp();

  const event = currentEvent || {
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
    status: 'active' as const,
    description: 'Interactive session introducing high-potential female engineering students to Katalyst corporate mentorship and scholarship.',
    eligibleBranches: ['Computer Science', 'Information Technology', 'AI & Data Science', 'Electronics', 'Mechanical', 'All STEM Branches'],
    bannerSubtitle: 'Official College Outreach & On-Spot Registration'
  };

  return (
    <div className="w-full bg-slate-50/50 pb-16">
      
      {/* Top Event Notification Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-rose-700/80 border border-rose-500/50 text-rose-100 px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wide">
              {event.code}
            </span>
            <span className="font-medium text-rose-100">
              Campus Outreach Drive is live at <strong className="text-white">{event.collegeName}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsEventModalOpen(true)}
            className="text-rose-200 hover:text-white underline text-[11px] font-semibold flex items-center gap-1"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Switch / Test Another College Event</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-rose-700" />
                <span>Katalyst 4-Year STEM Scholarship Program</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
                {t.heroTitle}
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                {t.heroSubtitle}
              </p>

              {/* Impact Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <p className="text-2xl font-black text-rose-800 tracking-tight">{t.statScholars}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 leading-snug">{t.statScholarsLabel}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{t.statPlacement}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 leading-snug">{t.statPlacementLabel}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <p className="text-2xl font-black text-rose-800 tracking-tight">{t.statIncome}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 leading-snug">{t.statIncomeLabel}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{t.statMentors}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 leading-snug">{t.statMentorsLabel}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  id="hero-btn-register"
                  onClick={() => navigateTo('register')}
                  className="px-6 py-3.5 rounded-xl font-bold text-white bg-rose-800 hover:bg-rose-900 active:scale-98 transition shadow-md shadow-rose-900/10 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>{t.btnRegisterInterest}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="hero-btn-continue-app"
                  onClick={() => navigateTo(activeStudent ? 'apply' : 'status')}
                  className="px-5 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition text-xs sm:text-sm text-center"
                >
                  {t.btnAlreadyRegistered}
                </button>
              </div>

            </div>

            {/* Right: Event Information Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border-2 border-rose-100 shadow-xl overflow-hidden">
                
                {/* Event Card Header */}
                <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 p-6 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-xs text-[11px] font-bold uppercase tracking-wider text-rose-100 border border-white/20">
                      {t.eventCardHeading}
                    </span>
                    <span className="font-mono text-xs font-bold text-rose-200 bg-black/20 px-2 py-0.5 rounded">
                      {currentEvent.code}
                    </span>
                  </div>
                  <h2 className="text-xl font-black leading-tight text-white">
                    {currentEvent.title}
                  </h2>
                  <p className="text-xs text-rose-200 font-medium">
                    {currentEvent.bannerSubtitle || 'Official On-Campus Session'}
                  </p>
                </div>

                {/* Event Details List */}
                <div className="p-6 space-y-4">
                  
                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-800 shrink-0 mt-0.5">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">{t.eventCollege}</p>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{currentEvent.collegeName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="flex items-start gap-2.5 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">{t.eventDate}</p>
                        <p className="font-semibold text-slate-900">{currentEvent.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">{t.eventTime}</p>
                        <p className="font-semibold text-slate-900">{currentEvent.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs pt-1">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">{t.eventVenue}</p>
                      <p className="font-semibold text-slate-900">{currentEvent.venue}</p>
                      <p className="text-slate-500 text-[11px]">{currentEvent.city}, {currentEvent.state}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs pt-1 border-t border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">{t.eventCoordinator}</p>
                      <p className="font-semibold text-slate-900">{currentEvent.coordinatorName}</p>
                      <p className="text-slate-500 text-[11px]">{currentEvent.coordinatorPhone} • {currentEvent.coordinatorEmail}</p>
                    </div>
                  </div>

                  {/* Primary Event CTA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      id="card-btn-register"
                      onClick={() => navigateTo('register')}
                      className="w-full py-3 px-4 rounded-xl font-bold text-white bg-rose-800 hover:bg-rose-900 transition text-center shadow-md flex items-center justify-center gap-2 text-sm"
                    >
                      <span>{t.btnRegisterInterest}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      Event info will be automatically attached to your application
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Eligibility & Why Katalyst Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Eligibility Card */}
          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.eligibilityTitle}</h3>
            </div>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span>{t.eligibility1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span>{t.eligibility2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span>{t.eligibility3}</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              <strong>Need guidance?</strong> Speak to the Katalyst representative in your hall today. Registration takes less than 2 minutes on your phone.
            </div>
          </div>

          {/* 4 Pillars of Support */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">What Katalyst Scholars Receive</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Laptop className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Brand New Laptop & Tools</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Personal high-spec laptop provided for all 4 years to complete coursework, coding projects, and virtual internships.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">1-on-1 Industry Mentorship</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated corporate mentor from Microsoft, Google, Morgan Stanley, Boeing, or Barclays guiding your career goals.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">600+ Hours of Skill Training</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Extensive modules in business communication, technical certifications, AI/ML workshops, and leadership readiness.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Financial Aid & Medical Cover</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct educational scholarship for college tuition fees along with comprehensive health insurance for scholars.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
