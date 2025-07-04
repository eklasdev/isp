
import React, { useMemo } from 'react';
import type { ProcessedSession } from '../types.ts';
import { formatDataSize } from '../helpers.ts';

interface UsageHeatmapProps {
  sessions: ProcessedSession[];
}

const format12Hour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
};

export const UsageHeatmap: React.FC<UsageHeatmapProps> = ({ sessions }) => {
  const hourlyData = useMemo(() => {
    const dataByHour: number[] = Array(24).fill(0);

    sessions.forEach(session => {
        const start = session.startDate;
        const end = session.endDate ?? new Date(); // Use now for active sessions
        const durationMillis = end.getTime() - start.getTime();
        
        if (durationMillis <= 0) return;

        const usagePerMilli = session.totalMB / durationMillis;

        // Iterate through each hour the session spans
        let cursor = start.getTime();
        while(cursor < end.getTime()) {
            const currentHour = new Date(cursor).getHours();
            const nextHourTime = new Date(cursor);
            nextHourTime.setHours(currentHour + 1, 0, 0, 0);
            
            const chunkEnd = Math.min(end.getTime(), nextHourTime.getTime());
            const chunkDuration = chunkEnd - cursor;

            dataByHour[currentHour] += chunkDuration * usagePerMilli;
            cursor = chunkEnd;
        }
    });

    const maxUsage = Math.max(...dataByHour, 0);

    return dataByHour.map((usage) => ({
      usage,
      intensity: maxUsage > 0 ? usage / maxUsage : 0,
    }));
  }, [sessions]);

  if (sessions.length === 0) {
      return <div className="flex items-center justify-center h-full text-slate-500">Not enough data for heatmap.</div>
  }

  return (
    <div className="flex flex-col" style={{height: '300px'}}>
      <div className="grid grid-cols-6 grid-rows-4 gap-2 flex-grow">
        {hourlyData.map(({ usage, intensity }, hour) => (
          <div key={hour} className="relative group bg-slate-100 rounded-md flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-indigo-500 rounded-md transition-opacity duration-300"
              style={{ opacity: intensity }}
            ></div>
            <span className="relative text-sm font-medium text-slate-700 group-hover:text-white transition-colors">{format12Hour(hour)}</span>
            <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {formatDataSize(usage)}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-xs text-slate-500 mt-2 px-1">
        <span>Less</span>
        <div className="flex items-center gap-1" aria-hidden="true">
            <div className="w-3 h-3 rounded-sm bg-indigo-500 opacity-20"></div>
            <div className="w-3 h-3 rounded-sm bg-indigo-500 opacity-40"></div>
            <div className="w-3 h-3 rounded-sm bg-indigo-500 opacity-60"></div>
            <div className="w-3 h-3 rounded-sm bg-indigo-500 opacity-80"></div>
            <div className="w-3 h-3 rounded-sm bg-indigo-500 opacity-100"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
