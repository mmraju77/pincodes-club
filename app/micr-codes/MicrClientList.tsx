'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function MicrClientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    let isMounted = true;

    async function fetchResults() {
      if (!debouncedSearch) {
        if (isMounted) setSearchResults([]);
        return;
      }

      if (isMounted) setIsSearching(true);
      
      try {
        const safeQuery = `%${debouncedSearch}%`;

        // 🚀 Fetching from MICR, Bank Name, AND Branch/City Name simultaneously!
        const [codeResponse, bankResponse, branchResponse] = await Promise.all([
          supabase.from('ifsc_codes').select('*').ilike('micr', safeQuery).limit(50),
          supabase.from('ifsc_codes').select('*').ilike('bank', safeQuery).limit(50),
          supabase.from('ifsc_codes').select('*').ilike('branch', safeQuery).limit(50)
        ]);

        const combinedData = [
          ...(codeResponse.data || []),
          ...(bankResponse.data || []),
          ...(branchResponse.data || [])
        ];

        const uniqueMicrMap = new Map();
        combinedData.forEach(item => {
          const micrValue = item.micr || item.micr_code;
          if (micrValue && micrValue !== 'NA' && micrValue.trim() !== '') {
            uniqueMicrMap.set(micrValue, item);
          }
        });
        
        const finalResults = Array.from(uniqueMicrMap.values());
        
        if (isMounted) {
          setSearchResults(finalResults);
        }
      } catch (error) {
        console.error("Parallel Search Error:", error);
        if (isMounted) setSearchResults([]);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }

    fetchResults();
    return () => { isMounted = false; };
  }, [debouncedSearch]);

  return (
    <div className="w-full space-y-8">
      <div className="relative max-w-2xl mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="Search by City, Branch, Bank, or MICR Code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder-slate-500 shadow-xl text-lg"
        />
      </div>

      {searchTerm ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Search Results</h2>
            {isSearching && <span className="text-sm text-emerald-400 animate-pulse font-medium">Searching database...</span>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.length > 0 ? (
              searchResults.map((item: any, index: number) => {
                const micrValue = item.micr || item.micr_code;
                const bankValue = item.bank || item.bank_name;
                const branchValue = item.branch || item.branch_name;

                return (
                  <div 
                    key={index}
                    className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 flex flex-col shadow-sm transition-all cursor-default"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xl font-extrabold text-emerald-400 tracking-wider">
                        {micrValue}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white mb-1 line-clamp-2" title={bankValue}>
                      {bankValue}
                    </span>
                    <span className="text-xs text-slate-300 font-medium mt-1">
                      {branchValue}
                    </span>
                    <span className="text-xs text-slate-500 font-medium mt-3">
                      {item.state}
                    </span>
                  </div>
                )
              })
            ) : (
              !isSearching && (
                <div className="col-span-full py-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                  <p className="text-slate-400 text-lg">No MICR codes found matching "{searchTerm}"</p>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-2 bg-emerald-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">Browse by State</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {INDIAN_STATES.map((state: string, index: number) => {
              const stateSlug = state.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              return (
                <Link 
                  href={`/micr-codes/${stateSlug}`}
                  key={index}
                  className="bg-slate-800/40 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50 flex flex-col shadow-lg hover:border-emerald-500/50 hover:bg-slate-800/80 hover:-translate-y-1 transition-all group"
                >
                  <span className="text-lg font-bold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {state}
                  </span>
                  <span className="text-xs text-slate-500 mt-2 font-semibold uppercase tracking-wider group-hover:text-emerald-500/70">
                    View Banks ➔
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}