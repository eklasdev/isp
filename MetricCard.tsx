
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, className }) => {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-md flex flex-col justify-center ${className}`}>
      <h4 className="text-sm font-medium text-slate-500 mb-1">{title}</h4>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};
