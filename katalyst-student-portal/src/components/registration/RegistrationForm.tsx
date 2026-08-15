import React, { useState } from 'react';
import { 
  Building, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle, 
  Loader2,
  CheckCircle2,
  HelpCircle,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SignatureCanvas } from '../common/SignatureCanvas';
import { POPULAR_COLLEGES } from '../../data/mockData';

export const RegistrationForm: React.FC = () => {
  const { 
    currentEvent, 
    t, 
    navigateTo, 
    registerNewStudent, 
    isOffline,
    showToast,
    setIsEventModalOpen 
  } = useApp();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState(currentEvent?.collegeName || POPULAR_COLLEGES[0]);
  const [customCollege, setCustomCollege] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science / IT');
  const [customField, setCustomField] = useState('');
  const [cgpaPercentage, setCgpaPercentage] = useState('');
  
  // Consents & Signature
  const [consentDataProcessing, setConsentDataProcessing] = useState(true);
  const [consentFutureComms, setConsentFutureComms] = useState(true);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');

  // UI / Validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Field validation helpers
  const validateField = (name: string, value: any): string | null => {
    switch (name) {
      case 'fullName':
        if (!value || value.trim().length < 3) return t.valNameRequired;
        return null;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value.trim())) return t.valEmailInvalid;
        return null;
      case 'phone':
        const cleanPhone = value.replace(/\D/g, '');
        if (!value || cleanPhone.length !== 10) return t.valPhoneInvalid;
        return null;
      case 'college':
        if (!value) return t.valCollegeRequired;
        return null;
      case 'consentDataProcessing':
        if (!value) return t.valConsentRequired;
        return null;
      case 'signature':
        if (!signatureDataUrl) return t.valSignatureRequired;
        return null;
      default:
        return null;
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let val: any;
    if (field === 'fullName') val = fullName;
    if (field === 'email') val = email;
    if (field === 'phone') val = phone;
    if (field === 'college') val = college;
    if (field === 'consentDataProcessing') val = consentDataProcessing;

    const error = validateField(field, val);
    setErrors(prev => {
      const copy = { ...prev };
      if (error) copy[field] = error;
      else delete copy[field];
      return copy;
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    if (touched.phone) {
      const err = validateField('phone', raw);
      setErrors(prev => {
        const copy = { ...prev };
        if (err) copy.phone = err;
        else delete copy.phone;
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    const nameErr = validateField('fullName', fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateField('email', email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validateField('phone', phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const collegeErr = validateField('college', college === 'Other / College Not Listed Above' ? customCollege : college);
    if (collegeErr) newErrors.college = collegeErr;

    if (!consentDataProcessing) {
      newErrors.consentDataProcessing = t.valConsentRequired;
    }

    if (!signatureDataUrl) {
      newErrors.signature = t.valSignatureRequired;
    }

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      college: true,
      consentDataProcessing: true,
      signature: true
    });

    if (Object.keys(newErrors).length > 0) {
      showToast('Please check the form', 'Some required fields need your attention.', 'warning');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // Submit with realistic progress delay
    setIsSubmitting(true);

    setTimeout(() => {
      const finalCollege = college === 'Other / College Not Listed Above' && customCollege.trim() ? customCollege.trim() : college;
      const finalField = fieldOfStudy === 'Other STEM Discipline' && customField.trim() ? customField.trim() : fieldOfStudy;

      const newStudent = registerNewStudent({
        eventId: currentEvent?.id || 'EVT-MIT-2026-001',
        eventCode: currentEvent?.code || 'EVT-MIT-2026-001',
        eventName: currentEvent?.title || 'College Outreach Drive',
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: finalCollege,
        yearOfStudy,
        fieldOfStudy: finalField,
        cgpaPercentage: cgpaPercentage.trim() || 'N/A',
        consentDataProcessing,
        consentFutureComms,
        signatureDataUrl,
        gender: 'Female'
      });

      setIsSubmitting(false);
      navigateTo('register-success');
    }, 1000);
  };

  return (
    <div className="w-full bg-slate-50/70 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigateTo('event-landing')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.btnBack} to Event Overview</span>
          </button>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-rose-800 p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-bold tracking-wide text-rose-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Katalyst On-Spot Registration</span>
              </span>
              <span className="text-xs text-rose-200 font-mono font-bold bg-black/25 px-2.5 py-1 rounded-md">
                2-Min Fast Registration
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t.regFormTitle}
            </h1>
            <p className="text-rose-100/90 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl">
              {t.regFormSubtitle}
            </p>

            {/* Automatically Attached Event Card info */}
            {currentEvent && (
              <div className="mt-5 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-rose-200 tracking-wider">
                    {t.eventLinkedNotice}
                  </span>
                  <p className="font-bold text-white text-sm leading-tight">{currentEvent.collegeName}</p>
                  <p className="text-rose-200 text-[11px] font-mono">{currentEvent.code} • {currentEvent.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold transition shrink-0"
                >
                  Change Event
                </button>
              </div>
            )}
          </div>

          {/* Registration Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {/* Section 1: Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">{t.sectionPersonalInfo}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="reg-full-name" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.fullNameLabel}</span>
                    <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <input
                    id="reg-full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder={t.fullNamePlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 transition outline-none ${
                      errors.fullName
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-2 focus:ring-rose-100'
                        : 'border-slate-300 bg-white focus:border-rose-700 focus:ring-2 focus:ring-rose-100'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-email" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.emailLabel}</span>
                    <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder={t.emailPlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 transition outline-none ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-2 focus:ring-rose-100'
                        : 'border-slate-300 bg-white focus:border-rose-700 focus:ring-2 focus:ring-rose-100'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Mobile Number (+91 Indian format) */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-phone" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.phoneLabel}</span>
                    <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-bold font-mono">
                      +91
                    </span>
                    <input
                      id="reg-phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder={t.phonePlaceholder}
                      className={`w-full px-3.5 py-2.5 rounded-r-xl border text-sm text-slate-900 font-mono transition outline-none ${
                        errors.phone
                          ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-2 focus:ring-rose-100'
                          : 'border-slate-300 bg-white focus:border-rose-700 focus:ring-2 focus:ring-rose-100'
                      }`}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400">Tracking link & updates will be sent here</p>
                  )}
                </div>

              </div>
            </div>

            {/* Section 2: Academic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">{t.sectionAcademicInfo}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* College Selection */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="reg-college" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.collegeLabel}</span>
                    <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <select
                    id="reg-college"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none transition"
                  >
                    {POPULAR_COLLEGES.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {college === 'Other / College Not Listed Above' && (
                    <div className="mt-2 space-y-1">
                      <input
                        type="text"
                        value={customCollege}
                        onChange={e => setCustomCollege(e.target.value)}
                        placeholder="Type full official name of your college"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Year of Study */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-year" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.yearOfStudyLabel}</span>
                    <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <select
                    id="reg-year"
                    value={yearOfStudy}
                    onChange={e => setYearOfStudy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none transition"
                  >
                    <option value="1st Year">{t.year1}</option>
                    <option value="2nd Year">{t.year2}</option>
                    <option value="3rd Year">{t.year3}</option>
                    <option value="4th Year">{t.year4}</option>
                    <option value="Other STEM Degree">{t.yearOther}</option>
                  </select>
                </div>

                {/* Field of Study */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-field" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.fieldOfStudyLabel}</span>
                    <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <select
                    id="reg-field"
                    value={fieldOfStudy}
                    onChange={e => setFieldOfStudy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none transition"
                  >
                    <option value="Computer Science / IT">{t.fieldCompSci}</option>
                    <option value="AI / Data Science / ML">{t.fieldAI}</option>
                    <option value="Electronics & Telecommunication">{t.fieldECE}</option>
                    <option value="Mechanical Engineering">{t.fieldMech}</option>
                    <option value="Civil Engineering">{t.fieldCivil}</option>
                    <option value="Biotechnology / Biomedical">{t.fieldBiotech}</option>
                    <option value="Electrical Engineering">{t.fieldElectrical}</option>
                    <option value="Chemical Engineering">{t.fieldChemical}</option>
                    <option value="Other STEM Discipline">{t.fieldOther}</option>
                  </select>

                  {fieldOfStudy === 'Other STEM Discipline' && (
                    <input
                      type="text"
                      value={customField}
                      onChange={e => setCustomField(e.target.value)}
                      placeholder="Specify your branch / specialization"
                      className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  )}
                </div>

                {/* CGPA / Percentage */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="reg-cgpa" className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.cgpaLabel}</span>
                    <span className="text-xs font-normal text-slate-400">(Optional / Self-reported)</span>
                  </label>
                  <input
                    id="reg-cgpa"
                    type="text"
                    value={cgpaPercentage}
                    onChange={e => setCgpaPercentage(e.target.value)}
                    placeholder={t.cgpaPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none transition"
                  />
                </div>

              </div>
            </div>

            {/* Section 3: Consent & Digital Signature */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">{t.sectionConsent}</h3>
              </div>

              {/* Consent 1: Mandatory */}
              <div className={`p-4 rounded-xl border transition ${
                errors.consentDataProcessing ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-slate-50'
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="chk-consent-data"
                    checked={consentDataProcessing}
                    onChange={e => setConsentDataProcessing(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-rose-800 border-slate-300 focus:ring-rose-700 accent-rose-800"
                  />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{t.consentDataProcessingTitle}</span>
                      <span className="text-rose-600 font-bold">*</span>
                    </p>
                    <p className="text-slate-600 leading-relaxed font-normal">
                      {t.consentDataProcessingText}
                    </p>
                  </div>
                </label>
                {errors.consentDataProcessing && (
                  <p className="text-xs text-rose-600 font-semibold mt-2 ml-7 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.consentDataProcessing}</span>
                  </p>
                )}
              </div>

              {/* Consent 2: Optional */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="chk-consent-comms"
                    checked={consentFutureComms}
                    onChange={e => setConsentFutureComms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-rose-800 border-slate-300 focus:ring-rose-700 accent-rose-800"
                  />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">{t.consentFutureCommsTitle}</p>
                    <p className="text-slate-600 leading-relaxed font-normal">
                      {t.consentFutureCommsText}
                    </p>
                  </div>
                </label>
              </div>

              {/* Digital Signature Canvas */}
              <div className="pt-1">
                <SignatureCanvas
                  onConfirm={(dataUrl) => {
                    setSignatureDataUrl(dataUrl);
                    setErrors(prev => {
                      const copy = { ...prev };
                      delete copy.signature;
                      return copy;
                    });
                  }}
                  initialSignature={signatureDataUrl}
                  required={true}
                />
                {errors.signature && (
                  <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.signature}</span>
                  </p>
                )}
              </div>

            </div>

            {/* Submit Action Area */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <button
                type="submit"
                id="btn-submit-registration"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl font-bold text-white text-base bg-rose-800 hover:bg-rose-900 active:scale-98 transition shadow-lg shadow-rose-900/15 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.btnSubmitting}</span>
                  </>
                ) : (
                  <>
                    <span>{t.btnSubmitInterest}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>256-bit Encrypted Transmission</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Unique Tracking ID Generation</span>
                </span>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
