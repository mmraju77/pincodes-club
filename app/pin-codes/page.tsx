// @ts-nocheck
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const INDIAN_STATES = [
  "ANDAMAN AND NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR",
  "CHANDIGARH", "CHHATTISGARH", "DADRA AND NAGAR HAVELI", "DAMAN AND DIU", "DELHI",
  "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JAMMU AND KASHMIR", "JHARKHAND",
  "KARNATAKA", "KERALA", "LADAKH", "LAKSHADWEEP", "MADHYA PRADESH", "MAHARASHTRA",
  "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUDUCHERRY", "PUNJAB",
  "RAJASTHAN", "SIKKIM", "TAMIL NADU", "TELANGANA", "TRIPURA", "UTTAR PRADESH",
  "UTTARAKHAND", "WEST BENGAL"
];

export default function PinCodesHubPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const queryText = searchTerm.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (!queryText) return;
    
    setIsSearching(true);
    setResults([]);
    setErrorMsg('');
    setHasSearched(true);

    try {
      // 🚀 Calling the new Advanced RPC Search Engine
      const { data, error } = await supabase.rpc('advanced_pincode_search', {
        search_query: queryText
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setResults(data);
      } else {
        setErrorMsg(`No results found for "${queryText}". Please try adjusting the spelling slightly.`);
      }
    } catch (err: any) {
      console.error("Advanced Search Error:", err);
      // Fallback message
      setErrorMsg('Database connection error. Please ensure the new SQL script was executed in Supabase.');
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
          Smart Search: Type a full name, partial name, or even with minor spelling mistakes. We'll find it!
        </p>
      </div>

      {/* Main Search Panel */}
      <div className="bg-[#0f172a] p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden mb-16">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <form onSubmit={handleSearch} className="relative z-10 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim() === '') setHasSearched(false);
                }}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-purple-500 rounded-xl text-white font-medium outline-none transition-all shadow-inner placeholder-slate-500"
                placeholder="E.g., visak, araku velley, or munchingi puttu"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              className={`w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white text-lg font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${isSearching ? 'opacity-75 cursor-wait' : 'hover:-translate-y-1'}`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Searching...
                </>
              ) : 'Search Details'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Output */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-semibold mb-8 animate-fade-in-up">
          {errorMsg}
        </div>
      )}

      {/* Dynamic Results Grid */}
      {hasSearched && results.length > 0 && (
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-6">Found {results.length} Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((item, index) => (
              <Link 
                href={`/pin-codes/${encodeURIComponent(item.statename)}/${encodeURIComponent(item.district)}/${item.pincode}`}
                key={index} 
                className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl group hover:border-purple-500 hover:bg-slate-800 transition-all cursor-pointer block"
              >
                <div className="flex justify-between items-start mb-4 border-b border-slate-700/50 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {toTitleCase(item.officename)}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Status: <span className="text-emerald-400">{item.delivery || 'Available'}</span></p>
                  </div>
                  <div className="bg-purple-500/10 px-3 py-2 rounded-lg text-center border border-purple-500/30 group-hover:bg-purple-500/20 transition-colors">
                    <span className="block text-[10px] text-purple-300 font-bold uppercase mb-1">PINCODE</span>
                    <span className="text-lg text-white font-black">{item.pincode}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-slate-500 uppercase">Region / Taluk</span>
                    <span className="text-sm text-slate-300">{toTitleCase(item.regionname || item.taluk || 'N/A')}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 uppercase">District</span>
                    <span className="text-sm text-slate-300">{toTitleCase(item.district)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-slate-500 uppercase">State</span>
                    <span className="text-sm text-slate-300">{toTitleCase(item.statename)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-semibold">View Area Details & Banks</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* States Directory Fallback */}
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
                className="bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/80 hover:bg-slate-800 rounded-2xl p-5 transition-all group flex justify-between items-center shadow-sm hover:shadow-purple-500/10"
              >
                <span className="text-slate-300 font-bold group-hover:text-purple-400 text-sm">{stateName}</span>
                <svg className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}