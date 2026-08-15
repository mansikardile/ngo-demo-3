import React from 'react';
import { GraduationCap, ShieldCheck, Mail, Phone, Heart, Globe, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { t, navigateTo, setLanguage, language } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-800 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-base font-black tracking-tight text-white">KATALYST INDIA</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs sm:text-sm">
              {t.footerDesc}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Govt. Registered Public Trust</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                <span>80G / 12A Certified</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('event-landing')}
                  className="hover:text-rose-400 transition"
                >
                  Campus Event Registration
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('apply')}
                  className="hover:text-rose-400 transition"
                >
                  Scholarship Application Form
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('status')}
                  className="hover:text-rose-400 transition"
                >
                  Application Tracking & Status
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('about')}
                  className="hover:text-rose-400 transition"
                >
                  4-Year STEM Intervention Model
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('help')}
                  className="hover:text-rose-400 transition"
                >
                  Scholar Help & FAQ Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Helpline & Regional Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t.contactTitle}
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-white">Outreach Helpline</p>
                  <p className="text-[11px] text-slate-400">+91 22 2490 0012</p>
                  <p className="text-[11px] text-slate-400">+91 98200 45678 (WhatsApp Support)</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300 pt-1">
                <Mail className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-white">Student Admissions</p>
                  <p className="text-[11px] text-slate-400">{t.emailText}</p>
                </div>
              </div>

              {/* Language Switch in footer */}
              <div className="pt-3">
                <p className="text-[11px] text-slate-500 font-medium mb-1.5 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>Choose Language / भाषा</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded text-xs transition ${
                      language === 'en' ? 'bg-rose-800 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    className={`px-2 py-1 rounded text-xs transition ${
                      language === 'hi' ? 'bg-rose-800 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    हिंदी
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('mr')}
                    className={`px-2 py-1 rounded text-xs transition ${
                      language === 'mr' ? 'bg-rose-800 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    मराठी
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy & Data Protection</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Student Code of Conduct</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Equal Opportunity Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
