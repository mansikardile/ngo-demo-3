import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Users, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Calendar, 
  Eye, 
  Sparkles, 
  CheckSquare, 
  Square, 
  MessageSquare,
  X,
  ChevronDown
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ApplicationStatus, StudentLead } from '../../types';

export const LeadsManagement: React.FC = () => {
  const { 
    leads, 
    events, 
    setSelectedLeadId, 
    maskPII, 
    createExportJob, 
    updateLeadStatus 
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedYearFilter, setSelectedYearFilter] = useState('All');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [selectedConsentFilter, setSelectedConsentFilter] = useState('All');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Bulk Selection
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkActionSuccess, setBulkActionSuccess] = useState<string | null>(null);

  // Available options
  const eventOptions = ['All', ...Array.from(new Set(events.map(e => e.name)))];
  const cityOptions = ['All', ...Array.from(new Set(leads.map(l => l.city)))];
  const yearOptions = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];
  const statusOptions: ('All' | ApplicationStatus)[] = ['All', 'Registered', 'Started', 'In Progress', 'Completed'];

  // Filter computation
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.college.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEventFilter === 'All' || lead.eventName === selectedEventFilter;
    const matchesStatus = selectedStatusFilter === 'All' || lead.applicationStatus === selectedStatusFilter;
    const matchesYear = selectedYearFilter === 'All' || lead.yearOfStudy === selectedYearFilter;
    const matchesCity = selectedCityFilter === 'All' || lead.city === selectedCityFilter;
    const matchesConsent = 
      selectedConsentFilter === 'All' ? true :
      selectedConsentFilter === 'Consented' ? lead.consent.termsAccepted :
      selectedConsentFilter === 'WhatsApp Opt-in' ? lead.consent.whatsappUpdates : true;

    return matchesSearch && matchesEvent && matchesStatus && matchesYear && matchesCity && matchesConsent;
  });

  const maskEmail = (email: string) => {
    if (!maskPII) return email;
    const [name, domain] = email.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!maskPII) return phone;
    return phone.replace(/(\+91\s\d{2})\d{3}(\s\d{4})/, '$1***$2');
  };

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedLeadIds(prev => [...prev, id]);
    }
  };

  const handleExportSelected = () => {
    createExportJob({
      eventName: selectedEventFilter !== 'All' ? selectedEventFilter : 'Global Leads Cohort',
      dateRange: 'Active Filters',
      format: 'CSV',
      selectedFields: ['Tracking ID', 'Student Name', 'Email', 'Phone', 'College', 'Field of Study', 'Year', 'Status', 'Consent'],
      filterStatus: selectedStatusFilter !== 'All' ? selectedStatusFilter : undefined
    });
    setBulkActionSuccess('Export generated for selected leads.');
    setTimeout(() => setBulkActionSuccess(null), 3000);
  };

  const handleSendReminderSMS = () => {
    setBulkActionSuccess(`Dispatched WhatsApp application reminders to ${selectedLeadIds.length || filteredLeads.length} students.`);
    setTimeout(() => setBulkActionSuccess(null), 4000);
  };

  const activeFilterCount = [
    selectedEventFilter !== 'All',
    selectedStatusFilter !== 'All',
    selectedYearFilter !== 'All',
    selectedCityFilter !== 'All',
    selectedConsentFilter !== 'All'
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSelectedEventFilter('All');
    setSelectedStatusFilter('All');
    setSelectedYearFilter('All');
    setSelectedCityFilter('All');
    setSelectedConsentFilter('All');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Leads Directory</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time multi-college outreach registry with tracking verification and consent logging
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportSelected}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredLeads.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner for bulk actions */}
      {bulkActionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{bulkActionSuccess}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student name, email, phone, tracking ID (STU-...), or college..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Status Dropdown */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              {statusOptions.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
            </select>

            {/* Quick Year Dropdown */}
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              {yearOptions.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
            </select>

            {/* Advanced Filters Button */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                activeFilterCount > 0 
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters Drawer (Section 38) */}
        {isFilterDrawerOpen && (
          <div className="pt-3 mt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-3 rounded-lg text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Outreach Event</label>
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-slate-800"
              >
                {eventOptions.map(evt => <option key={evt} value={evt}>{evt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-slate-800"
              >
                {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Consent Status</label>
              <select
                value={selectedConsentFilter}
                onChange={(e) => setSelectedConsentFilter(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-slate-800"
              >
                <option value="All">All Records</option>
                <option value="Consented">Data Processing Consented</option>
                <option value="WhatsApp Opt-in">WhatsApp Opt-in Active</option>
              </select>
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[11px] text-slate-400 font-medium">Active Filters:</span>
            {selectedEventFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
                Event: {selectedEventFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedEventFilter('All')} />
              </span>
            )}
            {selectedStatusFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
                Status: {selectedStatusFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStatusFilter('All')} />
              </span>
            )}
            {selectedYearFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
                Year: {selectedYearFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedYearFilter('All')} />
              </span>
            )}
            {selectedCityFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
                City: {selectedCityFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCityFilter('All')} />
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-slate-500 hover:text-slate-900 underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Bulk Selection Bar */}
      {selectedLeadIds.length > 0 && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex items-center justify-between text-xs shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold text-rose-400">{selectedLeadIds.length}</span>
            <span>students selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendReminderSMS}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send WhatsApp Reminder</span>
            </button>

            <button
              type="button"
              onClick={handleExportSelected}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Leads Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-3 w-8">
                  <button type="button" onClick={handleSelectAll}>
                    {selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3">Student Name</th>
                <th className="py-3.5 px-3">Contact (PII Masked)</th>
                <th className="py-3.5 px-3">College & Branch</th>
                <th className="py-3.5 px-3">Event Source</th>
                <th className="py-3.5 px-3">Tracking ID</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-center">Progress</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <div className="font-semibold text-slate-600">No student leads match your criteria</div>
                    <p className="text-xs text-slate-400 mt-0.5">Try resetting search or filter terms</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);

                  return (
                    <tr 
                      key={lead.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-rose-50/30' : ''}`}
                    >
                      <td className="py-3.5 px-3">
                        <button type="button" onClick={() => handleToggleSelect(lead.id)}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>

                      {/* Student Name */}
                      <td className="py-3.5 px-3">
                        <div 
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="font-bold text-slate-900 hover:text-rose-600 cursor-pointer text-sm"
                        >
                          {lead.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{lead.yearOfStudy}</div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-slate-800">{maskEmail(lead.email)}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{maskPhone(lead.phone)}</div>
                      </td>

                      {/* College & Branch */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800 truncate max-w-[180px]">
                          {lead.college}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-[180px]">
                          {lead.fieldOfStudy}
                        </div>
                      </td>

                      {/* Event Source */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-700 truncate max-w-[150px]">
                          {lead.eventName}
                        </div>
                        <div className="font-mono text-[10px] text-rose-700">
                          {lead.eventCode}
                        </div>
                      </td>

                      {/* Tracking ID */}
                      <td className="py-3.5 px-3 font-mono font-semibold text-slate-600 text-[11px]">
                        {lead.trackingId}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lead.applicationStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          lead.applicationStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                          lead.applicationStatus === 'Started' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.applicationStatus}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full mx-auto overflow-hidden">
                          <div 
                            className="bg-rose-600 h-full rounded-full" 
                            style={{ width: `${lead.completionPercentage}%` }} 
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
                          {lead.completionPercentage}%
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-[11px] transition-colors"
                        >
                          View Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout (Section 36) */}
      <div className="md:hidden space-y-3">
        {filteredLeads.map((lead) => (
          <div 
            key={lead.id} 
            onClick={() => setSelectedLeadId(lead.id)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5 cursor-pointer hover:border-rose-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                <div className="text-xs text-slate-500">{lead.college}</div>
                <div className="text-[11px] text-slate-400">{lead.fieldOfStudy} • {lead.yearOfStudy}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                lead.applicationStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                lead.applicationStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {lead.applicationStatus}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-mono text-slate-500">
              <span>{lead.trackingId}</span>
              <span className="text-rose-600 font-bold">{lead.completionPercentage}% done</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
