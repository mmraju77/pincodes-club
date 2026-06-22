'use client';

import Link from 'next/link';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';

// Fully Loaded Premium Database (No CSV Required for Top Cities)
const PREMIUM_STD_CODES = [
  { code: '0891', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { code: '0866', city: 'Vijayawada', state: 'Andhra Pradesh' },
  { code: '0863', city: 'Guntur', state: 'Andhra Pradesh' },
  { code: '0877', city: 'Tirupati', state: 'Andhra Pradesh' },
  { code: '0883', city: 'Rajahmundry', state: 'Andhra Pradesh' },
  { code: '0884', city: 'Kakinada', state: 'Andhra Pradesh' },
  { code: '08542', city: 'Kurnool', state: 'Andhra Pradesh' },
  { code: '08554', city: 'Anantapur', state: 'Andhra Pradesh' },
  { code: '0861', city: 'Nellore', state: 'Andhra Pradesh' },
  { code: '08562', city: 'Kadapa', state: 'Andhra Pradesh' },
  { code: '08942', city: 'Srikakulam', state: 'Andhra Pradesh' },
  { code: '08812', city: 'Eluru', state: 'Andhra Pradesh' },
  { code: '08922', city: 'Anakapalle', state: 'Andhra Pradesh' },
  { code: '040', city: 'Hyderabad', state: 'Telangana' },
  { code: '0870', city: 'Warangal', state: 'Telangana' },
  { code: '0878', city: 'Karimnagar', state: 'Telangana' },
  { code: '08742', city: 'Khammam', state: 'Telangana' },
  { code: '08462', city: 'Nizamabad', state: 'Telangana' },
  { code: '08542', city: 'Mahabubnagar', state: 'Telangana' },
  { code: '08682', city: 'Nalgonda', state: 'Telangana' },
  { code: '011', city: 'New Delhi', state: 'Delhi' },
  { code: '022', city: 'Mumbai', state: 'Maharashtra' },
  { code: '020', city: 'Pune', state: 'Maharashtra' },
  { code: '0712', city: 'Nagpur', state: 'Maharashtra' },
  { code: '080', city: 'Bengaluru', state: 'Karnataka' },
  { code: '0821', city: 'Mysuru', state: 'Karnataka' },
  { code: '0824', city: 'Mangaluru', state: 'Karnataka' },
  { code: '044', city: 'Chennai', state: 'Tamil Nadu' },
  { code: '0422', city: 'Coimbatore', state: 'Tamil Nadu' },
  { code: '0452', city: 'Madurai', state: 'Tamil Nadu' },
  { code: '033', city: 'Kolkata', state: 'West Bengal' },
  { code: '0353', city: 'Siliguri', state: 'West Bengal' },
  { code: '079', city: 'Ahmedabad', state: 'Gujarat' },
  { code: '0261', city: 'Surat', state: 'Gujarat' },
  { code: '0265', city: 'Vadodara', state: 'Gujarat' },
  { code: '0141', city: 'Jaipur', state: 'Rajasthan' },
  { code: '0291', city: 'Jodhpur', state: 'Rajasthan' },
  { code: '0522', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: '0512', city: 'Kanpur', state: 'Uttar Pradesh' },
  { code: '0542', city: 'Varanasi', state: 'Uttar Pradesh' },
  { code: '0562', city: 'Agra', state: 'Uttar Pradesh' },
  { code: '0612', city: 'Patna', state: 'Bihar' },
  { code: '0755', city: 'Bhopal', state: 'Madhya Pradesh' },
  { code: '0731', city: 'Indore', state: 'Madhya Pradesh' },
  { code: '0674', city: 'Bhubaneswar', state: 'Odisha' },
  { code: '0671', city: 'Cuttack', state: 'Odisha' },
  { code: '0361', city: 'Guwahati', state: 'Assam' },
  { code: '0172', city: 'Chandigarh', state: 'Chandigarh' },
  { code: '0181', city: 'Jalandhar', state: 'Punjab' },
  { code: '0471', city: 'Thiruvananthapuram', state: 'Kerala' },
  { code: '0484', city: 'Kochi', state: 'Kerala' }
];

export default function STDCodesPage() {
  const { t, language } = useLanguage();
  const [csvData, setCsvData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSTDCodes() {
      const possiblePaths = ['/stdcodes.csv', '/std.csv', '/std-codes.csv'];
      let finalCsvText = '';

      for (const path of possiblePaths) {
        try {
          // Bypassing cache to always look for fresh files
          const res = await fetch(path, { cache: 'no-store' });
          if (res.ok) {
            const text = await res.text();
            if (!text.trim().startsWith('<!DOCTYPE html>') && !text.trim().startsWith('<html')) {
              finalCsvText = text; break;
            }
          }
        } catch (e) {}
      }

      if (!finalCsvText) {
        if (isMounted) {
          setCsvData(PREMIUM_STD_CODES.sort((a, b) => a.city.localeCompare(b.city)));
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
              let stdCode = ''; let stdCity = ''; let stdState = '';

              for (const key in row) {
                const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (cleanKey.includes('code') || cleanKey === 'std' || cleanKey === 'stdcode') stdCode = row[key];
                else if (cleanKey.includes('city') || cleanKey.includes('location') || cleanKey.includes('station') || cleanKey.includes('district') || cleanKey.includes('name')) stdCity = row[key];
                else if (cleanKey.includes('state') || cleanKey.includes('circle')) stdState = row[key];
              }

              if (stdCode && stdCity) {
                let finalCode = String(stdCode).trim();
                if (!finalCode.startsWith('0') && finalCode.length <= 4) finalCode = '0' + finalCode;

                validRecords.push({
                  code: finalCode,
                  city: String(stdCity).trim(),
                  state: String(stdState || 'India').trim()
                });
              }
            }
            
            if (validRecords.length > 0) {
              validRecords.sort((a, b) => a.city.localeCompare(b.city));
              setCsvData(validRecords);
            } else {
              setCsvData(PREMIUM_STD_CODES.sort((a, b) => a.city.localeCompare(b.city)));
            }
            setIsLoading(false);
          }
        },
        error: () => {
          if (isMounted) {
            setCsvData(PREMIUM_STD_CODES);
            setIsLoading(false);
          }
        }
      });
    }

    fetchSTDCodes();
    return () => { isMounted = false; };
  }, []);

  const filteredCodes = useMemo(() => {
    if (!searchQuery.trim()) return csvData.slice(0, 100);
    const q = searchQuery.toLowerCase().trim();
    
    const aliasGroups = [
      ['visakhapatnam', 'vishakhapatnam', 'vizag', 'vskp'],
      ['bangalore', 'bengaluru'],
      ['bombay', 'mumbai'],
      ['madras', 'chennai'],
      ['calcutta', 'kolkata']
    ];

    let searchTerms = [q];
    for (const group of aliasGroups) {
      if (group.some(alias => alias.includes(q) || q.includes(alias))) {
        searchTerms = [...Array.from(new Set([...searchTerms, ...group]))];
      }
    }
    
    return csvData.filter((row: any) => {
      return searchTerms.some(term => 
        row.code.toLowerCase().includes(term) || 
        row.city.toLowerCase().includes(term) || 
        row.state.toLowerCase().includes(term)
      );
    }).slice(0, 150); 
  }, [csvData, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-orange-500 transition-colors">{t.home || "Home"}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium">STD Codes</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
              Telecom Directory
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              STD Dialing Codes
            </h1>
            <p className="text-slate-300 text-base font-light max-w-xl">
              Find official Subscriber Trunk Dialling (STD) codes for all major cities and districts across India.
            </p>
          </div>
          
          <div className="w-full md:w-80 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search City, Code, or State..." 
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
          <p className="text-slate-400 animate-pulse text-lg">Connecting to Telecom Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCodes.length > 0 ? (
            filteredCodes.map((row: any, index: number) => (
              <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm group hover:border-orange-500/50 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-full -z-10"></div>
                
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors capitalize line-clamp-2">
                    {translateName(row.city.toLowerCase(), language)}
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
              <p className="text-slate-400 text-lg">No STD records found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}