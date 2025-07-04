
import React, { useMemo } from 'react';
import type { UserData, ProcessedSession } from './types.ts';
import { processUsageHistory } from './helpers.ts';
import { UserInfoCard } from './UserInfoCard.tsx';
import { MetricCard } from './MetricCard.tsx';
import { UsageChart } from './UsageChart.tsx';
import { SessionTable } from './SessionTable.tsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DashboardProps {
  data: UserData;
}

const COLORS = ['#0ea5e9', '#6366f1']; // sky-500, indigo-500

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const processedSessions = useMemo(() => processUsageHistory(data.usageHistory), [data.usageHistory]);
  
  const totalUpload = useMemo(() => processedSessions.reduce((sum, s) => sum + s.uploadMB, 0), [processedSessions]);
  const totalDownload = useMemo(() => processedSessions.reduce((sum, s) => sum + s.downloadMB, 0), [processedSessions]);
  const totalUsage = totalUpload + totalDownload;
  const totalBillPaid = useMemo(() => data.paymentHistory.reduce((sum, p) => sum + parseFloat(p.receivedAmount), 0), [data.paymentHistory]);
  const lastPaymentDate = useMemo(() => data.paymentHistory.length > 0 ? new Date(data.paymentHistory[0].payDate).toLocaleDateString() : 'N/A', [data.paymentHistory]);
  
  const totalSessions = processedSessions.length;
  
  const lastLinkUp = processedSessions.length > 0 
    ? processedSessions[0].startDate.toLocaleString() 
    : 'N/A';
  
  const lastDisconnectedSession = processedSessions.find(s => s.endDate !== null);
  const lastLinkDown = lastDisconnectedSession 
    ? lastDisconnectedSession.endDate?.toLocaleString() ?? 'N/A'
    : 'N/A';

  const pieData = [
      { name: 'Total Upload', value: totalUpload },
      { name: 'Total Download', value: totalDownload },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UserInfoCard
            userInfo={data.userInfo}
            totalBillPaid={totalBillPaid}
            lastPaymentDate={lastPaymentDate}
            totalSessions={totalSessions}
            lastLinkUp={lastLinkUp}
            lastLinkDown={lastLinkDown}
          />
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
          <MetricCard title="Total Bill Paid" value={`${totalBillPaid.toFixed(2)} BDT`} />
          <MetricCard title="Last Payment Date" value={lastPaymentDate} />
          <MetricCard title="Total Sessions" value={totalSessions.toString()} />
          <MetricCard title="Total Usage" value={`${(totalUsage / 1024).toFixed(2)} GB`} />
          <MetricCard title="Total Upload" value={`${(totalUpload / 1024).toFixed(2)} GB`} />
          <MetricCard title="Total Download" value={`${(totalDownload / 1024).toFixed(2)} GB`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Usage Trend (MB)</h3>
            <UsageChart sessions={processedSessions} />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload vs. Download</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${(value / 1024).toFixed(2)} GB`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <SessionTable sessions={processedSessions} />
      </div>
    </div>
  );
};
