import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  QrCode, 
  Share2, 
  Download, 
  Users, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Filter, 
  Eye, 
  Archive, 
  Edit3, 
  Sparkles,
  Phone,
  Mail,
  User,
  Award
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { StudentLead, EventStatus } from '../../types';

export const EventDetailView: React.FC = () => {
  const { 
    selectedEventId, 
    events, 
    leads, 
    setActivePage, 
    setSelectedLeadId, 
    setActiveQrEvent, 
    setIsQrModalOpen, 
    maskPII,
    createExportJob,
    updateEventStatus
  } = useAdmin();

  const [leadSearch, setLeadSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [isEditing, setIsEditing] = useState(false);

  // Find active event or default to first
  const event = events.find(e => e.id === selectedEventId) || events[0];

  // Event specific leads
  const eventLeads = leads.filter(l => l.eventId === event?.id || l.eventCode === event?.eventCode);

  const filteredEventLeads = eventLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.trackingId.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.fieldOfStudy.toLowerCase().includes(leadSearch.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || lead.applicationStatus === statusFilter;
    const matchesYear = yearFilter === 'All' || lead.yearOfStudy === yearFilter;

    return matchesSearch && matchesStatus && matchesYear;
  });

  if (!event) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Event Not Found</h3>
        <button
          type="button"
          onClick={() => setActivePage('events')}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Events List
        </button>
      </div>
    );
  }

  const maskEmail = (email: string) => {
    if (!maskPII) return email;
    const [name, domain] = email.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!maskPII) return phone;
    return phone.replace(/(\+91\s\d{2})\d{3}(\s\d{4})/, '$1***$2');
  };

  const handleExportThisEvent = () => {
    createExportJob({
      eventName: event.name,
      dateRange: event.date,
      format: 'CSV',
      selectedFields: ['Tracking ID', 'Student Name', 'Email', 'Phone', 'College', 'Field of Study', 'Year', 'Status', 'Consent'],
      filterStatus: statusFilter !== 'All' ? statusFilter : undefined
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActivePage('events')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveQrEvent(event);
              setIsQrModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Registration QR & Link</span>
          </button>

          <button
            type="button"
            onClick={handleExportThisEvent}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Event Leads</span>
          </button>
        </div>
      </div>

      {/* Event Header Banner (Section 16) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                {event.eventCode}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                event.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                {event.status}
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {event.eventType}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{event.name}</h2>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1.5">
              <div className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">{event.collegeName}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.venue}, {event.location}, {event.city}, {event.state}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.date} ({event.startTime} - {event.endTime})</span>
              </div>
            </div>
          </div>

          {/* Quick status dropdown */}
          <div className="flex items-center gap-2 self-start">
            <span className="text-xs text-slate-500">Status:</span>
            <select
              value={event.status}
              onChange={(e) => updateEventStatus(event.id, e.target.value as EventStatus)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Coordinator Info */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/50 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Campus Coordinator</div>
              <div className="font-bold text-slate-800">{event.contactPerson.name} ({event.contactPerson.role})</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Phone</div>
              <div className="font-medium text-slate-700">{maskPhone(event.contactPerson.phone)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Email</div>
              <div className="font-medium text-slate-700">{maskEmail(event.contactPerson.email)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Metrics & Funnel Cards (Section 17) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Event Registrations</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{event.metrics.registered}</div>
          <div className="mt-1 text-[11px] text-slate-400">Target capacity: {event.metrics.targetRegistrations}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Applications Started</div>
          <div className="mt-2 text-2xl font-black text-amber-600">{event.metrics.started}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            {event.metrics.registered > 0 ? ((event.metrics.started / event.metrics.registered) * 100).toFixed(1) : 0}% start rate
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Applications Completed</div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{event.metrics.completed}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            {event.metrics.started > 0 ? ((event.metrics.completed / event.metrics.started) * 100).toFixed(1) : 0}% of started
          </div>
        </div>

        <div className="bg-rose-900 text-white p-4 rounded-xl border border-rose-800 shadow-xs">
          <div className="text-xs font-semibold text-rose-200 uppercase">Event Conversion Rate</div>
          <div className="mt-2 text-2xl font-black text-white">{event.metrics.conversionRate}%</div>
          <div className="mt-1 text-[11px] text-rose-200/80">Registered → Verified Submission</div>
        </div>
      </div>

      {/* Event Specific Leads Table (Section 18) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Students Tagged to {event.name}
            </h3>
            <p className="text-xs text-slate-500">
              Listing all {eventLeads.length} leads registered via this event's QR code or link
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search lead or ID..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Registered">Registered</option>
              <option value="Started">Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Academic Branch</th>
                <th className="py-3 px-3">Tracking ID</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Progress</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEventLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No student leads match the current filters for this event.
                  </td>
                </tr>
              ) : (
                filteredEventLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div 
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="font-bold text-slate-900 hover:text-rose-600 cursor-pointer"
                      >
                        {lead.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{lead.yearOfStudy}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-mono text-slate-700">{maskEmail(lead.email)}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{maskPhone(lead.phone)}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800">{lead.fieldOfStudy}</div>
                      <div className="text-[10px] text-slate-400">GPA: {lead.currentGpaOrPercentage}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600 font-semibold">
                      {lead.trackingId}
                    </td>
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
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-[11px] transition-colors"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
