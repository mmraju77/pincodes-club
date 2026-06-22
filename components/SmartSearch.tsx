'use client';
import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function findAndLoadCSV() {
      const possiblePaths = [
        '/data/pincodes.csv',
        '/pincodes.csv',
        '/data/pincodes.csv.csv',
        '/pincodes.csv.csv',
        '/data/pincode.csv'
      ];

      let finalCsvText = '';

      for (const path of possiblePaths) {
        try {
          const response = await fetch(path + '?t=' + new Date().getTime());
          if (response.ok) {
            const text = await response.text();
            if (!text.trim().startsWith('<!DOCTYPE html>') && !text.trim().startsWith('<html')) {
              finalCsvText = text;
              break; 
            }
          }
        } catch (error) {
          // Keep searching
        }
      }

      if (finalCsvText) {
        Papa.parse(finalCsvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim(),
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setData(results.data);
            }
            setIsLoading(false);
          }
        });
      } else {
        setIsLoading(false);
      }
    }

    findAndLoadCSV();
  }, []);

  const results = useMemo(() => {
    if (!query.trim() || data.length === 0) return [];
    const queryLower = query.toLowerCase();
    
    return data.filter((row: any) => {
      const rowText = Object.values(row).join(' ').toLowerCase();
      return rowText.includes(queryLower);
    }).slice(0, 10);
  }, [query, data]);

  return (
    <div className="max-w-2xl mx-auto mt-10 relative">
      <div className="p-2 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center shadow-lg transition-all focus-within:border-orange-500/50 focus-within:ring-4 focus-within:ring-orange-500/10">
        <svg className="w-6 h-6 text-slate-400 ml-4 hidden sm:block shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isLoading ? "Loading 1.5 Lakh Records..." : "Search Pincode or City..."}
          className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-500 text-lg"
          disabled={isLoading}
        />
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-orange-500/20 whitespace-nowrap disabled:bg-slate-700 disabled:opacity-50" disabled={isLoading}>
          {isLoading ? 'Wait...' : 'Smart Search'}
        </button>
      </div>
      
      {query.trim() !== '' && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-slate-800 border border-slate-700 rounded-2xl p-2 z-50 shadow-2xl max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            results.map((res, i) => (
              <div key={i} className="flex flex-col text-white p-3 border-b border-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-lg group-hover:text-orange-400 transition-colors">{res.OfficeName || 'Unknown Office'}</span>
                  <span className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded font-bold border border-orange-500/20">{res.Pincode || 'No Pincode'}</span>
                </div>
                <span className="text-sm text-slate-400">{res.District || ''}, {res.StateName || ''}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center p-6">No records found for "{query}"</p>
          )}
        </div>
      )}
    </div>
  );
}