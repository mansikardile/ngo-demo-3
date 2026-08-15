import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Copy, 
  Check, 
  QrCode, 
  Download, 
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { EventType, OutreachEvent } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { createEvent, navigateWithEvent, setActiveQrEvent, setIsQrModalOpen } = useAdmin();

  // Form State
  const [name, setName] = useState('Cummins College of Engineering STEM Drive');
  const [collegeName, setCollegeName] = useState('MKSSS Cummins College of Engineering for Women');
  const [collegeTier, setCollegeTier] = useState<'Tier 1' | 'Tier 2' | 'Tier 3'>('Tier 1');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [location, setLocation] = useState('Karve Nagar');
  const [venue, setVenue] = useState('Mech Dept Auditorium');
  const [date, setDate] = useState('2026-08-28');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('01:30 PM');
  const [eventType, setEventType] = useState<EventType>('Women in Tech');
  const [description, setDescription] = useState('Flagship Katalyst scholarship enrollment drive for 1st and 2nd year women engineering students.');
  const [targetRegistrations, setTargetRegistrations] = useState(350);

  // Contact Person
  const [contactName, setContactName] = useState('Dr. Madhuri Joshi');
  const [contactRole, setContactRole] = useState('Dean of Student Affairs');
  const [contactPhone, setContactPhone] = useState('+91 98220 12345');
  const [contactEmail, setContactEmail] = useState('m.joshi@cumminscollege.in');

  // Success Step State
  const [createdEvent, setCreatedEvent] = useState<OutreachEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newEvt = createEvent({
        name,
        collegeName,
        collegeTier,
        city,
        state,
        location,
        venue,
        date,
        startTime,
        endTime,
        eventType,
        description,
        metrics: {
          registered: 0,
          started: 0,
          completed: 0,
          conversionRate: 0,
          targetRegistrations: Number(targetRegistrations) || 300,
        },
        contactPerson: {
          name: contactName,
          role: contactRole,
          phone: contactPhone,
          email: contactEmail,
        }
      });
      setIsSubmitting(false);
      setCreatedEvent(newEvt);
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCloseAll = () => {
    setCreatedEvent(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {createdEvent ? 'Event Created Successfully' : 'Create New Outreach Event'}
              </h3>
              <p className="text-xs text-slate-400">
                {createdEvent ? 'Ready for student outreach registration' : 'Generate unique event ID, QR code & shareable link'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {createdEvent ? (
          /* SECTION 14: SUCCESS PAGE */
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900">{createdEvent.name}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {createdEvent.collegeName} • {createdEvent.city}, {createdEvent.state}
              </p>
              <div className="inline-block mt-2 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-mono font-bold">
                ID: {createdEvent.eventCode}
              </div>
            </div>

            {/* QR Code Banner */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto space-y-3">
              <div className="w-36 h-36 bg-slate-900 p-2 rounded-xl mx-auto flex items-center justify-center text-white">
                <QrCode className="w-28 h-28 text-white" />
              </div>
              <div className="text-xs font-semibold text-slate-800">
                Students can scan this QR code to register for this event.
              </div>
              <div className="text-[11px] text-slate-500 font-mono break-all">
                {createdEvent.registrationUrl}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCopy(createdEvent.registrationUrl)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveQrEvent(createdEvent);
                  setIsQrModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Printable QR</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigateWithEvent(createdEvent.id);
                  handleCloseAll();
                }}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>View Event Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* SECTION 13: EVENT CREATION FORM */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
            {/* Section 1: Event Details */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 pb-1 border-b border-rose-100">
                <Tag className="w-3.5 h-3.5" />
                <span>1. Event Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. COEP Tech Campus Outreach"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Category *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Engineering Outreach">Engineering Outreach</option>
                    <option value="Women in Tech">Women in Tech</option>
                    <option value="Polytechnic STEM">Polytechnic STEM</option>
                    <option value="General STEM">General STEM</option>
                    <option value="Campus Seminar">Campus Seminar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Registration Capacity
                  </label>
                  <input
                    type="number"
                    value={targetRegistrations}
                    onChange={(e) => setTargetRegistrations(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: College Information */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 pb-1 border-b border-rose-100">
                <Building2 className="w-3.5 h-3.5" />
                <span>2. College Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College Tier
                  </label>
                  <select
                    value={collegeTier}
                    onChange={(e) => setCollegeTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Tier 1">Tier 1 (Premier)</option>
                    <option value="Tier 2">Tier 2 (State Govt/Autonomous)</option>
                    <option value="Tier 3">Tier 3 (Regional)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Location / Area
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Schedule & Venue */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 pb-1 border-b border-rose-100">
                <Calendar className="w-3.5 h-3.5" />
                <span>3. Event Schedule & Venue</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Venue / Hall Name
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Auditorium Hall A, Main Block"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Contact Person */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 pb-1 border-b border-rose-100">
                <User className="w-3.5 h-3.5" />
                <span>4. College Coordinator / Contact Person</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer Form CTA */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-900/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Generating Event ID & QR...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-rose-200" />
                    <span>Create Event & Generate QR</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
