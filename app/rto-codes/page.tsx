'use client';

import Link from 'next/link';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';

const FALLBACK_RTO_CODES = [
  { code: 'AP39', location: 'Andhra Pradesh (New Standard)', state: 'Andhra Pradesh' },
  { code: 'TS09', location: 'Hyderabad Central', state: 'Telangana' },
  { code: 'MH01', location: 'Mumbai South', state: 'Maharashtra' },
  { code: 'KA01', location: 'Bengaluru Central', state: 'Karnataka' }
];

export default function RTOCodesPage() {
  const { t, language } = useLanguage();
  const [csvData, setCsvData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRTOCodes() {
      const possiblePaths = ['/rtocodes.csv', '/rtocodes.csv.csv', '/RTO.csv', '/data/rtocodes.csv'];
      let finalCsvText = '';

      for (const path of possiblePaths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const text = await res.text();
            if (!text.trim().startsWith('<!DOCTYPE html>') && !text.trim().startsWith('<html')) {
              finalCsvText = text;
              break;
            }
          }
        } catch (e) {}
      }

      if (!finalCsvText) {
        if (isMounted) {
          setCsvData(FALLBACK_RTO_CODES);
          setIsLoading(false);
        }
        return;
      }

      Papa.parse(finalCsvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (isMounted) {
            const validRecords: any[] = [];
            
            for (let i = 0; i < results.data.length; i++) {
              const row = results.data[i] as any;
              let rtoCode = ''; let rtoLoc = ''; let rtoState = '';

              for (const key in row) {
                const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                
                // Updated to catch "RegNo" from your specific CSV file
                if (cleanKey.includes('code') || cleanKey === 'rto' || cleanKey === 'rtocode' || cleanKey === 'id' || cleanKey.includes('regno') || cleanKey.includes('reg')) {
                  rtoCode = row[key];
                } 
                // Updated to catch "Place" from your specific CSV file
                else if (cleanKey.includes('location') || cleanKey.includes('city') || cleanKey.includes('district') || cleanKey.includes('name') || cleanKey.includes('office') || cleanKey.includes('place')) {
                  rtoLoc = row[key];
                } 
                else if (cleanKey.includes('state') || cleanKey.includes('ut')) {
                  rtoState = row[key];
                }
              }

              if (rtoCode && String(rtoCode).trim() !== '') {
                validRecords.push({
                  code: String(rtoCode).trim().toUpperCase(),
                  location: String(rtoLoc || 'All India Register').trim(),
                  state: String(rtoState || 'India').trim()
                });
              }
            }
            
            setCsvData(validRecords.length > 0 ? validRecords : FALLBACK_RTO_CODES);
            setIsLoading(false);
          }
        },
        error: () => {
          if (isMounted) {
            setCsvData(FALLBACK_RTO_CODES);
            setIsLoading(false);
          }
        }
      });
    }

    fetchRTOCodes();
    return () => { isMounted = false; };
  }, []);

  const filteredCodes = useMemo(() => {
    if (!searchQuery.trim()) return csvData.slice(0, 100);
    const q = searchQuery.toLowerCase().trim();
    
    return csvData.filter((row: any) => {
      return row.code.toLowerCase().includes(q) || 
             row.location.toLowerCase().includes(q) || 
             row.state.toLowerCase().includes(q);
    }).slice(0, 150); 
  }, [csvData, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-orange-500 transition-colors">{t.home || "Home"}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium">RTO Codes</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
              Transport Authority
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              RTO Vehicle Codes
            </h1>
            <p className="text-slate-300 text-base font-light max-w-xl">
              Search official Regional Transport Office (RTO) vehicle registration codes across all Indian states and districts.
            </p>
          </div>
          
          <div className="w-full md:w-80 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search RTO Code, Place, or State..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 animate-pulse text-lg">Fetching RTO Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCodes.length > 0 ? (
            filteredCodes.map((row: any, index: number) => (
              <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm group hover:border-orange-500/50 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-full -z-10"></div>
                
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors capitalize line-clamp-2">
                    {translateName(row.location.toLowerCase(), language)}
                  </h3>
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg text-lg font-black shadow-inner shrink-0 tracking-widest">
                    {row.code}
                  </span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    {translateName(row.state.toLowerCase(), language)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-slate-400 text-lg">No RTO records found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}