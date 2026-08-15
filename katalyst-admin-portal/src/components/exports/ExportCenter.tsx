import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckSquare, 
  Square, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  User, 
  Filter, 
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const ExportCenter: React.FC = () => {
  const { events, exportJobs, createExportJob } = useAdmin();

  // Generator State
  const [selectedEvent, setSelectedEvent] = useState('All Events (Consolidated)');
  const [selectedDateRange, setSelectedDateRange] = useState('Full Outreach Season (2026)');
  const [format, setFormat] = useState<'CSV' | 'XLSX' | 'PDF'>('CSV');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);

  const allAvailableFields = [
    'Student Name',
    'Email Address',
    'Phone Number',
    'College Name',
    'Academic Stream / Branch',
    'Year of Study',
    'Current GPA / Percentage',
    'Family Annual Income Tier',
    'Tracking ID (STU-XXXX)',
    'Event ID (EVT-XXXX)',
    'Registration Timestamp',
    'Application Status',
    'Data Processing Consent',
    'WhatsApp Notification Opt-in'
  ];

  const [selectedFields, setSelectedFields] = useState<string[]>(allAvailableFields);

  const handleToggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(prev => prev.filter(f => f !== field));
    } else {
      setSelectedFields(prev => [...prev, field]);
    }
  };

  const handleSelectAllFields = () => {
    if (selectedFields.length === allAvailableFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields(allAvailableFields);
    }
  };

  const handleGenerateExport = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFields.length === 0) return;

    setIsGenerating(true);
    setTimeout(() => {
      createExportJob({
        eventName: selectedEvent,
        dateRange: selectedDateRange,
        format,
        selectedFields,
        filterStatus: filterStatus !== 'All' ? filterStatus : undefined
      });
      setIsGenerating(false);
      setJustGenerated(true);
      setTimeout(() => setJustGenerated(false), 3000);
    }, 800);
  };

  const handleDownloadFile = (fileName: string) => {
    // Mock download CSV creation in browser
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Tracking ID,Student Name,Email,Phone,College,Status\n" +
      "STU-2026-000184,Priya Sharma,priya.sharma@coep.ac.in,+91 98234 56789,COEP Tech,Completed\n" +
      "STU-2026-000185,Ananya Deshmukh,ananya.d@cumminscollege.in,+91 98221 44332,Cummins COE,Completed\n" +
      "STU-2026-000186,Sneha Patil,sneha.patil@vjti.ac.in,+91 94200 88990,VJTI Mumbai,In Progress";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Export Center & Data Warehousing</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate custom field exports, audit logs, and donor/NGO compliance reports in CSV and Excel formats
          </p>
        </div>
      </div>

      {justGenerated && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Export generated successfully. File is ready in the Export History registry below.</span>
          </div>
        </div>
      )}

      {/* Export Generator (Section 29) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Custom Dataset Generator</span>
        </div>

        <form onSubmit={handleGenerateExport} className="space-y-5 text-xs">
          {/* Row 1: Source & Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Outreach Source Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-rose-500"
              >
                <option value="All Events (Consolidated)">All Events (Consolidated)</option>
                {events.map(e => (
                  <option key={e.id} value={e.name}>{e.name} ({e.eventCode})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Date Range Scope
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-rose-500"
              >
                <option value="Full Outreach Season (2026)">Full Outreach Season (2026)</option>
                <option value="Current Month (August 2026)">Current Month (August 2026)</option>
                <option value="Q3 2026 Campus Drive">Q3 2026 Campus Drive</option>
                <option value="Custom Date Range">Custom Date Range</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Application Status Filter
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-rose-500"
              >
                <option value="All">All Statuses (Registered, Started, Completed)</option>
                <option value="Completed">Completed Applications Only</option>
                <option value="In Progress">In Progress (Follow-up Pipeline)</option>
                <option value="Registered">Registered Only (Cold Leads)</option>
              </select>
            </div>
          </div>

          {/* Format Radio Selection */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-700">Export Format</label>
            <div className="flex items-center gap-4">
              {(['CSV', 'XLSX', 'PDF'] as ('CSV' | 'XLSX' | 'PDF')[]).map((fmt) => (
                <label 
                  key={fmt}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border cursor-pointer font-bold text-xs transition-colors ${
                    format === fmt 
                      ? 'bg-rose-50 border-rose-500 text-rose-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    checked={format === fmt}
                    onChange={() => setFormat(fmt)}
                    className="sr-only"
                  />
                  <span>{fmt === 'CSV' ? 'CSV (Comma Separated)' : fmt === 'XLSX' ? 'Excel Spreadsheet (.xlsx)' : 'Executive Summary (PDF)'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Column / Field Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">
                Select Data Fields to Include in Output ({selectedFields.length} of {allAvailableFields.length} selected)
              </label>
              <button
                type="button"
                onClick={handleSelectAllFields}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold"
              >
                {selectedFields.length === allAvailableFields.length ? 'Deselect All' : 'Select All Fields'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              {allAvailableFields.map((field) => {
                const isSelected = selectedFields.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => handleToggleField(field)}
                    className="flex items-center gap-2 text-left p-1.5 rounded-md hover:bg-white transition-colors"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span className={`text-xs ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                      {field}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={isGenerating || selectedFields.length === 0}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-900/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compiling Dataset...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate & Download {format}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Export History Log Table (Section 30) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Export History & Audit Registry</h3>
            <p className="text-xs text-slate-500">Record of all generated data extractions and reports</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-3">File Name</th>
                <th className="py-3 px-3">Event / Scope</th>
                <th className="py-3 px-3 text-center">Format</th>
                <th className="py-3 px-3 text-center">Records</th>
                <th className="py-3 px-3">Generated By</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exportJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{job.fileName}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 max-w-[200px] truncate">
                    {job.eventName}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {job.format}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                    {job.recordsCount}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {job.generatedBy}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                    {job.dateGenerated}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(job.fileName)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold rounded-md inline-flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
