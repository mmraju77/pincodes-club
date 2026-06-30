'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function RtoClientList({ rtoData }: { rtoData: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // 🚀 Extract Unique States for the Directory View
  const uniqueStates = useMemo(() => {
    const states = Array.from(new Set(rtoData.map((item) => item.state)))
      .filter(Boolean)
      .sort();
    return states;
  }, [rtoData]);

  const search = searchTerm.trim().toLowerCase();

  // 🔍 Filter data only when user is searching
  const filteredData = search ? rtoData.filter((item) => {
    const place = String(item.place || '').toLowerCase();
    const regno = String(item.regno || '').toLowerCase();
    const state = String(item.state || '').toLowerCase();
    
    return place.includes(search) || regno.includes(search) || state.includes(search);
  }) : [];

  return (
    <div className="w-full space-y-8">
      {/* 🔍 Premium Global Search Input */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="Search directly by City Name or RTO Code (e.g., TS09)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-500 shadow-xl text-lg"
        />
      </div>

      {search ? (
        /* 📊 Search Results View (Static Cards - No links, No Arrows!) */
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredData.length > 0 ? (
              filteredData.map((item: any, index: number) => {
                return (
                  <div 
                    key={index}
                    className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 flex flex-col shadow-sm hover:border-purple-500/50 hover:bg-slate-800/80 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xl font-extrabold text-purple-400">
                        {item.regno}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white mb-1 line-clamp-2" title={item.place}>
                      {item.place}
                    </span>
                    {/* 🚫 Arrow and Link removed completely! Pure static text now */}
                    <span className="text-xs text-slate-400 font-medium truncate mt-2">
                      {item.state}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                <p className="text-slate-400 text-lg">No results found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 🌍 Directory View: Browse by State */
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-2 bg-amber-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">Browse by State</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uniqueStates.map((state: any, index: number) => {
              const stateSlug = String(state).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              return (
                <Link 
                  href={`/rto-codes/${stateSlug}`}
                  key={index}
                  className="bg-slate-800/40 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50 flex flex-col shadow-lg hover:border-amber-500/50 hover:bg-slate-800/80 hover:-translate-y-1 transition-all group"
                >
                  <span className="text-lg font-bold text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-1">
                    {state}
                  </span>
                  <span className="text-xs text-slate-500 mt-2 font-semibold uppercase tracking-wider group-hover:text-amber-500/70">
                    View RTO Codes ➔
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