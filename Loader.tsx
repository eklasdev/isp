
import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
  </div>
);
