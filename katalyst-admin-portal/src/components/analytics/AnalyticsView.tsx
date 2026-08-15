import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Award, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Calendar,
  Filter
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { mockCollegeTierMetrics, mockDropoffData } from '../../data/mockData';

export const AnalyticsView: React.FC = () => {
  const { events, leads, applications, createExportJob } = useAdmin();
  const [selectedTimeRange, setSelectedTimeRange] = useState('All Time (2026)');

  // Geographic distribution calculation
  const cityCounts = leads.reduce((acc, lead) => {
    acc[lead.city] = (acc[lead.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cityData = Object.entries(cityCounts).map(([name, value]) => ({ name, value }));

  const COLORS = ['#9E1B32', '#0284C7', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  // Time to Complete Analysis Data
  const timeToCompleteData = [
    { range: '< 24 Hours', count: 184, percentage: '38%' },
    { range: '1 - 3 Days', count: 162, percentage: '33%' },
    { range: '4 - 7 Days', count: 96, percentage: '20%' },
    { range: '> 7 Days', count: 44, percentage: '9%' }
  ];

  // Event vs Average Comparison
  const eventComparisonData = events.map(e => ({
    name: e.name.split(' ')[0] + ' ' + (e.name.split(' ')[1] || ''),
    conversion: e.metrics.conversionRate,
    avg: 64.2
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Outreach Analytics & Conversion Insights</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Deep-dive metrics across college tiers, student drop-off bottlenecks, and regional intake trends
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none"
          >
            <option value="All Time (2026)">All Outreach (2026 Batch)</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Q3 2026">Q3 Campus Drive</option>
          </select>

          <button
            type="button"
            onClick={() => createExportJob({
              eventName: 'Outreach Analytics Report',
              dateRange: selectedTimeRange,
              format: 'PDF',
              selectedFields: ['Metrics Summary', 'College Tiers', 'Drop-off Analysis', 'Time-to-complete']
            })}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Strategic Insight Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-rose-50 to-white p-4 rounded-xl border border-rose-200 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-900 uppercase">Top Converting College</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">COEP Tech, Pune (81.4%)</div>
            <p className="text-[11px] text-slate-600 mt-1">
              Highest lead-to-submission conversion driven by active Women-in-Tech faculty mentorship.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-200 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase">Median Completion Velocity</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">38.4 Hours from QR Scan</div>
            <p className="text-[11px] text-slate-600 mt-1">
              71% of applicants complete full document verification within 3 days of outreach drive.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 uppercase">Primary Drop-off Stage</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">Income Certificate Upload (18.2%)</div>
            <p className="text-[11px] text-slate-600 mt-1">
              Students from Tier 3 colleges frequently delay due to pending Tehsildar income certificates.
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: College Tier Performance & Funnel Drop-off */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Comparisons */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Conversion Rate by College Tier</h3>
            <p className="text-xs text-slate-500">
              Comparing student throughput across Tier 1, Tier 2, and Tier 3 institutions
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCollegeTierMetrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="tier" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit="%" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Conversion Rate']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="conversionRate" fill="#9E1B32" radius={[4, 4, 0, 0]} name="Conversion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            {mockCollegeTierMetrics.map(t => (
              <div key={t.tier} className="p-2 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-400 font-semibold">{t.tier}</div>
                <div className="font-bold text-slate-800">{t.completed} / {t.registered}</div>
                <div className="text-[11px] text-rose-700 font-extrabold">{t.conversionRate}% Conv</div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel Drop-off Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Student Journey Drop-off Funnel</h3>
            <p className="text-xs text-slate-500">
              Quantifying student progression and attrition at each application phase
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {mockDropoffData.map((item, idx) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{item.stage}</span>
                  </span>
                  <span className="font-bold text-slate-900">{item.count} students ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      idx === 0 ? 'bg-slate-700' :
                      idx === 1 ? 'bg-blue-600' :
                      idx === 2 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                {item.dropOff > 0 && (
                  <div className="text-[10px] text-rose-600 text-right font-semibold">
                    ↓ -{item.dropOff} drop-off from previous step
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Event Conversion vs Average & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event vs Average */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Event Conversion vs. Katalyst Benchmark (64.2%)</h3>
            <p className="text-xs text-slate-500">
              Identifying high-performing college drives vs. events requiring follow-up interventions
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventComparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit="%" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="conversion" fill="#9E1B32" name="Event Conversion %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg" fill="#CBD5E1" name="Katalyst Avg Benchmark" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Leads by City / Region</h3>
            <p className="text-xs text-slate-500">Geographic footprint of outreach</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} leads`, 'Students']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {cityData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
                />
                <span className="text-slate-700 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
