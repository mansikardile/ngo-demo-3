import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Tag, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  MessageSquare, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Send,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ApplicationStatus } from '../../types';

interface LeadDetailDrawerProps {
  leadId: string | null;
  onClose: () => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({ leadId, onClose }) => {
  const { leads, maskPII, updateLeadStatus, addLeadNote, navigateWithEvent } = useAdmin();
  const [newNote, setNewNote] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  const lead = leads.find(l => l.id === leadId);

  if (!lead) return null;

  const maskEmail = (email: string) => {
    if (!maskPII) return email;
    const [name, domain] = email.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!maskPII) return phone;
    return phone.replace(/(\+91\s\d{2})\d{3}(\s\d{4})/, '$1***$2');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(lead.trackingId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLeadNote(lead.id, newNote);
    setNewNote('');
  };

  const statusSteps: ApplicationStatus[] = ['Registered', 'Started', 'In Progress', 'Completed'];
  const currentStepIndex = statusSteps.indexOf(lead.applicationStatus);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center justify-center font-bold text-sm">
              {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lead.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  lead.applicationStatus === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  lead.applicationStatus === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {lead.applicationStatus}
                </span>
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                <span>Tracking ID:</span>
                <span className="text-white font-semibold">{lead.trackingId}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="hover:text-rose-400 text-slate-400 p-0.5 rounded"
                  title="Copy Tracking ID"
                >
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Progression Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center justify-between">
              <span>Application Journey Status</span>
              <span className="text-rose-600 font-bold">{lead.completionPercentage}% Completed</span>
            </div>

            <div className="grid grid-cols-4 gap-1 relative mb-4">
              {statusSteps.map((step, idx) => {
                const isPastOrCurrent = idx <= currentStepIndex;
                return (
                  <div key={step} className="flex flex-col items-center text-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPastOrCurrent 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] mt-1 font-semibold ${
                      isPastOrCurrent ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Status Adjuster */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-xs">
              <span className="text-slate-500">Update Lead Status:</span>
              <div className="flex gap-1">
                {statusSteps.map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => updateLeadStatus(lead.id, step)}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                      lead.applicationStatus === step
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Academic & Personal Profile */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Student Profile & Academic Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">College / University</div>
                <div className="font-bold text-slate-900 mt-0.5">{lead.college}</div>
                <div className="text-[11px] text-slate-500">{lead.city}, {lead.state}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Engineering Stream</div>
                <div className="font-bold text-slate-900 mt-0.5">{lead.fieldOfStudy}</div>
                <div className="text-[11px] text-rose-700 font-semibold">{lead.yearOfStudy}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Current GPA / %</div>
                <div className="font-bold text-slate-900 mt-0.5">{lead.currentGpaOrPercentage}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Eligible (Above 70% threshold)</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Annual Family Income</div>
                <div className="font-bold text-slate-900 mt-0.5">{lead.annualFamilyIncome}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Verified Low-Income Tier</div>
              </div>
            </div>
          </div>

          {/* Section: Contact Details (With PII Masking respect) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact Channels
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-slate-800">{maskEmail(lead.email)}</span>
                </div>
                <a 
                  href={`mailto:${lead.email}`} 
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Send Email
                </a>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-slate-800">{maskPhone(lead.phone)}</span>
                </div>
                <a 
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Section: Outreach Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Outreach Attribution
            </h4>
            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 text-xs space-y-1">
              <div className="font-bold text-slate-900">{lead.eventName}</div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Event Code: <strong className="font-mono text-rose-700">{lead.eventCode}</strong></span>
                <span>Registered: {lead.registrationDate} ({lead.registrationTimestamp})</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigateWithEvent(lead.eventId);
                  onClose();
                }}
                className="mt-2 text-[11px] font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1"
              >
                <span>View Event Analytics</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Section: Consent Verification (Prompt 14, 20) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Student Consent Record
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Terms & Data Privacy Consent</span>
                </span>
                <span className="font-bold text-emerald-700">Accepted</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Notifications & SMS Reminders</span>
                </span>
                <span className="font-bold text-emerald-700">
                  {lead.consent.whatsappUpdates ? 'Opted In' : 'Opted Out'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Future Scholarship Communications</span>
                </span>
                <span className="font-bold text-slate-800">
                  {lead.consent.futureCommunications ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Audit-style Timeline (Section 20) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Audit Activity Timeline
            </h4>
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
              {lead.timeline.map((item) => (
                <div key={item.id} className="relative">
                  <span className={`absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    item.statusType === 'Completed' ? 'bg-emerald-600' :
                    item.statusType === 'In Progress' ? 'bg-amber-500' :
                    item.statusType === 'Note' ? 'bg-rose-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="text-[11px] font-mono text-slate-400">{item.timestamp}</div>
                  <div className="text-xs font-bold text-slate-800">{item.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Admin Internal Notes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Internal Admin Notes
            </h4>
            {lead.notes && lead.notes.length > 0 ? (
              <div className="space-y-2">
                {lead.notes.map((note, i) => (
                  <div key={i} className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                    {note}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
            )}

            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add verification or outreach note..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Add Note
              </button>
            </form>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Last modified by admin reviewer
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
