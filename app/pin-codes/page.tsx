import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'India PIN Codes Hub | Pincode Club',
  description: 'Browse by state, district, and village to find accurate postal codes across India.',
};

const INDIAN_STATES = [
  "Andaman & Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli",
  "Daman & Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function PincodesHubPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen space-y-12">
      
      {/* 1. Header Section with Search Bar (Matching Screenshot 1349) */}
      <div className="bg-[#0f172a] p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex-1 text-center lg:text-left">
          <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 inline-block border border-orange-500/20 uppercase tracking-wider">
            POSTAL DIRECTORY
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            India PIN Codes Hub
          </h1>
          <p className="text-slate-400 text-lg">
            Browse by state, district, and village, or search any post office details.
          </p>
        </div>

        {/* The Search Bar with Mic Icon */}
        <div className="w-full lg:w-[450px]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search PIN Code, Post Office, City..." 
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-slate-500"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-orange-400 text-slate-500 transition-colors">
              {/* Mic Icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. States Grid (Big Icons, Programmatic SEO Links) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {INDIAN_STATES.map((stateName, index) => (
          <Link 
            key={index}
            href={`/pin-codes/${encodeURIComponent(stateName)}`}
            className="group block"
          >
            <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center hover:bg-slate-800/80 hover:border-orange-500/30 cursor-pointer transition-all shadow-lg h-full">
              
              {/* Location/Post Office Icon */}
              <div className="mb-5 text-slate-500 group-hover:text-orange-400 transition-colors">
                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <h3 className="text-white font-bold text-xl mb-6 text-center group-hover:text-orange-50 transition-colors">
                {stateName}
              </h3>
              
              {/* Action Button */}
              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold px-5 py-2 rounded-full flex items-center gap-2 group-hover:bg-orange-500 group-hover:text-white transition-all">
                Select State 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}