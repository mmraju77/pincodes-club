// @ts-nocheck
'use client';
import Link from 'next/link';

export default function AadhaarStatesPage() {
  // Static list of states for super-fast loading
  const states = [
    "ANDHRA PRADESH", "TELANGANA", "KARNATAKA", "TAMIL NADU", 
    "MAHARASHTRA", "DELHI", "GUJARAT", "WEST BENGAL",
    "KERALA", "ODISHA", "RAJASTHAN", "UTTAR PRADESH"
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-2xl mb-2">
          <span className="text-6xl drop-shadow-md">🏛️</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Aadhaar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Centers Directory</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Select your state below to find authorized UIDAI Aadhaar enrollment and update centers in your district.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {states.map((state) => (
          <Link 
            key={state} 
            href={`/services/aadhaar-centers/${encodeURIComponent(state)}`}
            className="bg-slate-800/50 backdrop-blur-md border border-slate-700 hover:border-blue-500/80 hover:bg-slate-800 rounded-2xl p-6 transition-all group flex justify-between items-center shadow-lg hover:shadow-blue-500/10"
          >
            <span className="text-slate-200 font-bold group-hover:text-blue-400 transition-colors">{state}</span>
            <svg className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </Link>
        ))}
      </div>
    </div>
  );
}