import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  KeyRound, 
  Phone, 
  Mail, 
  Sparkles, 
  Send, 
  CheckCircle2,
  BookOpen,
  FileText,
  ShieldCheck,
  Award,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FAQS } from '../../data/mockData';

export const HelpCenterPage: React.FC = () => {
  const { language, t, navigateTo, findStudentByTrackingOrPhone, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Lost Tracking ID form
  const [recoverInput, setRecoverInput] = useState('');
  const [recoveredResult, setRecoveredResult] = useState<any | null>(null);

  // Contact Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isContactSent, setIsContactSent] = useState(false);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'About Katalyst' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'registration', label: 'Registration & QR' },
    { id: 'application', label: 'Application Form' },
    { id: 'documents', label: 'Documents' },
    { id: 'selection', label: 'Selection & Induction' },
  ];

  const filteredFaqs = FAQS.filter(faq => {
    const q = (faq.question[language] || faq.question.en).toLowerCase();
    const a = (faq.answer[language] || faq.answer.en).toLowerCase();
    const matchesSearch = q.includes(searchQuery.toLowerCase()) || a.includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverInput.trim()) return;

    const student = findStudentByTrackingOrPhone(recoverInput.trim());
    if (student) {
      setRecoveredResult(student);
      showToast('Record Found', `Found Tracking ID for ${student.fullName}`, 'success');
    } else {
      setRecoveredResult(null);
      showToast('Not Found', 'No registration found for this phone or email.', 'warning');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setIsContactSent(true);
    showToast('Message Sent', 'Our regional outreach team will respond within 24 hours.', 'success');
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setIsContactSent(false);
    }, 4000);
  };

  return (
    <div className="w-full bg-slate-50/60 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.helpTitle}
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            {t.helpSubtitle}
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchFaqPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 bg-white text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {categories.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-rose-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-3">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Frequently Asked Questions ({filteredFaqs.length})
          </h3>

          {filteredFaqs.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No questions matched your search query. Try another keyword or use the recovery form below.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredFaqs.map(faq => {
                const isOpen = openFaqId === faq.id;
                const questionText = faq.question[language] || faq.question.en;
                const answerText = faq.answer[language] || faq.answer.en;

                return (
                  <div key={faq.id} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm text-slate-900 hover:text-rose-800 transition"
                    >
                      <span>{questionText}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-rose-700 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="pt-2.5 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
                        {answerText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lost Tracking ID / Link Instant Recovery Wizard */}
        <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-rose-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t.lostTrackingIdTitle}</h3>
              <p className="text-xs text-rose-200">{t.lostTrackingIdDesc}</p>
            </div>
          </div>

          <form onSubmit={handleRecover} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={recoverInput}
              onChange={e => setRecoverInput(e.target.value)}
              placeholder="Registered 10-digit Phone or Email Address"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-rose-200/70 border border-white/20 text-sm focus:bg-white/20 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white text-rose-950 hover:bg-rose-50 transition shadow-md shrink-0 cursor-pointer"
            >
              {t.btnRecover}
            </button>
          </form>

          {recoveredResult && (
            <div className="p-4 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-xs space-y-2 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-rose-200">Scholar Found:</span>
                <span className="font-bold text-white text-sm">{recoveredResult.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-rose-200">Tracking ID:</span>
                <span className="font-mono font-black text-amber-300 text-base">{recoveredResult.trackingId}</span>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('apply', recoveredResult.trackingId)}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-lg text-xs transition"
                >
                  Open Application Form
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('status')}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-xs transition"
                >
                  View Status
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact Katalyst Helpdesk Form & Regional Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Regional Support Directory */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Regional Outreach Chapters</h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <p className="font-bold text-slate-900">Maharashtra Chapter (Pune & Mumbai)</p>
                <p className="text-slate-600">Helpline: +91 22 2490 0012</p>
                <p className="text-slate-500">pune.outreach@katalystindia.org</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <p className="font-bold text-slate-900">Karnataka Chapter (Bengaluru)</p>
                <p className="text-slate-600">Helpline: +91 80 4123 5567</p>
                <p className="text-slate-500">blr.outreach@katalystindia.org</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <p className="font-bold text-slate-900">Delhi-NCR & Northern Chapter</p>
                <p className="text-slate-600">Helpline: +91 11 4987 6543</p>
                <p className="text-slate-500">delhi.outreach@katalystindia.org</p>
              </div>
            </div>
          </div>

          {/* Quick Query Form */}
          <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Send an Inquiry to Katalyst</h3>
            
            {isContactSent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-950">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                <p className="font-bold text-sm">Inquiry Received!</p>
                <p className="text-xs text-emerald-800">Our student counselor will get back to you via email/phone.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="e.g. Sneha Patil"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-rose-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email or Phone *</label>
                    <input
                      type="text"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="e.g. 9822334455"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-rose-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Your Question / Message *</label>
                  <textarea
                    rows={3}
                    required
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    placeholder="Describe your query regarding college registration, eligibility, or documents..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-rose-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-rose-800 hover:bg-rose-900 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
