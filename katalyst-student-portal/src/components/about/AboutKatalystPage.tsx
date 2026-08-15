import React from 'react';
import { 
  GraduationCap, 
  Laptop, 
  Users, 
  Award, 
  TrendingUp, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Quote 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALUMNI_STORIES, CORPORATE_PARTNERS } from '../../data/mockData';

export const AboutKatalystPage: React.FC = () => {
  const { t, navigateTo } = useApp();

  return (
    <div className="w-full bg-slate-50/50 py-12 sm:py-16 space-y-16">
      
      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transforming Lives Through STEM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Empowering High-Potential Young Women in STEM
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Founded under the aegis of Third Sector Partners, Katalyst is a registered non-profit trust dedicated to bridging the gender divide in STEM leadership across India by empowering young women from low-income communities.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigateTo('register')}
            className="px-6 py-3.5 rounded-xl font-bold text-white bg-rose-800 hover:bg-rose-900 transition text-sm shadow-md inline-flex items-center gap-2"
          >
            <span>Register for Current Campus Drive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Year Intervention Model Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-1 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Our Comprehensive Approach</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">The 4-Year Katalyst Ecosystem</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Unlike traditional one-time scholarships, Katalyst stays with the scholar throughout her entire college graduation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Laptop & Digital Infrastructure</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every scholar is provided a personal branded laptop, internet data reimbursements, technical development environments, and licensed software so lack of digital access never hinders coding and lab work.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. 1-on-1 Corporate Mentorship</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Matched with a senior corporate technology leader from top global firms (Google, Microsoft, Morgan Stanley, Boeing, etc.) for continuous career guidance, confidence building, and professional networking.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. 600+ Hours of Executive Training</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rigorous residential and weekend bootcamps covering executive business communication, emotional intelligence, technical certifications, AI/cloud workshops, and corporate behavioral preparedness.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">4. Financial Aid & Health Cover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct financial scholarship for tuition fees, exam fees, medical and accident insurance coverage for scholars, ensuring peace of mind during demanding engineering semesters.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Alumnae Success Stories */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Inspiring Journeys</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Voices of Katalyst Alumnae</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALUMNI_STORIES.map((alumna, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <Quote className="w-8 h-8 text-rose-200" />
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{alumna.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img
                  src={alumna.image}
                  alt={alumna.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-100"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{alumna.name}</h4>
                  <p className="text-[11px] font-semibold text-rose-800">{alumna.role}</p>
                  <p className="text-[10px] text-slate-400">{alumna.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Partners */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Industry Backing</span>
          <h3 className="text-lg font-bold text-slate-900">Mentorship & Placement Partner Ecosystem</h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {CORPORATE_PARTNERS.map((partner, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
