import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  Download, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  X,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { StudentApplication, ApplicationStage } from '../../types';

export const ApplicationsTracking: React.FC = () => {
  const { 
    applications, 
    leads, 
    setSelectedLeadId, 
    updateApplicationStage,
    maskPII,
    createExportJob
  } = useAdmin();

  const [selectedStageTab, setSelectedStageTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState('All');
  const [selectedAppForReview, setSelectedAppForReview] = useState<StudentApplication | null>(null);

  const stages: ('All' | ApplicationStage)[] = [
    'All',
    'Draft',
    'Personal Info',
    'Academic Details',
    'Document Verification',
    'Submitted',
    'Under Review',
    'Shortlisted'
  ];

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.college.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = selectedStageTab === 'All' || app.stage === selectedStageTab;
    const matchesVerification = 
      selectedVerificationStatus === 'All' ? true :
      selectedVerificationStatus === 'Verified' ? app.incomeVerificationStatus === 'Verified' :
      selectedVerificationStatus === 'Pending' ? app.incomeVerificationStatus === 'Pending' : true;

    return matchesSearch && matchesStage && matchesVerification;
  });

  const maskEmail = (email: string) => {
    if (!maskPII) return email;
    const [name, domain] = email.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  const getStageBadge = (stage: ApplicationStage) => {
    switch (stage) {
      case 'Shortlisted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Submitted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Document Verification':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Application Pipeline & Verification</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track multi-step submission stages, income verification dossiers, and scholarship candidate shortlists
          </p>
        </div>

        <button
          type="button"
          onClick={() => createExportJob({
            eventName: 'Application Pipeline Export',
            dateRange: 'Current Batch',
            format: 'XLSX',
            selectedFields: ['Application ID', 'Tracking ID', 'Student Name', 'College', 'Stage', 'Income Verification', 'Submission Date']
          })}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Application Register</span>
        </button>
      </div>

      {/* Stage Summary KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">In Progress (Draft)</div>
          <div className="text-xl font-black text-slate-800 mt-1">
            {applications.filter(a => ['Draft', 'Personal Info', 'Academic Details'].includes(a.stage)).length}
          </div>
          <div className="text-[10px] text-slate-400">Step 1-3 fill rate</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Doc Verification</div>
          <div className="text-xl font-black text-amber-600 mt-1">
            {applications.filter(a => a.stage === 'Document Verification').length}
          </div>
          <div className="text-[10px] text-slate-400">Income proofs uploaded</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Submitted & Review</div>
          <div className="text-xl font-black text-blue-600 mt-1">
            {applications.filter(a => ['Submitted', 'Under Review'].includes(a.stage)).length}
          </div>
          <div className="text-[10px] text-slate-400">Ready for committee</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Shortlisted for Interview</div>
          <div className="text-xl font-black text-purple-600 mt-1">
            {applications.filter(a => a.stage === 'Shortlisted').length}
          </div>
          <div className="text-[10px] text-purple-600 font-semibold">Scholarship final round</div>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 custom-scrollbar">
        {stages.map((stg) => {
          const count = stg === 'All' ? applications.length : applications.filter(a => a.stage === stg).length;
          const isActive = selectedStageTab === stg;

          return (
            <button
              key={stg}
              type="button"
              onClick={() => setSelectedStageTab(stg)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-rose-600 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{stg}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Verification Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicant name, ID, or college..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Income Verification:</span>
          <select
            value={selectedVerificationStatus}
            onChange={(e) => setSelectedVerificationStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="All">All Verification States</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Applicant & ID</th>
                <th className="py-3.5 px-3">College & Discipline</th>
                <th className="py-3.5 px-3 text-center">Current Stage</th>
                <th className="py-3.5 px-3 text-center">Income Proof</th>
                <th className="py-3.5 px-3 text-center">Score / CGPA</th>
                <th className="py-3.5 px-3 text-center">Submitted On</th>
                <th className="py-3.5 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <div className="font-semibold text-slate-600">No applications match your criteria</div>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <div 
                        onClick={() => setSelectedLeadId(app.leadId)}
                        className="font-bold text-slate-900 hover:text-rose-600 cursor-pointer text-sm"
                      >
                        {app.studentName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-slate-600 font-semibold">{app.applicationId}</span>
                        <span>•</span>
                        <span>{maskEmail(app.email)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="font-medium text-slate-800 truncate max-w-[200px]">{app.college}</div>
                      <div className="text-[11px] text-slate-500">{app.fieldOfStudy}</div>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStageBadge(app.stage)}`}>
                        {app.stage}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        app.incomeVerificationStatus === 'Verified' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : app.incomeVerificationStatus === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.incomeVerificationStatus === 'Verified' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                        <span>{app.incomeVerificationStatus}</span>
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {app.documentsUploaded} docs
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="font-bold text-slate-900">{app.academicScore}</span>
                      <div className="text-[10px] text-slate-400">CGPA / %</div>
                    </td>

                    <td className="py-4 px-3 text-center font-mono text-[11px] text-slate-500">
                      {app.submissionDate || 'In Draft'}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedAppForReview(app)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Quick Review Modal */}
      {selectedAppForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Application Verification Dossier</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedAppForReview.applicationId}</p>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedAppForReview(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{selectedAppForReview.studentName}</div>
                  <div className="text-slate-500">{selectedAppForReview.college}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-rose-700">{selectedAppForReview.academicScore} GPA</div>
                  <div className="text-[10px] text-slate-400">{selectedAppForReview.fieldOfStudy}</div>
                </div>
              </div>

              {/* Stage Progressor */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Advance Application Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Under Review', 'Shortlisted', 'Document Verification', 'Submitted'] as ApplicationStage[]).map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => {
                        updateApplicationStage(selectedAppForReview.id, stage);
                        setSelectedAppForReview(prev => prev ? { ...prev, stage } : null);
                      }}
                      className={`p-2 rounded-lg border text-left font-semibold transition-colors ${
                        selectedAppForReview.stage === stage 
                          ? 'bg-rose-50 border-rose-500 text-rose-700' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="font-bold text-slate-800 text-xs">Uploaded Verification Documents:</div>
                <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Family Income Certificate / ITR</span>
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Class 10th & 12th Marksheets</span>
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>College Identity Card & Admission Letter</span>
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAppForReview(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
