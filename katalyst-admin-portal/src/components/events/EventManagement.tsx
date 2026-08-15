import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  MapPin, 
  QrCode, 
  Share2, 
  Download, 
  Eye, 
  MoreVertical, 
  ExternalLink,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { EventStatus, EventType, OutreachEvent } from '../../types';

export const EventManagement: React.FC = () => {
  const { 
    events, 
    setIsCreateEventModalOpen, 
    navigateWithEvent, 
    setActiveQrEvent, 
    setIsQrModalOpen, 
    createExportJob,
    updateEventStatus
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const cities = ['All', ...Array.from(new Set(events.map(e => e.city)))];
  const types = ['All', 'Engineering Outreach', 'Women in Tech', 'Polytechnic STEM', 'General STEM'];
  const statusTabs: ('All' | EventStatus)[] = ['All', 'Active', 'Upcoming', 'Completed', 'Archived'];

  // Filtered Events
  const filteredEvents = events.filter(evt => {
    const matchesSearch = 
      evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.eventCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || evt.status === selectedStatus;
    const matchesType = selectedType === 'All' || evt.eventType === selectedType;
    const matchesCity = selectedCity === 'All' || evt.city === selectedCity;

    return matchesSearch && matchesStatus && matchesType && matchesCity;
  });

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Archived':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Outreach Events Management</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, track, and manage college registration drives, QR codes, and intake metrics
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateEventModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-900/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 custom-scrollbar">
        {statusTabs.map((tab) => {
          const count = tab === 'All' ? events.length : events.filter(e => e.status === tab).length;
          const isActive = selectedStatus === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedStatus(tab)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
                isActive
                  ? 'border-rose-600 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Dropdown Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search event name, college, city, or event code..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* City Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-rose-500"
            >
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Category:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-rose-500"
            >
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {(searchTerm || selectedStatus !== 'All' || selectedType !== 'All' || selectedCity !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('All');
                setSelectedType('All');
                setSelectedCity('All');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Desktop / Tablet Table (Hidden on Mobile) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Event Details</th>
                <th className="py-3.5 px-3">Date & Schedule</th>
                <th className="py-3.5 px-3 text-center">Registrations</th>
                <th className="py-3.5 px-3 text-center">Started</th>
                <th className="py-3.5 px-3 text-center">Completed</th>
                <th className="py-3.5 px-3 text-center">Conversion</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <div className="font-semibold text-slate-600">No events found</div>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters or search terms</p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Event & College */}
                    <td className="py-4 px-4">
                      <div 
                        onClick={() => navigateWithEvent(evt.id)}
                        className="font-bold text-slate-900 text-sm group-hover:text-rose-600 cursor-pointer transition-colors"
                      >
                        {evt.name}
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{evt.collegeName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 font-mono text-[10px]">
                        <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
                          {evt.eventCode}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{evt.city}, {evt.state}</span>
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-4 px-3">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{evt.startTime} - {evt.endTime}</span>
                      </div>
                    </td>

                    {/* Registrations */}
                    <td className="py-4 px-3 text-center">
                      <span className="text-sm font-extrabold text-slate-900">{evt.metrics.registered}</span>
                      <div className="text-[10px] text-slate-400">Target: {evt.metrics.targetRegistrations}</div>
                    </td>

                    {/* Started */}
                    <td className="py-4 px-3 text-center">
                      <span className="font-semibold text-slate-800">{evt.metrics.started}</span>
                      <div className="text-[10px] text-slate-400">
                        {evt.metrics.registered > 0 ? Math.round((evt.metrics.started / evt.metrics.registered) * 100) : 0}%
                      </div>
                    </td>

                    {/* Completed */}
                    <td className="py-4 px-3 text-center">
                      <span className="font-bold text-emerald-700">{evt.metrics.completed}</span>
                      <div className="text-[10px] text-emerald-600 font-medium">
                        {evt.metrics.started > 0 ? Math.round((evt.metrics.completed / evt.metrics.started) * 100) : 0}% of started
                      </div>
                    </td>

                    {/* Conversion */}
                    <td className="py-4 px-3 text-center">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-xs bg-slate-100 text-slate-800">
                        {evt.metrics.conversionRate}%
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusBadge(evt.status)}`}>
                        {evt.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveQrEvent(evt);
                            setIsQrModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 transition-colors"
                          title="View QR Code & Links"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigateWithEvent(evt.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout (Section 36) */}
      <div className="md:hidden space-y-4">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border mb-1 ${getStatusBadge(evt.status)}`}>
                  {evt.status}
                </span>
                <h4 
                  onClick={() => navigateWithEvent(evt.id)}
                  className="font-bold text-slate-900 text-sm cursor-pointer hover:text-rose-600"
                >
                  {evt.name}
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  {evt.collegeName} • {evt.city}
                </div>
              </div>
              <span className="font-mono text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded shrink-0">
                {evt.eventCode}
              </span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Reg</div>
                <div className="font-bold text-slate-900">{evt.metrics.registered}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Start</div>
                <div className="font-bold text-slate-700">{evt.metrics.started}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Done</div>
                <div className="font-bold text-emerald-700">{evt.metrics.completed}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Rate</div>
                <div className="font-bold text-rose-700">{evt.metrics.conversionRate}%</div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="text-[11px] text-slate-500">
                {evt.date} • {evt.startTime}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveQrEvent(evt);
                    setIsQrModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateWithEvent(evt.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
