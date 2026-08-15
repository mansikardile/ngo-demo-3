import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Clock, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building, 
  User, 
  BookOpen, 
  Home, 
  Compass, 
  ShieldCheck, 
  FileCheck2, 
  ArrowRight,
  Eye,
  Trash2,
  Lock,
  Loader2,
  PenTool
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationFormData, UploadedDocument } from '../../types';
import { SignatureCanvas } from '../common/SignatureCanvas';

export const ApplicationForm: React.FC = () => {
  const { 
    applicationData, 
    updateApplicationData, 
    saveApplicationDraft, 
    submitApplication, 
    activeStudent,
    t, 
    navigateTo,
    showToast,
    isOffline 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const totalSteps = 6;
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  const stepsConfig = [
    { number: 1, title: t.appStep1, icon: User },
    { number: 2, title: t.appStep2, icon: BookOpen },
    { number: 3, title: t.appStep3, icon: Home },
    { number: 4, title: t.appStep4, icon: Compass },
    { number: 5, title: t.appStep5, icon: Upload },
    { number: 6, title: t.appStep6, icon: FileCheck2 },
  ];

  // Auto-save on unmount or step change
  const handleNextStep = () => {
    // Validate current step
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!applicationData.fullName.trim()) errs.fullName = 'Full name is required';
      if (!applicationData.email.trim()) errs.email = 'Valid email is required';
      if (!applicationData.phone.trim()) errs.phone = 'Phone number is required';
      if (!applicationData.city.trim()) errs.city = 'City is required';
    } else if (currentStep === 2) {
      if (!applicationData.collegeName.trim()) errs.collegeName = 'College name is required';
      if (!applicationData.branch.trim()) errs.branch = 'Branch is required';
      if (!applicationData.tenthPercentage.trim()) errs.tenthPercentage = '10th percentage is required';
      if (!applicationData.twelfthPercentage.trim()) errs.twelfthPercentage = '12th percentage is required';
    } else if (currentStep === 3) {
      if (!applicationData.annualFamilyIncome.trim()) errs.annualFamilyIncome = 'Annual income bracket is required';
      if (!applicationData.fatherName.trim()) errs.fatherName = "Father's/Guardian's name is required";
    } else if (currentStep === 4) {
      if (!applicationData.careerGoal.trim()) errs.careerGoal = 'Career goal is required';
      if (!applicationData.whyKatalyst.trim() || applicationData.whyKatalyst.length < 20) {
        errs.whyKatalyst = 'Please provide at least a brief explanation (20+ characters)';
      }
    } else if (currentStep === 5) {
      const missingRequired = applicationData.documents.filter(d => d.required && d.status !== 'uploaded');
      if (missingRequired.length > 0) {
        errs.documents = `Please upload all required documents (${missingRequired.map(m => m.label).join(', ')})`;
      }
    }

    if (Object.keys(errs).length > 0) {
      setStepErrors(errs);
      showToast('Incomplete Fields', 'Please complete the required details before moving forward.', 'warning');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setStepErrors({});
    
    // Mark step completed
    const updatedCompleted = Array.from(new Set([...applicationData.completedSteps, currentStep]));
    updateApplicationData({ completedSteps: updatedCompleted });

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSimulatedFileUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedDocs = applicationData.documents.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          name: file.name,
          fileSize: sizeInMb,
          uploadedAt: `Today, ${now}`,
          status: 'uploaded' as const,
          previewUrl: URL.createObjectURL(file)
        };
      }
      return d;
    });

    updateApplicationData({ documents: updatedDocs });
    showToast('File Uploaded', `${file.name} attached successfully.`, 'success');
  };

  const handleRemoveDoc = (docId: string) => {
    const updatedDocs = applicationData.documents.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          name: '',
          fileSize: undefined,
          uploadedAt: undefined,
          status: 'pending' as const,
          previewUrl: undefined
        };
      }
      return d;
    });
    updateApplicationData({ documents: updatedDocs });
  };

  const handleFinalSubmit = () => {
    if (!applicationData.finalDeclarationAccepted) {
      showToast('Declaration Required', 'Please accept the final applicant declaration.', 'warning');
      return;
    }
    if (!applicationData.digitalSignatureUrl) {
      showToast('Signature Required', 'Please provide and confirm your digital signature.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitApplication();
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="w-full bg-slate-50/60 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Header Card with Auto-save indicator */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 text-xs font-mono font-bold">
                {applicationData.trackingId || activeStudent?.trackingId || 'STU-2026-000184'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {t.appStepProgress.replace('{current}', String(currentStep)).replace('{total}', String(totalSteps))}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.appHeaderTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Save className="w-3.5 h-3.5" />
              <span>{applicationData.lastSavedAt || t.appAutoSaveLabel}</span>
            </div>

            <button
              type="button"
              id="btn-save-exit"
              onClick={() => setIsSaveModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Save & Exit</span>
            </button>
          </div>
        </div>

        {/* Multi-step Visual Progress Milestone Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Application Journey</span>
            <span className="font-bold text-rose-800">{progressPercent}% Completed</span>
          </div>

          {/* Progress bar line */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-800 to-rose-600 transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(progressPercent, 10)}%` }}
            />
          </div>

          {/* Step Pill Icons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
            {stepsConfig.map((step) => {
              const isCurrent = step.number === currentStep;
              const isDone = applicationData.completedSteps.includes(step.number) || step.number < currentStep;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => {
                    if (isDone || step.number <= Math.max(...applicationData.completedSteps, 1) + 1) {
                      setCurrentStep(step.number);
                    }
                  }}
                  className={`p-2 rounded-xl text-left border transition flex items-center gap-2 ${
                    isCurrent
                      ? 'border-rose-700 bg-rose-50/80 text-rose-900 font-bold ring-2 ring-rose-600/20'
                      : isDone
                      ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      : 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isDone 
                      ? 'bg-emerald-600 text-white' 
                      : isCurrent 
                      ? 'bg-rose-800 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone && !isCurrent ? <Check className="w-3.5 h-3.5" /> : step.number}
                  </div>
                  <span className="text-[11px] truncate leading-tight hidden sm:inline">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Step Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Step Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-rose-800 text-white flex items-center justify-center font-bold text-xs">
                {currentStep}
              </span>
              <h2 className="text-base font-bold text-white">
                {stepsConfig[currentStep - 1].title}
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {currentStep === 6 ? 'Final Review' : 'All fields auto-saved'}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* STEP 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-800">Full Name (as per 10th Certificate / Aadhar) *</label>
                    <input
                      type="text"
                      value={applicationData.fullName}
                      onChange={e => updateApplicationData({ fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                    {stepErrors.fullName && <p className="text-xs text-rose-600 font-medium">{stepErrors.fullName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Email Address *</label>
                    <input
                      type="email"
                      value={applicationData.email}
                      onChange={e => updateApplicationData({ email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                    {stepErrors.email && <p className="text-xs text-rose-600 font-medium">{stepErrors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Primary Mobile (+91 WhatsApp) *</label>
                    <input
                      type="tel"
                      value={applicationData.phone}
                      onChange={e => updateApplicationData({ phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Alternate Phone / Guardian Number</label>
                    <input
                      type="tel"
                      value={applicationData.alternatePhone || ''}
                      onChange={e => updateApplicationData({ alternatePhone: e.target.value })}
                      placeholder="e.g. 9822334455"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Date of Birth *</label>
                    <input
                      type="date"
                      value={applicationData.dob || '2006-04-14'}
                      onChange={e => updateApplicationData({ dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Social Category / Reservation</label>
                    <select
                      value={applicationData.category}
                      onChange={e => updateApplicationData({ category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none bg-white"
                    >
                      <option value="General (EWS)">General (EWS / Low-income)</option>
                      <option value="OBC (Non-Creamy Layer)">OBC (Non-Creamy Layer)</option>
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                      <option value="VJ/NT/SBC">VJ / NT / SBC (Maharashtra State)</option>
                      <option value="General">General / Open</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Are you a First-Generation College Student?</label>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="firstGen"
                          checked={applicationData.isFirstGenGraduate === true}
                          onChange={() => updateApplicationData({ isFirstGenGraduate: true })}
                          className="accent-rose-800"
                        />
                        <span>Yes, first in immediate family to pursue degree</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="firstGen"
                          checked={applicationData.isFirstGenGraduate === false}
                          onChange={() => updateApplicationData({ isFirstGenGraduate: false })}
                          className="accent-rose-800"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-800">Current Residential Address (Hostel / Local) *</label>
                    <input
                      type="text"
                      value={applicationData.currentAddress}
                      onChange={e => updateApplicationData({ currentAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">City / District *</label>
                    <input
                      type="text"
                      value={applicationData.city}
                      onChange={e => updateApplicationData({ city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                    {stepErrors.city && <p className="text-xs text-rose-600 font-medium">{stepErrors.city}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Pincode *</label>
                    <input
                      type="text"
                      value={applicationData.pincode}
                      onChange={e => updateApplicationData({ pincode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* STEP 2: Academic Records */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-800">College / Institute *</label>
                    <input
                      type="text"
                      value={applicationData.collegeName}
                      onChange={e => updateApplicationData({ collegeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Degree Program *</label>
                    <select
                      value={applicationData.degree}
                      onChange={e => updateApplicationData({ degree: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none bg-white"
                    >
                      <option value="B.Tech (Bachelor of Technology)">B.Tech (Bachelor of Technology)</option>
                      <option value="B.E. (Bachelor of Engineering)">B.E. (Bachelor of Engineering)</option>
                      <option value="B.Sc Computer Science / Data Science">B.Sc Computer Science / Data Science</option>
                      <option value="Integrated M.Tech / Dual Degree">Integrated M.Tech / Dual Degree</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Branch / Specialization *</label>
                    <input
                      type="text"
                      value={applicationData.branch}
                      onChange={e => updateApplicationData({ branch: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">10th Standard (SSC/CBSE/ICSE) % *</label>
                    <input
                      type="text"
                      value={applicationData.tenthPercentage}
                      onChange={e => updateApplicationData({ tenthPercentage: e.target.value })}
                      placeholder="e.g. 93.60%"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                    {stepErrors.tenthPercentage && <p className="text-xs text-rose-600 font-medium">{stepErrors.tenthPercentage}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">12th Standard / Diploma Score *</label>
                    <input
                      type="text"
                      value={applicationData.twelfthPercentage}
                      onChange={e => updateApplicationData({ twelfthPercentage: e.target.value })}
                      placeholder="e.g. 89.40%"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                    {stepErrors.twelfthPercentage && <p className="text-xs text-rose-600 font-medium">{stepErrors.twelfthPercentage}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Current Semester CGPA / Aggregate</label>
                    <input
                      type="text"
                      value={applicationData.currentSemesterCgpa}
                      onChange={e => updateApplicationData({ currentSemesterCgpa: e.target.value })}
                      placeholder="e.g. 8.80 / 10"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Entrance Exam Rank / Percentile</label>
                    <input
                      type="text"
                      value={applicationData.entranceExamPercentile || ''}
                      onChange={e => updateApplicationData({ entranceExamPercentile: e.target.value })}
                      placeholder="e.g. MHT-CET 96.85 Percentile or JEE 92%"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-800">Key Academic Achievements / Science Competitions</label>
                    <textarea
                      rows={2}
                      value={applicationData.academicAchievements || ''}
                      onChange={e => updateApplicationData({ academicAchievements: e.target.value })}
                      placeholder="e.g. Olympiad rank, school topper, science fair award, coding hackathons..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* STEP 3: Family & Background */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-800">Annual Family Income Bracket *</label>
                    <select
                      value={applicationData.annualFamilyIncome}
                      onChange={e => updateApplicationData({ annualFamilyIncome: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none bg-white"
                    >
                      <option value="Under ₹ 1,50,000 / year">Under ₹ 1,50,000 / year (Priority assistance)</option>
                      <option value="₹ 1,80,000 / year (Under ₹ 2.5 Lakhs)">₹ 1.5 Lakhs to ₹ 2.5 Lakhs / year</option>
                      <option value="₹ 2.5 Lakhs to ₹ 3.5 Lakhs / year">₹ 2.5 Lakhs to ₹ 3.5 Lakhs / year</option>
                      <option value="Above ₹ 3.5 Lakhs / year (Special case)">Above ₹ 3.5 Lakhs / year (Special circumstances)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Father's / Primary Guardian's Name *</label>
                    <input
                      type="text"
                      value={applicationData.fatherName}
                      onChange={e => updateApplicationData({ fatherName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                    {stepErrors.fatherName && <p className="text-xs text-rose-600 font-medium">{stepErrors.fatherName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Father's Occupation</label>
                    <input
                      type="text"
                      value={applicationData.fatherOccupation}
                      onChange={e => updateApplicationData({ fatherOccupation: e.target.value })}
                      placeholder="e.g. Daily wage worker, driver, small vendor, farmer..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Mother's / Guardian's Name</label>
                    <input
                      type="text"
                      value={applicationData.motherName}
                      onChange={e => updateApplicationData({ motherName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Mother's Occupation</label>
                    <input
                      type="text"
                      value={applicationData.motherOccupation}
                      onChange={e => updateApplicationData({ motherOccupation: e.target.value })}
                      placeholder="e.g. Homemaker, tailor, domestic worker, self-employed..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Number of Siblings</label>
                    <input
                      type="text"
                      value={applicationData.numberOfSiblings}
                      onChange={e => updateApplicationData({ numberOfSiblings: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Do you currently own a personal laptop?</label>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="hasLaptop"
                          checked={applicationData.hasLaptop === true}
                          onChange={() => updateApplicationData({ hasLaptop: true })}
                          className="accent-rose-800"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="hasLaptop"
                          checked={applicationData.hasLaptop === false}
                          onChange={() => updateApplicationData({ hasLaptop: false })}
                          className="accent-rose-800"
                        />
                        <span className="font-semibold text-rose-900">No (Eligible for Katalyst Laptop scheme)</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 4: STEM Aspirations & Goals */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">What is your long-term career ambition in STEM? *</label>
                    <input
                      type="text"
                      value={applicationData.careerGoal}
                      onChange={e => updateApplicationData({ careerGoal: e.target.value })}
                      placeholder="e.g. Software Architect, AI/ML Specialist, Aerospace Engineer, Core R&D..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                    {stepErrors.careerGoal && <p className="text-xs text-rose-600 font-medium">{stepErrors.careerGoal}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Why do you want to join Katalyst and how will this scholarship help you? *
                    </label>
                    <textarea
                      rows={4}
                      value={applicationData.whyKatalyst}
                      onChange={e => updateApplicationData({ whyKatalyst: e.target.value })}
                      placeholder="Share your story, family circumstances, and what you hope to achieve with mentorship and training..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none leading-relaxed"
                    />
                    {stepErrors.whyKatalyst && <p className="text-xs text-rose-600 font-medium">{stepErrors.whyKatalyst}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Describe a personal or academic challenge you have overcome:
                    </label>
                    <textarea
                      rows={3}
                      value={applicationData.greatestChallengeOvercome}
                      onChange={e => updateApplicationData({ greatestChallengeOvercome: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      What are your expectations from your 1-on-1 Corporate Mentor?
                    </label>
                    <input
                      type="text"
                      value={applicationData.mentorshipExpectations}
                      onChange={e => updateApplicationData({ mentorshipExpectations: e.target.value })}
                      placeholder="e.g. Industry projects, interview guidance, tech trends, soft skills..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* STEP 5: Document Uploads */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <span>
                    Upload clear PDF or JPG scans (Max 5MB each). Documents are stored with end-to-end encryption.
                  </span>
                </div>

                {stepErrors.documents && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    {stepErrors.documents}
                  </p>
                )}

                <div className="space-y-3">
                  {applicationData.documents.map((doc) => {
                    const isUploaded = doc.status === 'uploaded';

                    return (
                      <div
                        key={doc.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isUploaded 
                            ? 'border-emerald-200 bg-emerald-50/30' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{doc.label}</span>
                              {doc.required && (
                                <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                  Required
                                </span>
                              )}
                              {isUploaded && (
                                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Attached
                                </span>
                              )}
                            </div>

                            {isUploaded ? (
                              <p className="text-xs text-slate-600 font-mono flex items-center gap-2">
                                <span className="font-semibold text-slate-800">{doc.name}</span>
                                <span>•</span>
                                <span>{doc.fileSize}</span>
                                <span>•</span>
                                <span className="text-slate-400">{doc.uploadedAt}</span>
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-400">PDF, JPG, or PNG under 5MB</p>
                            )}
                          </div>

                          {/* Upload / Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            {isUploaded ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDoc(doc.id)}
                                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Remove & Replace"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <label className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer transition flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload File</span>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={(e) => handleSimulatedFileUpload(doc.id, e)}
                                />
                              </label>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: Review & Final Submission */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Summary Box */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">Application Summary</h3>
                    <span className="text-xs text-rose-800 font-semibold">Ready for Final Review</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Applicant Name</span>
                      <p className="font-bold text-slate-900 mt-0.5">{applicationData.fullName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">College & Branch</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{applicationData.collegeName} ({applicationData.branch})</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Scores (10th / 12th / CGPA)</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{applicationData.tenthPercentage} / {applicationData.twelfthPercentage} / CGPA {applicationData.currentSemesterCgpa}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Annual Family Income</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{applicationData.annualFamilyIncome}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Documents Attached</span>
                      <p className="font-semibold text-emerald-800 mt-0.5">
                        {applicationData.documents.filter(d => d.status === 'uploaded').length} of {applicationData.documents.length} verified
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Tracking Code</span>
                      <p className="font-mono font-bold text-rose-900 mt-0.5">{applicationData.trackingId}</p>
                    </div>
                  </div>
                </div>

                {/* Final Declarations */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applicationData.finalDeclarationAccepted}
                      onChange={e => updateApplicationData({ finalDeclarationAccepted: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-rose-800 accent-rose-800"
                    />
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">Applicant Declaration: </strong>
                      I hereby declare that all particulars stated in this application form and attached documents are true and authentic to the best of my knowledge. I understand that any false statement will result in immediate disqualification.
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applicationData.parentConsentConfirmed}
                      onChange={e => updateApplicationData({ parentConsentConfirmed: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-rose-800 accent-rose-800"
                    />
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">Parental / Guardian Awareness: </strong>
                      My parents/guardians are aware of my application to the Katalyst STEM Scholarship and give full consent for my participation in workshops, mentorship calls, and training sessions.
                    </div>
                  </label>
                </div>

                {/* Digital Signature Confirmation on Step 6 */}
                <div className="pt-2">
                  <SignatureCanvas
                    onConfirm={(dataUrl) => {
                      updateApplicationData({ digitalSignatureUrl: dataUrl, signatureDate: new Date().toLocaleDateString('en-GB') });
                    }}
                    initialSignature={applicationData.digitalSignatureUrl}
                    required={true}
                  />
                </div>

              </div>
            )}

            {/* Navigation / Progress Buttons */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
              
              {currentStep > 1 ? (
                <button
                  type="button"
                  id="btn-prev-step"
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.btnBack}</span>
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  id="btn-next-step"
                  onClick={handleNextStep}
                  className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-rose-800 hover:bg-rose-900 active:scale-98 transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.btnNext}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-final-submit-application"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-98 transition shadow-lg shadow-emerald-900/15 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* Save & Exit Confirmation Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200">
            <div className="w-12 h-12 mx-auto rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Your Progress is Saved!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You can return anytime using your Tracking ID: <strong className="font-mono text-rose-900">{applicationData.trackingId}</strong> or your registered phone number.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-800 hover:bg-rose-900 transition"
              >
                Continue Application Now
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSaveModalOpen(false);
                  navigateTo('event-landing');
                }}
                className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
