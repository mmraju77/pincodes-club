'use client';

import Link from 'next/link';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';

const ZONE_NAMES: Record<string, string> = {
  'CR': 'Central Railway', 'ER': 'Eastern Railway', 'ECR': 'East Central Railway',
  'ECOR': 'East Coast Railway', 'NR': 'Northern Railway', 'NCR': 'North Central Railway',
  'NER': 'North Eastern Railway', 'NFR': 'Northeast Frontier Railway', 'NWR': 'North Western Railway',
  'SR': 'Southern Railway', 'SCR': 'South Central Railway', 'SER': 'South Eastern Railway',
  'SECR': 'South East Central Railway', 'SWR': 'South Western Railway', 'WR': 'Western Railway',
  'WCR': 'West Central Railway', 'KR': 'Konkan Railway', 'IR': 'Indian Railways'
};

const PREMIUM_RAILWAY_CODES = [
  { code: 'VSKP', name: 'Visakhapatnam Junction', state: 'Andhra Pradesh', zone: 'ECOR' },
  { code: 'BZA', name: 'Vijayawada Junction', state: 'Andhra Pradesh', zone: 'SCR' },
  { code: 'SC', name: 'Secunderabad Junction', state: 'Telangana', zone: 'SCR' },
  { code: 'HYB', name: 'Hyderabad Deccan Nampally', state: 'Telangana', zone: 'SCR' },
  { code: 'TPTY', name: 'Tirupati Main', state: 'Andhra Pradesh', zone: 'SCR' },
  { code: 'NDLS', name: 'New Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', state: 'Maharashtra', zone: 'CR' },
  { code: 'MAS', name: 'MGR Chennai Central', state: 'Tamil Nadu', zone: 'SR' },
  { code: 'SBC', name: 'KSR Bengaluru City', state: 'Karnataka', zone: 'SWR' },
  { code: 'HWH', name: 'Howrah Junction', state: 'West Bengal', zone: 'ER' }
];

