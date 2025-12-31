"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePatients } from '@/hooks/use-patients';
import { Link } from 'wouter';

const data = [
  { name: 'Mon', scans: 4 },
  { name: 'Tue', scans: 7 },
  { name: 'Wed', scans: 5 },
  { name: 'Thu', scans: 12 },
  { name: 'Fri', scans: 8 },
  { name: 'Sat', scans: 3 },
  { name: 'Sun', scans: 0 },
];

export default function Dashboard() {
  const { data: patients, isLoading } = usePatients();

  // Simple Mock Stats
  const totalPatients = patients.length;
  const highRisk = patients.filter(p => p.riskProfile === "High").length;
  const scansToday = 8;
  const pendingReviews = 3;

  return (
    <DashboardLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Patients" 
          value={isLoading ? "..." : totalPatients.toString()} 
          icon={Users} 
          trend="+12% from last month"
          color="blue"
        />
        <StatsCard 
          title="High Risk Cases" 
          value={isLoading ? "..." : highRisk.toString()} 
          icon={AlertCircle} 
          trend="Requires attention"
          color="red"
          alert
        />
        <StatsCard 
          title="Scans Today" 
          value={scansToday.toString()} 
          icon={Activity} 
          trend="4 more than avg"
          color="green"
        />
        <StatsCard 
          title="Pending Reviews" 
          value={pendingReviews.toString()} 
          icon={CheckCircle} 
          trend="Cleared 5 today"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Scan Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="scans" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-slate-400 text-sm">Loading patients...</div>
              ) : (
                patients.slice(0, 4).map((patient) => (
                  <Link href={`/patients/${patient.id}`} key={patient.id}>
                    <div className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm
                        ${patient.riskProfile === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                      `}>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{patient.name}</p>
                        <p className="text-xs text-slate-500">Last visit: {new Date(patient.lastVisit!).toLocaleDateString()}</p>
                      </div>
                      {patient.riskProfile === 'High' && (
                        <div className="h-2 w-2 rounded-full bg-red-500" title="High Risk" />
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
            <Link href="/patients">
              <div className="mt-4 w-full py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer border-t border-slate-100 pt-4">
                View All Patients
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatsCard({ title, value, icon: Icon, trend, color, alert }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <Card className={`border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md ${alert ? 'border-l-4 border-l-red-500' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs">
          <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
          <span className="text-emerald-600 font-medium">{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}
