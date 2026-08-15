import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Users, 
  ShieldCheck, 
  Plus, 
  Lock, 
  Eye, 
  EyeOff, 
  Clock, 
  Check, 
  Sliders, 
  Key,
  X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminUser, AdminRole } from '../../types';

export const SettingsIntegrations: React.FC = () => {
  const { 
    googleSheetsSync, 
    syncGoogleSheets, 
    teamMembers, 
    addTeamMember, 
    maskPII, 
    setMaskPII, 
    currentUser 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'integrations' | 'team' | 'security'>('integrations');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Add Member Modal
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<AdminRole>('Outreach Lead');
  const [newMemberCity, setNewMemberCity] = useState('Pune');

  // Trigger Google Sheets Mock Sync
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncFeedback('Initiating secure handshake with Google Drive API...');

    setTimeout(() => {
      syncGoogleSheets();
      setIsSyncing(false);
      setSyncFeedback('Synchronized 18 new student leads to Google Sheet successfully.');
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1200);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    addTeamMember({
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      city: newMemberCity
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setIsAddMemberOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Settings & System Integrations</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage Google Workspace automation, team roles, and student PII privacy governance
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'integrations'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Google Sheets & Webhooks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'team'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team & Role Permissions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'security'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy & PII Governance</span>
        </button>
      </div>

      {/* TAB 1: GOOGLE SHEETS INTEGRATION (Section 31) */}
      {activeTab === 'integrations' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Status & Sync Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Google Sheets Live Data Pipeline</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{googleSheetsSync.connected ? 'Active & Connected' : 'Disconnected'}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bidirectional synchronization of student registrations and verification audits
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerSync}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>

            {syncFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{syncFeedback}</span>
              </div>
            )}

            {/* Config metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Connected Spreadsheet</div>
                <a 
                  href={googleSheetsSync.spreadsheetUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-bold text-slate-900 hover:text-rose-600 flex items-center gap-1 mt-0.5"
                >
                  <span className="truncate">{googleSheetsSync.sheetName}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Sync Cadence</div>
                <div className="font-bold text-slate-900 mt-0.5">{googleSheetsSync.syncFrequency} (Triggered on Registration)</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Last Successful Push</div>
                <div className="font-mono text-slate-700 mt-0.5">{googleSheetsSync.lastSynced}</div>
              </div>
            </div>

            {/* Field Mapping Table */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Outreach Lead Field Mapping
              </h4>
              <div className="bg-slate-50/70 rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Lead Schema Attribute</th>
                      <th className="py-2.5 px-3">Target Google Sheet Column</th>
                      <th className="py-2.5 px-3 text-center">Data Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {googleSheetsSync.fieldMapping.map((map, idx) => (
                      <tr key={idx} className="hover:bg-white transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-800">{map.leadField}</td>
                        <td className="py-2 px-3 font-mono text-rose-700 font-bold">{map.sheetColumn}</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono text-[10px]">{map.dataType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sync History Table (Section 31) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Sync Executions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3 text-center">Records Synchronized</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3">Trigger Mechanism</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {googleSheetsSync.syncHistory.map((hist) => (
                    <tr key={hist.id}>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{hist.timestamp}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">{hist.recordsPushed}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{hist.status}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{hist.triggeredBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEAM & ROLE PERMISSIONS (Section 32) */}
      {activeTab === 'team' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Katalyst Operations & Outreach Team</h3>
                <p className="text-xs text-slate-500">Manage administrator access levels and regional permissions</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Invite Team Member</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-3">Team Member</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Regional Chapter</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={member.avatarUrl} 
                            alt={member.name} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                          />
                          <div>
                            <div className="font-bold text-slate-900">{member.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{member.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          member.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                          member.role === 'Outreach Lead' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {member.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-700 font-medium">
                        {member.city || 'National'}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors"
                        >
                          Edit Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY & PII GOVERNANCE (Section 33) */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student PII Privacy Safeguards</h3>
              <p className="text-xs text-slate-500">
                Ensure compliance with Digital Personal Data Protection (DPDP) Act and student confidentiality
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Global PII Masking in UI Viewers</span>
                </div>
                <p className="text-xs text-slate-500">
                  Automatically masks email addresses (pr***@coep.ac.in) and phone numbers (+91 98*** 56789) across public dashboards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMaskPII(!maskPII)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  maskPII 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {maskPII ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{maskPII ? 'PII Masking Active' : 'Masking Disabled'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Invite Team Administrator</h3>
              <button type="button" onClick={() => setIsAddMemberOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Pooja Kulkarni"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="pooja.k@katalystindia.org"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as AdminRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-rose-500"
                >
                  <option value="Outreach Lead">Outreach Lead</option>
                  <option value="Reviewer">Reviewer / Verification Officer</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  value={newMemberCity}
                  onChange={(e) => setNewMemberCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-3 py-1.5 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
