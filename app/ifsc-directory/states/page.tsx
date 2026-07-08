'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const ALL_BANKS = [
  "Abhyudaya Co-operative Bank", "Airtel Payments Bank", "Allahabad Bank", "Andhra Bank", "Axis Bank", "Bandhan Bank", 
  "Bank of Baroda", "Bank of India", "Bank of Maharashtra", "Canara Bank", "Central Bank of India", "Citi Bank", 
  "City Union Bank", "Corporation Bank", "DBS Bank", "Dena Bank", "Equitas Small Finance Bank", "Federal Bank", 
  "HDFC Bank", "ICICI Bank", "IDBI Bank", "IDFC First Bank", "Indian Bank", "Indian Overseas Bank", "Indusind Bank", 
  "Jammu and Kashmir Bank", "Karnataka Bank", "Karur Vysya Bank", "Kotak Mahindra Bank", "Paytm Payments Bank", 
  "Punjab National Bank", "RBL Bank", "South Indian Bank", "State Bank of India", "Syndicate Bank", "UCO Bank", 
  "Union Bank of India", "Yes Bank"
];

const formatToSlug = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function StatesDirectoryPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen relative">
      
      <div className="mb-8">
        <Link href="/ifsc-directory" className="text-blue-400 hover:text-white flex items-center gap-2 mb-4 text-sm font-medium">
          <span>&larr;</span> Back to Directory Hub
        </Link>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Explore by State</h1>
        <p className="text-slate-400">Select any Indian state to find available bank branches.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {INDIAN_STATES.map((state) => (
          <div 
            key={state} 
            onClick={() => setSelectedState(state)}
            className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-sm hover:shadow-emerald-900/20"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🗺️</div>
            <h3 className="text-slate-200 font-semibold text-sm group-hover:text-emerald-400 transition-colors" translate="no">{state}</h3>
          </div>
        ))}
      </div>

      {/* Smart Modal for Bank Selection */}
      {selectedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-bl-full -z-10"></div>
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-white">Select a Bank</h2>
                <p className="text-emerald-400 text-sm font-medium mt-1">in {selectedState}</p>
              </div>
              <button onClick={() => setSelectedState(null)} className="text-slate-400 hover:text-red-400 text-3xl font-light transition-colors">&times;</button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar pr-2 pb-4">
              {ALL_BANKS.map(bank => (
                <button 
                  key={bank} 
                  onClick={() => router.push(`/ifsc-directory/${formatToSlug(bank)}/${formatToSlug(selectedState)}`)}
                  className="bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-blue-500 hover:bg-slate-700 text-sm text-slate-300 hover:text-white transition-all text-left truncate"
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}