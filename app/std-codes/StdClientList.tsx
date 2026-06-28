'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StdClientList({ stdData }: { stdData: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // 🔍 BULLETPROOF SEARCH: Ignores extra spaces and case sensitivity
  const filteredData = stdData.filter((item) => {
    const city = String(item.city || '').trim().toLowerCase();
    const search = searchTerm.trim().toLowerCase();
    return city.includes(search);
  });

  return (
    <div className="w-full space-y-8">
      {/* 🚀 Premium Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="Search for a city (e.g., Hyderabad, Agra)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-500 shadow-xl text-lg"
        />
      </div>

      {/* 📊 Data Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((item: any, index: number) => {
            const cityName = String(item.city || '').trim();
            if (!cityName) return null;
            const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            
            return (
              <Link 
                href={`/std-codes/${citySlug}`} 
                key={index}
                className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm group hover:border-purple-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors capitalize truncate pr-2" title={cityName}>
                  {cityName.toLowerCase()}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-slate-300">➔</span>
              </Link>
            )
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-slate-400 text-lg">No cities found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}