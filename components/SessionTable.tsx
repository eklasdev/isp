
import React, { useState, useEffect, useMemo } from 'react';
import type { ProcessedSession } from '../types.ts';
import { formatDataSize, formatDuration } from '../helpers.ts';

interface SessionTableProps {
  sessions: ProcessedSession[];
}

const Tag: React.FC<{ tag: string }> = ({ tag }) => {
    const tagStyles: { [key: string]: string } = {
        'Active': 'bg-green-100 text-green-800 animate-pulse',
        'Heavy Download': 'bg-blue-100 text-blue-800',
        'Heavy Upload': 'bg-indigo-100 text-indigo-800',
        'Long Session': 'bg-purple-100 text-purple-800',
        'Short Session': 'bg-yellow-100 text-yellow-800',
        'Idle': 'bg-gray-100 text-gray-800',
    };
    return (
        <span title={tag} className={`px-2 py-0.5 text-xs font-medium rounded-full ${tagStyles[tag] || 'bg-slate-100 text-slate-800'}`}>
            {tag}
        </span>
    );
};

const ActiveTableRow: React.FC<{ session: ProcessedSession }> = ({ session }) => {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const updateDuration = () => {
            setDuration((new Date().getTime() - session.startDate.getTime()) / 1000);
        }
        updateDuration();
        const interval = setInterval(updateDuration, 1000);
        return () => clearInterval(interval);
    }, [session.startDate]);

    const showNoData = session.uploadMB === 0 && session.downloadMB === 0;

    const allTags = useMemo(() => {
        const dynamicTags = ['Active'];
        if (session.totalMB < 1 && duration > 600) { // Idle if low data for 10+ mins
            dynamicTags.push('Idle');
        }
        return [...new Set([...session.tags, ...dynamicTags])];
    }, [session.tags, duration, session.totalMB]);

    return (
        <tr className="bg-sky-50 border-b border-sky-200 hover:bg-sky-100/50 transition-colors duration-300">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{session.startDate.toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">Active</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">{formatDuration(duration)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{showNoData ? 'Live' : formatDataSize(session.uploadMB)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{showNoData ? 'Live' : formatDataSize(session.downloadMB)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{showNoData ? 'Live' : formatDataSize(session.totalMB)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <div className="flex flex-wrap gap-1">
                    {allTags.map(tag => <Tag key={tag} tag={tag} />)}
                </div>
            </td>
        </tr>
    );
};

const TableHeader: React.FC = () => (
    <thead>
        <tr className="bg-slate-50">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Connection Time</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Disconnection Time</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Upload</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Download</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Usage</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tags</th>
        </tr>
    </thead>
);

const TableRow: React.FC<{ session: ProcessedSession }> = ({ session }) => (
    <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{session.startDate.toLocaleString()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{session.endDate ? session.endDate.toLocaleString() : 'N/A'}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDuration(session.durationSeconds)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDataSize(session.uploadMB)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDataSize(session.downloadMB)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{formatDataSize(session.totalMB)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
            <div className="flex flex-wrap gap-1">
                {session.tags.map(tag => <Tag key={tag} tag={tag} />)}
            </div>
        </td>
    </tr>
);


export const SessionTable: React.FC<SessionTableProps> = ({ sessions }) => {
  const activeSession = sessions.length > 0 && sessions[0].endDate === null ? sessions[0] : null;
  const historicSessions = activeSession ? sessions.slice(1) : sessions;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Sessions</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <TableHeader />
                <tbody className="bg-white divide-y divide-slate-100">
                    {activeSession && <ActiveTableRow session={activeSession} />}
                    {historicSessions.slice(0, 10).map((session, index) => (
                        <TableRow key={index} session={session} />
                    ))}
                </tbody>
            </table>
            {sessions.length === 0 && <div className="text-center py-8 text-slate-500">No sessions recorded.</div>}
        </div>
    </div>
  );
};
