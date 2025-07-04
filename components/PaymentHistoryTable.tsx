
import React from 'react';
import type { PaymentHistory } from '../types.ts';

interface PaymentHistoryTableProps {
  payments: PaymentHistory[];
}

const TableHeader: React.FC = () => (
    <thead>
        <tr className="bg-slate-50">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bill Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Received Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/3">Remarks</th>
        </tr>
    </thead>
);

const TableRow: React.FC<{ payment: PaymentHistory }> = ({ payment }) => (
    <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{new Date(payment.payDate).toLocaleString()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{payment.billAmount} BDT</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{payment.receivedAmount} BDT</td>
        <td className="px-6 py-4 text-sm text-slate-500">{payment.remarks}</td>
    </tr>
);


export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ payments }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment History</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <TableHeader />
                <tbody className="bg-white divide-y divide-slate-100">
                    {payments.map((payment, index) => (
                        <TableRow key={index} payment={payment} />
                    ))}
                </tbody>
            </table>
            {payments.length === 0 && <div className="text-center py-8 text-slate-500">No payment history available.</div>}
        </div>
    </div>
  );
};