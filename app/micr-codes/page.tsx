'use client';

import Link from 'next/link';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';

export default function MICRCodesPage() {
  const { t, language } = useLanguage();
  const [csvData, setCsvData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchAndParse() {
      const possiblePaths = ['/ifsccodes.csv', '/ifsccodes.csv.csv', '/IFSC.csv', '/data/ifsccodes.csv'];
      let finalCsvText = '';

      for (const path of possiblePaths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const text = await res.text();
            if (!text.trim().startsWith('<!DOCTYPE html>')) {
              finalCsvText = text; break;
            }
          }
        } catch (e) {}
      }

      if (!finalCsvText) {
        if (isMounted) setIsLoading(false);
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
              let bName = ''; let brName = ''; let micr = ''; let city = '';

              for (const key in row) {
                const cleanKey = key.toLowerCase().replace(/[^a-z]/g, '');
                if (cleanKey === 'bank') bName = row[key];
                else if (cleanKey === 'branch') brName = row[key];
                else if (cleanKey === 'micr') micr = row[key];
                else if (cleanKey === 'district' || cleanKey === 'city') city = row[key];
              }

              if (micr && String(micr).trim() !== '' && String(micr).toLowerCase() !== 'na' && String(micr).toLowerCase() !== 'n/a') {
                validRecords.push({
                  bank: String(bName).trim(),
                  branch: String(brName).trim(),
                  micr: String(micr).trim(),
                  city: String(city).trim()
                });
              }
            }
            
            setCsvData(validRecords);
            setIsLoading(false);
          }
        },
        error: () => {
          if (isMounted) setIsLoading(false);
        }
      });
    }

    fetchAndParse();
    return () => { isMounted = false; };
  }, []);

  const filteredBranches = useMemo(() => {
    if (!searchQuery.trim()) return csvData.slice(0, 100);
    const q = searchQuery.toLowerCase().trim();

    // Smart City Aliases Engine
    const cityAliases: Record<string, string[]> = {
      'visakhapatnam': ['vizag', 'vishakhapatnam'],
      'vizag': ['visakhapatnam', 'vishakhapatnam'],
      'bangalore': ['bengaluru'],
      'bengaluru': ['bangalore'],
      'bombay': ['mumbai'],
      'mumbai': ['bombay'],
      'madras': ['chennai'],
      'chennai': ['madras'],
      'calcutta': ['kolkata'],
      'kolkata': ['calcutta'],
      'trivandrum': ['thiruvananthapuram'],
      'thiruvananthapuram': ['trivandrum'],
      'pondy': ['puducherry'],
      'puducherry': ['pondy']
    };

    // Expand search query with aliases if found
    let searchTerms = [q];
    for (const key in cityAliases) {
      if (q.includes(key)) {
        searchTerms = [...searchTerms, ...cityAliases[key]];
      }
    }
    
    return csvData.filter((row: any) => {
      const bank = row.bank.toLowerCase();
      const branch = row.branch.toLowerCase();
      const micr = row.micr.toLowerCase();
      const city = row.city.toLowerCase();

      // Check if ANY of the search terms match the row data
      return searchTerms.some(term => 
        micr.includes(term) || 
        bank.includes(term) || 
        branch.includes(term) || 
        city.includes(term)
      );
    }).slice(0, 150);
  }, [csvData, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-orange-500 transition-colors">{t.home || "Home"}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium">MICR Codes</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
              Cheque Clearing Database
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              MICR Codes Directory
            </h1>
            <p className="text-slate-300 text-base font-light max-w-xl">
              Magnetic Ink Character Recognition numbers used by clearing houses to accelerate bank cheque processing.
            </p>
          </div>
          
          <div className="w-full md:w-80 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search MICR, Bank, or City..." 
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
          <p className="text-slate-400 animate-pulse text-lg">Scanning India's 1.6 Lakh Banking Records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.length > 0 ? (
            filteredBranches.map((row: any, index: number) => (
              <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm group hover:border-orange-500/50 transition-colors">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors capitalize line-clamp-1">
                      {translateName(row.branch.toLowerCase(), language)}
                    </h3>
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-md text-sm font-black shadow-inner shrink-0 tracking-widest">
                      {row.micr}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium capitalize">{translateName(row.bank.toLowerCase(), language)}</p>
                </div>
                
                <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase">
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {translateName(row.city.toLowerCase(), language)}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-slate-400 text-lg">No active MICR records found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}