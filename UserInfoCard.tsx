
import React from 'react';
import type { UserInfo } from './types.ts';
import { getDaysLeft } from './helpers.ts';

interface UserInfoCardProps {
  userInfo: UserInfo;
  totalBillPaid: number;
  lastPaymentDate: string;
  totalSessions: number;
  lastLinkUp: string;
  lastLinkDown: string;
}

const UserInfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-sm font-semibold text-slate-800 text-right">{value}</span>
    </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const isOnline = status.toLowerCase() === 'online';
    const isActive = status.toLowerCase() === 'active';
    const bgColor = isOnline || isActive ? 'bg-green-100' : 'bg-red-100';
    const textColor = isOnline || isActive ? 'text-green-800' : 'text-red-800';

    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>{status}</span>
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ 
    userInfo,
    totalBillPaid,
    lastPaymentDate,
    totalSessions,
    lastLinkUp,
    lastLinkDown 
}) => {
    const daysLeft = getDaysLeft(userInfo.expiryDate);
    const isOnline = userInfo.connectionStatus.toLowerCase() === 'online';

    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold mr-4">
                    {userInfo.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{userInfo.name}</h3>
                    <p className="text-sm text-slate-500">@{userInfo.username}</p>
                </div>
            </div>
            <div className="space-y-1 flex-grow">
                <UserInfoRow label="Mobile" value={userInfo.mobile} />
                <UserInfoRow label="Package" value={userInfo.package} />
                <UserInfoRow label="Plan Rate" value={userInfo.planRate} />
                <UserInfoRow label="Expires On" value={new Date(userInfo.expiryDate.replace(/-/g, ' ')).toLocaleDateString()} />
                <UserInfoRow label="Days Left" value={
                    <span className={daysLeft <= 7 ? 'text-red-600 font-bold' : 'text-green-600'}>
                        {daysLeft} days
                    </span>
                } />
            </div>
            <hr className="my-3 border-slate-100" />
            <div className="space-y-1">
                 <UserInfoRow label="Account Status" value={<StatusBadge status={userInfo.accountStatus} />} />
                 <UserInfoRow label="Connection" value={<StatusBadge status={userInfo.connectionStatus} />} />
                 {isOnline ? (
                    <UserInfoRow 
                        label="Link Up Time" 
                        value={<span className="font-semibold text-green-600">{lastLinkUp}</span>} 
                    />
                ) : (
                    <UserInfoRow 
                        label="Link Down Time" 
                        value={<span className="font-semibold text-red-600">{lastLinkDown}</span>} 
                    />
                )}
                <UserInfoRow label="Total Sessions" value={totalSessions.toString()} />
                <UserInfoRow label="Last Payment" value={lastPaymentDate} />
                <UserInfoRow label="Total Paid" value={`${totalBillPaid.toFixed(2)} BDT`} />
            </div>
        </div>
    );
};
