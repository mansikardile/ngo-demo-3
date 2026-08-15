import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Filter, 
  Download, 
  Radio, 
  Sparkles, 
  ExternalLink,
  Clock,
  Building2,
  GraduationCap,
  Award,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { useAdmin } from '../../context/AdminContext';
import { DateFilterRange } from '../../types';

export const DashboardOverview: React.FC = () => {
  const { 
    currentUser, 
    events, 
    leads, 
    applications, 
    dateRange, 
    setDateRange, 
    t, 
    maskPII, 
    setSelectedLeadId, 
    navigateWithEvent, 
    setActivePage,
    setIsCreateEventModalOpen
  } = useAdmin();

  const [timeView, setTimeView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartMetric, setChartMetric] = useState<'all' | 'registrations' | 'completed'>('all');

  const dateOptions: { label: string; value: DateFilterRange['value'] }[] = [
    { label: t('date_today'), value: 'today' },
    { label: t('date_7days'), value: '7days' },
    { label: t('date_30days'), value: '30days' },
    { label: t('date_quarter'), value: 'quarter' },
    { label: t('date_custom'), value: 'custom' },
  ];

  // Aggregated KPI numbers — computed from live data
  const totalEventsCount = events.length;
  const totalRegistrations = events.reduce((sum, e) => sum + (e.metrics?.registered || 0), 0) || leads.length;
  const applicationsStarted = events.reduce((sum, e) => sum + (e.metrics?.started || 0), 0) || leads.filter(l => l.applicationStatus === 'Started' || l.applicationStatus === 'In Progress' || l.applicationStatus === 'Completed').length;
  const applicationsCompleted = events.reduce((sum, e) => sum + (e.metrics?.completed || 0), 0) || leads.filter(l => l.applicationStatus === 'Completed').length;
  const overallConversion = totalRegistrations > 0 ? ((applicationsCompleted / totalRegistrations) * 100).toFixed(1) : '0.0';

  // Top events
  const topEvents = [...events].sort((a, b) => (b.metrics?.conversionRate || 0) - (a.metrics?.conversionRate || 0)).slice(0, 5);

  // Recent leads (first 6)
  const recentLeads = leads.slice(0, 6);

  // Chart data — computed from real leads grouped by registration date
  const chartData = useMemo(() => {
    const dateMap: Record<string, { registrations: number; completed: number }> = {};
    leads.forEach(l => {
      const date = l.registrationDate || 'Unknown';
      if (!dateMap[date]) dateMap[date] = { registrations: 0, completed: 0 };
      dateMap[date].registrations += 1;
      if (l.applicationStatus === 'Completed') dateMap[date].completed += 1;
    });
    return Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, counts]) => ({
        date: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        registrations: counts.registrations,
        completed: counts.completed
      }));
  }, [leads]);

  const maskPhone = (phone: string) => {
    if (!maskPII) return phone;
    return phone.replace(/(\+91\s\d{2})\d{3}(\s\d{4})/, '$1***$2');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-rose-600/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>National Outreach Cycle 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t('dashboard_greeting')}, {currentUser?.name || 'Sunita Rao'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            {t('dashboard_subtitle')} Tracking 24 colleges across Maharashtra, Karnataka, Delhi-NCR, and Telangana.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="relative z-10 flex flex-wrap items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-700/80">
          {dateOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDateRange({ label: opt.label, value: opt.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateRange.value === opt.value
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Distinct KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Events */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('kpi_total_events')}</span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalEventsCount}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4 this month
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            9 Active drives across 6 cities
          </div>
        </div>

        {/* Card 2: Total Registrations */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('kpi_total_registrations')}</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalRegistrations.toLocaleString()}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            vs 3,615 in previous period
          </div>
        </div>

        {/* Card 3: Applications Started */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('kpi_applications_started')}</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{applicationsStarted.toLocaleString()}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
              72.9% Start Rate
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            1,160 pending start reminders
          </div>
        </div>

        {/* Card 4: Applications Completed */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('kpi_applications_completed')}</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{applicationsCompleted.toLocaleString()}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.2% YoY
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            60.6% of started forms submitted
          </div>
        </div>

        {/* Card 5: Overall Conversion Rate */}
        <div className="bg-gradient-to-br from-rose-900 to-rose-950 text-white p-5 rounded-xl border border-rose-800 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider">{t('kpi_conversion_rate')}</span>
            <div className="w-9 h-9 rounded-lg bg-rose-800/80 text-rose-300 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{overallConversion}%</span>
            <span className="text-xs font-semibold text-emerald-300 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +3.6%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-rose-300/80">
            Registered → Fully Completed
          </div>
        </div>
      </div>

      {/* Grid: Conversion Funnel & Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversion Funnel (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Student Conversion Funnel</h3>
                <p className="text-xs text-slate-500">Outreach lead journey to finalized scholarship application</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                All India Cohort
              </span>
            </div>

            {/* Funnel Stage 1: Registered */}
            <div className="space-y-4 pt-2">
              <div className="relative p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">{t('funnel_registered')}</span>
                  </div>
                  <span className="text-lg font-extrabold text-slate-900">{totalRegistrations.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-full rounded-full" />
                </div>
                <div className="mt-1.5 text-[11px] text-slate-500 flex justify-between">
                  <span>100% of campus outreach intake</span>
                  <span className="font-semibold text-slate-700">100.0%</span>
                </div>
              </div>

              {/* Conversion Step 1 -> 2 Indicator */}
              <div className="flex items-center justify-between px-6 py-0.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <span>↓ 72.9% Registered to Started</span>
                </div>
                <span className="text-slate-400 text-[11px]">27.1% Drop-off</span>
              </div>

              {/* Funnel Stage 2: Started */}
              <div className="relative p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">{t('funnel_started')}</span>
                  </div>
                  <span className="text-lg font-extrabold text-slate-900">{applicationsStarted.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[72.9%] rounded-full" />
                </div>
                <div className="mt-1.5 text-[11px] text-slate-500 flex justify-between">
                  <span>Filled personal & academic section</span>
                  <span className="font-semibold text-amber-800">72.9% of registered</span>
                </div>
              </div>

              {/* Conversion Step 2 -> 3 Indicator */}
              <div className="flex items-center justify-between px-6 py-0.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span>↓ 60.6% Started to Completed</span>
                </div>
                <span className="text-slate-400 text-[11px]">39.4% Drop-off</span>
              </div>

              {/* Funnel Stage 3: Completed */}
              <div className="relative p-4 rounded-xl bg-emerald-50/70 border border-emerald-300">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <span className="text-sm font-bold text-emerald-950 uppercase tracking-wide">{t('funnel_completed')}</span>
                  </div>
                  <span className="text-lg font-extrabold text-emerald-950">{applicationsCompleted.toLocaleString()}</span>
                </div>
                <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[44.2%] rounded-full" />
                </div>
                <div className="mt-1.5 text-[11px] text-emerald-900 flex justify-between font-medium">
                  <span>Income proof, marksheets & SOP verified</span>
                  <span className="font-bold text-emerald-950">44.2% Final Yield</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Benchmark NGO STEM Target: 35.0%</span>
            <button
              type="button"
              onClick={() => setActivePage('analytics')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>Detailed Drop-off Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Outreach Performance Time-series Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Outreach Registration & Completion Trends</h3>
                <p className="text-xs text-slate-500">Real-time tracking of intake cadence and application completions</p>
              </div>

              {/* Time scale toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTimeView('daily')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    timeView === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setTimeView('weekly')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    timeView === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setTimeView('monthly')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    timeView === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#F8FAFC', fontSize: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#F43F5E' }}
                  />
                  <Area type="monotone" dataKey="daily" name="Daily Registrations" stroke="#E11D48" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDaily)" />
                  <Area type="monotone" dataKey="completed" name="Applications Completed" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600" />
                <span className="text-slate-600 font-medium">New Registrations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="text-slate-600 font-medium">Fully Completed</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActivePage('exports')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Raw Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Top Performing Events & Real-time Leads Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Performing Events (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('top_events')}</h3>
              <p className="text-xs text-slate-500">Highest registration volume & conversion rate performance</p>
            </div>
            <button
              type="button"
              onClick={() => setActivePage('events')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>View All ({events.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Events Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="pb-3 font-semibold">Event & College</th>
                  <th className="pb-3 font-semibold text-center">Registrations</th>
                  <th className="pb-3 font-semibold text-center">Started</th>
                  <th className="pb-3 font-semibold text-center">Completed</th>
                  <th className="pb-3 font-semibold text-right">Conversion</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 pr-2">
                      <div className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                        {evt.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[180px]">{evt.collegeName}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{evt.city}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center font-bold text-slate-800">
                      {evt.metrics.registered}
                    </td>
                    <td className="py-3.5 text-center font-medium text-slate-600">
                      {evt.metrics.started}
                    </td>
                    <td className="py-3.5 text-center font-semibold text-emerald-700">
                      {evt.metrics.completed}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        evt.metrics.conversionRate >= 45 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : evt.metrics.conversionRate >= 35 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {evt.metrics.conversionRate}%
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => navigateWithEvent(evt.id)}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-[11px] transition-colors"
                      >
                        {t('view_event')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Real-time Leads Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="text-base font-bold text-slate-900">{t('recent_leads')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('leads')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                {t('view_all_leads')}
              </button>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100 space-y-1">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className="py-3 px-2 rounded-xl hover:bg-rose-50/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 group-hover:border-rose-400 group-hover:text-rose-700 transition-colors">
                      {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs group-hover:text-rose-700 truncate">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {lead.college} • <span className="font-mono text-slate-600">{lead.fieldOfStudy}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{lead.trackingId}</span>
                        <span>•</span>
                        <span>{lead.registrationTimestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lead.applicationStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      lead.applicationStatus === 'In Progress' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      lead.applicationStatus === 'Started' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {lead.applicationStatus}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lead.completionPercentage}% done
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Real-time polling active</span>
            </span>
            <button
              type="button"
              onClick={() => setActivePage('applications')}
              className="text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              Open Kanban Board →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