export default function RailwayCodesPage() {
  const { t, language } = useLanguage();
  // We initialize with Premium Codes so it NEVER loads empty
  const [stationData, setStationData] = useState<any[]>(PREMIUM_RAILWAY_CODES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 100;

  useEffect(() => {
    let isMounted = true;

    async function fetchStations() {
      let loadedFromCSV = false;

      try {
        const cacheBuster = `?v=${new Date().getTime()}`;
        const csvPaths = [
          '/stations.csv', 
          '/stations.csv.csv', 
          '/stationscodes.csv', 
          '/stationscodes.csv.csv',
          '/railway.csv'
        ];
        
        for (const path of csvPaths) {
          const csvRes = await fetch(path + cacheBuster, { cache: 'no-store' });
          if (csvRes.ok) {
            const csvText = await csvRes.text();
            if (!csvText.startsWith('<!DOCTYPE html>') && csvText.includes(',')) {
              await new Promise<void>((resolve) => {
                Papa.parse(csvText, {
                  header: true, skipEmptyLines: true,
                  complete: (results) => {
                    const map = new Map();

                    // 1. Add Premium Data First (Safeguard)
                    PREMIUM_RAILWAY_CODES.forEach(station => {
                        map.set(station.code, station);
                    });

                    // 2. Add CSV Data
                    for (let i = 0; i < results.data.length; i++) {
                      const row = results.data[i] as any;
                      let code = ''; let name = ''; let state = ''; let zone = 'IR';
                      
                      for (const key in row) {
                        const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                        const val = String(row[key] || '').trim();
                        if (!val) continue;

                        if (cleanKey === 'code' || cleanKey === 'stationcode' || cleanKey === 'stncode') {
                            code = val.toUpperCase();
                        } else if (cleanKey === 'state' || cleanKey === 'statename') {
                            state = val;
                        } else if (cleanKey === 'zone' || cleanKey === 'railwayzone') {
                            zone = val.toUpperCase();
                        } else if (cleanKey === 'name' || cleanKey === 'stationname' || cleanKey === 'station' || cleanKey === 'stnname') {
                            name = val;
                        }
                      }
                      
                      const nameLower = name.toLowerCase();
                      const isDummy = nameLower.includes('cabin') || nameLower.includes('block hut') || 
                                      nameLower.includes('cbn') || code.startsWith('XX') || code.startsWith('YY');

                      if (code && name && !isDummy) {
                        let finalState = state;
                        if (!finalState || finalState.toLowerCase() === 'null' || finalState.toLowerCase() === 'india' || finalState.trim() === '') {
                          finalState = ZONE_NAMES[zone] || 'Indian Railways';
                        }
                        
                        if (!map.has(code)) {
                          map.set(code, { code, name, state: finalState, zone });
                        }
                      }
                    }
                    
                    if (isMounted) {
                      const finalRecords = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
                      setStationData(finalRecords);
                      setIsLoading(false);
                      loadedFromCSV = true;
                    }
                    resolve();
                  }
                });
              });
              if (loadedFromCSV) break; 
            }
          }
        }
      } catch(e) {}

      if (isMounted && !loadedFromCSV) {
        setStationData(PREMIUM_RAILWAY_CODES.sort((a, b) => a.name.localeCompare(b.name)));
        setIsLoading(false);
      }
    }

    fetchStations();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredStations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return stationData; 
    
    const aliasGroups = [
      ['visakhapatnam', 'vishakhapatnam', 'vizag', 'vskp', 'waltair'],
      ['bangalore', 'bengaluru', 'sbc', 'ypr'],
      ['bombay', 'mumbai', 'bct', 'cst', 'ltt'],
      ['madras', 'chennai', 'mas'],
      ['calcutta', 'kolkata', 'howrah', 'hwh', 'sealdah'],
      ['trivandrum', 'thiruvananthapuram', 'tvc'],
      ['secunderabad', 'secundrabad', 'hyderabad', 'hyb', 'sc'],
      ['vijayawada', 'bezawada', 'bza'],
      ['tirupati', 'tirupathi', 'tpty']
    ];

    let searchTerms = [q];
    for (const group of aliasGroups) {
      if (group.some(alias => alias.includes(q) || q.includes(alias))) {
        searchTerms = [...Array.from(new Set([...searchTerms, ...group]))];
      }
    }
    
    return stationData.filter((row: any) => {
      // 100% CRASH-PROOF STRING CONVERSION
      const codeStr = String(row.code || '').toLowerCase();
      const nameStr = String(row.name || '').toLowerCase();
      const stateStr = String(row.state || '').toLowerCase();
      const zoneStr = String(row.zone || '').toLowerCase();
      const fullZoneStr = String(ZONE_NAMES[row.zone] || '').toLowerCase();

      return searchTerms.some(term => 
        codeStr.includes(term) || 
        nameStr.includes(term) || 
        stateStr.includes(term) ||
        zoneStr.includes(term) ||
        fullZoneStr.includes(term)
      );
    });
  }, [stationData, searchQuery]);

  const paginatedStations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStations, currentPage]);

  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-orange-500 transition-colors">{t.home || "Home"}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium">Railway Codes</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
              Transit Directory
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Indian Railway Station Codes
            </h1>
            <p className="text-slate-300 text-base font-light max-w-xl">
              Search for official short codes and zonal details of all major Indian Railway stations.
            </p>
            {!isLoading && (
              <p className="text-orange-400 font-medium mt-4 bg-orange-500/10 inline-block px-4 py-2 rounded-lg border border-orange-500/20 shadow-sm">
                Total Stations Found: <span className="font-bold text-white">{filteredStations.length}</span>
              </p>
            )}
          </div>
          
          <div className="w-full md:w-80 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search Any Station, Code, or State..." 
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
          <p className="text-slate-400 animate-pulse text-lg">Safely Merging Databases...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedStations.length > 0 ? (
              paginatedStations.map((row: any, index: number) => (
                <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm group hover:border-orange-500/50 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-full -z-10"></div>
                  
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors capitalize line-clamp-2">
                      {translateName(row.name.toLowerCase(), language)}
                    </h3>
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg text-sm font-black shadow-inner shrink-0 tracking-widest">
                      {row.code}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-800/60 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest truncate pr-2">
                      {translateName(row.state.toLowerCase(), language)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded shrink-0">
                      Zone: {row.zone}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-slate-400 text-lg">No station records found matching "{searchQuery}"</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 mb-8 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all border border-slate-700 w-full sm:w-auto"
              >
                Previous
              </button>
              
              <span className="text-slate-400 font-medium px-4">
                Page <span className="text-white text-lg font-bold mx-1">{currentPage}</span> of <span className="text-white mx-1">{totalPages}</span>
              </span>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all border border-slate-700 w-full sm:w-auto"
              >
                Next Page
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}