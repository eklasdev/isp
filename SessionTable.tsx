
import React from 'react';
import type { ProcessedSession } from '../types.ts';
import { formatDataSize, formatDuration } from '../utils/helpers.ts';

interface SessionTableProps {
  sessions: ProcessedSession[];
}

const TableHeader: React.FC = () => (
    <thead>
        <tr className="bg-slate-50">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Connection Time</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Upload</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Download</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Usage</th>
        </tr>
    </thead>
);

const TableRow: React.FC<{ session: ProcessedSession }> = ({ session }) => (
    <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{session.startDate.toLocaleString()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDuration(session.durationSeconds)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDataSize(session.uploadMB)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDataSize(session.downloadMB)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{formatDataSize(session.totalMB)}</td>
    </tr>
);


export const SessionTable: React.FC<SessionTableProps> = ({ sessions }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Sessions</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <TableHeader />
                <tbody className="bg-white divide-y divide-slate-100">
                    {sessions.slice(0, 10).map((session, index) => (
                        <TableRow key={index} session={session} />
                    ))}
                </tbody>
            </table>
            {sessions.length === 0 && <div className="text-center py-8 text-slate-500">No sessions recorded.</div>}
        </div>
    </div>
  );
};