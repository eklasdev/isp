
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ProcessedSession } from '../types.ts';
import { formatDataSize } from '../helpers.ts';

interface UsageChartProps {
  sessions: ProcessedSession[];
}

export const UsageChart: React.FC<UsageChartProps> = ({ sessions }) => {
  const chartData = useMemo(() => {
    const dailyData: { [key: string]: { date: string; upload: number; download: number; total: number } } = {};

    sessions.forEach(session => {
      const dateKey = session.startDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, upload: 0, download: 0, total: 0 };
      }
      dailyData[dateKey].upload += session.uploadMB;
      dailyData[dateKey].download += session.downloadMB;
      dailyData[dateKey].total += session.totalMB;
    });

    return Object.values(dailyData).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(d => ({
            ...d,
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
  }, [sessions]);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">No usage data to display.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
        <YAxis tick={{ fontSize: 12 }} stroke="#64748b" tickFormatter={(value) => `${value.toFixed(0)}`} />
        <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
            formatter={(value: number, name: string) => [formatDataSize(value), name.charAt(0).toUpperCase() + name.slice(1)]}
        />
        <Legend wrapperStyle={{ fontSize: '14px' }}/>
        <Line type="monotone" dataKey="download" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 8 }} name="Download"/>
        <Line type="monotone" dataKey="upload" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 8 }} name="Upload" />
      </LineChart>
    </ResponsiveContainer>
  );
};
