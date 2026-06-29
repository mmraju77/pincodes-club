'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RtoClientList({ rtoData }: { rtoData: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = rtoData.filter((item) => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;

    const place = String(item.place || '').toLowerCase();
    const regno = String(item.regno || '').toLowerCase();
    
    return place.includes(search) || regno.includes(search);
  });

  return (
    <div className="w-full space-y-8">
      <div className="relative max-w-2xl mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="Search by City Name or RTO Code (e.g., Visakhapatnam, TS09)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-500 shadow-xl text-lg"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((item: any, index: number) => {
            // 🚀 CHANGED LINK: Routes directly to the individual Code Page!
            const codeLink = `/rto-codes/code/${encodeURIComponent(item.regno)}`;
            
            return (
              <Link 
                href={codeLink} 
                key={index}
                className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 flex flex-col shadow-sm group hover:border-purple-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl font-extrabold text-purple-400 group-hover:text-purple-300 transition-colors">
                    {item.regno}
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-slate-300 bg-slate-800 px-2 py-1 rounded-md">
                    ➔
                  </span>
                </div>
                <span className="text-sm font-bold text-white mb-1 truncate" title={item.place}>
                  {item.place}
                </span>
                <span className="text-xs text-slate-400 font-medium truncate">
                  {item.state}
                </span>
              </Link>
            )
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-slate-400 text-lg">No results found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}