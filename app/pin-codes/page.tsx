// @ts-nocheck
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Helper to format text neatly
const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Complete list of Indian States & UTs for the Directory Cards
const INDIAN_STATES = [
  "ANDAMAN AND NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR",
  "CHANDIGARH", "CHHATTISGARH", "DADRA AND NAGAR HAVELI", "DAMAN AND DIU", "DELHI",
  "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JAMMU AND KASHMIR", "JHARKHAND",
  "KARNATAKA", "KERALA", "LADAKH", "LAKSHADWEEP", "MADHYA PRADESH", "MAHARASHTRA",
  "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUDUCHERRY", "PUNJAB",
  "RAJASTHAN", "SIKKIM", "TAMIL NADU", "TELANGANA", "TRIPURA", "UTTAR PRADESH",
  "UTTARAKHAND", "WEST BENGAL"
];

export default function PinCodesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setIsSearching(true);
    setResults([]);
    setErrorMsg('');
    setHasSearched(true);

    try {
      const isNumber = /^\d+$/.test(searchTerm.trim());
      let query = supabase.from('pincodes').select('*').limit(50);
      
      if (isNumber) {
        query = query.eq('pincode', searchTerm.trim());
      } else {
        query = query.or(`office_name.ilike.%${searchTerm.trim()}%,district.ilike.%${searchTerm.trim()}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        setResults(data);
      } else {
        setErrorMsg('No details found for this search. Please check the spelling or number.');
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setErrorMsg('Connection error to database. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-2xl mb-2">
          <span className="text-6xl drop-shadow-md">📮</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          All India <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Pincode Directory</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Instantly find postal codes, post office details, and locations across India. Search by Area name or 6-digit Pincode.
        </p>
      </div>

      {/* Main Search Panel */}
      <div className="bg-[#0f172a] p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden mb-16">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <form onSubmit={handleSearch} className="relative z-10 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <label className="block text-sm font-bold text-slate-400 mb-2">ENTER VILLAGE / CITY OR PINCODE</label>
              <div className="absolute inset-y-0 top-7 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value === '') setHasSearched(false); // Reset to show states if cleared
                }}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-purple-500 rounded-xl text-white font-medium outline-none transition-all shadow-inner uppercase"
                placeholder="E.g., PADERU or 531024"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSearching || !searchTerm}
                className={`w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white text-lg font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 ${isSearching ? 'animate-pulse' : 'hover:-translate-y-1'}`}
              >
                {isSearching ? 'Searching...' : 'Search Details'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-semibold mb-8 animate-fade-in-up">
          {errorMsg}
        </div>
      )}

      {/* Conditional Rendering: Show Results IF searched, ELSE show States Directory */}
      
      {hasSearched && results.length > 0 && (
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Found {results.length} Results for "{searchTerm.toUpperCase()}"
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((item, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-md border border-slate-700 hover:border-purple-500/50 rounded-2xl p-6 shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-4 gap-2 border-b border-slate-700/50 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">
                      {toTitleCase(item.office_name || item.officename || 'Post Office')}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Delivery Status: <span className="text-emerald-400 font-semibold">{item.delivery_status || 'Available'}</span></p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 px-3 py-2 rounded-lg text-center">
                    <span className="block text-[10px] text-purple-300 font-bold uppercase mb-1">PINCODE</span>
                    <span className="text-lg text-white font-black tracking-widest">{item.pincode}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase mb-1">Taluk / Region</span>
                    <span className="text-sm text-slate-300 font-medium">{toTitleCase(item.taluk || item.region_name || 'N/A')}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase mb-1">District</span>
                    <span className="text-sm text-slate-300 font-medium">{toTitleCase(item.district || item.districtname || 'N/A')}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-slate-500 font-bold uppercase mb-1">State</span>
                    <span className="text-sm text-slate-300 font-medium">{toTitleCase(item.state || item.statename || 'N/A')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIRECTORY SECTION (Shows by default when not searching) */}
      {!hasSearched && (
        <div className="animate-fade-in-up mt-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-700 flex-grow"></div>
            <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Or Browse By State</h2>
            <div className="h-px bg-slate-700 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {INDIAN_STATES.map((stateName) => (
              <Link 
                key={stateName} 
                href={`/pin-codes/${encodeURIComponent(stateName)}`}
                className="bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/80 hover:bg-slate-800 rounded-2xl p-5 transition-all group flex justify-between items-center shadow-md hover:shadow-purple-500/10"
              >
                <span className="text-slate-300 font-bold group-hover:text-purple-400 transition-colors text-sm">{stateName}</span>
                <svg className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}