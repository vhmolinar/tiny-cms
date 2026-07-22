import React from 'react';
import { FileText, Rocket } from 'lucide-react';

export default function Overview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Total Posts</h3>
          <div className="p-2 bg-blue-50 rounded-lg"><FileText className="w-5 h-5 text-blue-600" /></div>
        </div>
        <p className="text-3xl font-bold text-gray-900">0</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Status</h3>
          <div className="p-2 bg-green-50 rounded-lg"><Rocket className="w-5 h-5 text-green-600" /></div>
        </div>
        <p className="text-3xl font-bold text-gray-900">All systems go</p>
      </div>
    </div>
  );
}
