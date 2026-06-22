'use client';

import Link from 'next/link';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';

const PREMIUM_IFSC_CODES = [
  { ifsc: 'SBIN0000952', micr: '530002002', bank: 'State Bank of India', branch: 'Visakhapatnam', city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', address: 'Daba Gardens, Main Road, Visakhapatnam', contact: '0891-2561234' }
];

const toTitleCase = (str: string) => {
  if (!str) return 'N/A';
  if (str.toUpperCase() === 'NA' || str.toUpperCase() === 'N/A') return 'N/A';
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
};

// Memory Cache with Pre-compiled Search Index
let globalBranchDataCache: any[] | null = null;
let globalBankSummaryCache: any[] | null = null;

export default function BankCodesPage() {
  const { t, language } = useLanguage();
  
  const [branchData, setBranchData] = useState<any[]>([]);
  const [bankSummary, setBankSummary] = useState<{name: string, count: number}[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  
  // Local instant input state & heavy search query state
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 100;

  // Debounce typing to keep keyboard 100% free
  useEffect(() => {
    if (inputValue === '') {
      setSearchQuery('');
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
      setShowSuggestions(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search');
    if (query) {
      setInputValue(query);
      setSearchQuery(query);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchBankCodes() {
      if (globalBranchDataCache && globalBankSummaryCache) {
        setBranchData(globalBranchDataCache);
        setBankSummary(globalBankSummaryCache);
        setIsLoading(false);
        return;
      }

      let loadedFromCSV = false;
      try {
        const csvPaths = ['/ifsccodes.csv', '/ifsccodes.csv.csv', '/ifsc.csv', '/bank.csv'];
        for (const path of csvPaths) {
          const res = await fetch(path);
          if (res.ok) {
            const text = await res.text();
            if (!text.trim().startsWith('<!DOCTYPE html>') && text.includes(',')) {
              await new Promise<void>((resolve) => {
                Papa.parse(text, {
                  header: true, skipEmptyLines: true,
                  complete: (results) => {
                    const map = new Map();
                    const bankCountMap = new Map();
                    for (let i = 0; i < results.data.length; i++) {
                      const row = results.data[i] as any;
                      let ifsc = ''; let micr = ''; let bankName = ''; let branch = ''; 
                      let state = ''; let city = ''; let district = ''; let address = ''; let contact = '';
                      for (const key in row) {
                        const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                        const val = String(row[key] || '').trim();
                        if (!val) continue;
                        if (cleanKey === 'ifsc' || cleanKey === 'ifsccode') ifsc = val.toUpperCase();
                        else if (cleanKey === 'micr' || cleanKey === 'micrcode') micr = val;
                        else if (cleanKey === 'bank' || cleanKey === 'bankname') bankName = val;
                        else if (cleanKey === 'branch' || cleanKey === 'branchname') branch = val;
                        else if (cleanKey === 'district') district = val;
                        else if (cleanKey === 'city' || cleanKey === 'centre') city = val;
                        else if (cleanKey === 'state' || cleanKey === 'statename') state = val;
                        else if (cleanKey === 'address') address = val;
                        else if (cleanKey === 'contact' || cleanKey === 'phone' || cleanKey === 'phoneno') contact = val;
                      }
                      if (ifsc && bankName) {
                        if (!map.has(ifsc)) {
                          const cleanBankName = toTitleCase(bankName);
                          const titleBranch = toTitleCase(branch || 'Main Branch');
                          const titleDist = toTitleCase(district || city || 'Unknown');
                          const titleCity = toTitleCase(city || district || 'Unknown');
                          const titleState = toTitleCase(state || 'India');
                          const titleAddr = toTitleCase(address || 'Address not available');
                          const cleanContact = contact && contact.toLowerCase() !== 'na' && contact !== '0' ? contact : 'N/A';

                          // 🌟 PRE-COMPILING INDEX FOR 0.001s RAPID SEARCH 🌟
                          const precompiledIndex = `${ifsc} ${micr} ${cleanBankName} ${titleBranch} ${titleDist} ${titleCity} ${titleState} ${titleAddr}`.toLowerCase().replace(/[^a-z0-9]/g, '');

                          map.set(ifsc, { 
                            ifsc: ifsc, micr: micr || 'N/A', bank: cleanBankName, 
                            branch: titleBranch, district: titleDist, 
                            city: titleCity, state: titleState, address: titleAddr, contact: cleanContact,
                            searchIndex: precompiledIndex
                          });
                          bankCountMap.set(cleanBankName, (bankCountMap.get(cleanBankName) || 0) + 1);
                        }
                      }
                    }
                    const finalRecords = Array.from(map.values()).sort((a, b) => a.bank.localeCompare(b.bank));
                    const summaryRecords = Array.from(bankCountMap.entries()).map(([name, count]) => ({name, count})).sort((a,b) => b.count - a.count); 
                    
                    if(finalRecords.length > 0) { 
                      globalBranchDataCache = finalRecords;
                      globalBankSummaryCache = summaryRecords;
                      loadedFromCSV = true; 
                    }
                    
                    if (isMounted) {
                      setBranchData(globalBranchDataCache || []); 
                      setBankSummary(globalBankSummaryCache || []); 
                      setIsLoading(false);
                    }
                    resolve();
                  }
                });
              });
              if (loadedFromCSV) break;
            }
          }
        }
      } catch (e) {}
      if (isMounted && !loadedFromCSV) { 
        globalBranchDataCache = PREMIUM_IFSC_CODES;
        globalBankSummaryCache = [{name: 'State Bank of India', count: 1}];
        setBranchData(PREMIUM_IFSC_CODES); setBankSummary([{name: 'State Bank of India', count: 1}]); setIsLoading(false); 
      }
    }
    fetchBankCodes();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedBank]);

  const handleVoiceSearch = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Your browser doesn't support Voice Search.");
      const recognition = new SpeechRecognition();
      recognition.continuous = false; recognition.interimResults = false; recognition.maxAlternatives = 1; 
      recognition.lang = 'en-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = event.results[0][0].transcript.replace(/[.,!?]/g, '').trim(); 
        setInputValue(transcript); setSearchQuery(transcript); setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const paginatedBanks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return bankSummary.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [bankSummary, currentPage]);

  // Lightning fast lookup using Pre-compiled string index
  const filteredBranches = useMemo(() => {
    if (!searchQuery && !selectedBank) return []; 
    let baseData = branchData;
    if (selectedBank) baseData = branchData.filter(row => row.bank === selectedBank);
    if (!searchQuery) return baseData;
    
    const q = searchQuery.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    if (q.length < 2) return [];

    return baseData.filter(row => row.searchIndex.includes(q));
  }, [branchData, searchQuery, selectedBank]);

  const paginatedBranches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBranches.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBranches, currentPage]);

  const showBankList = !searchQuery && !selectedBank;
  const currentTotalPages = Math.ceil((showBankList ? bankSummary.length : filteredBranches.length) / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-blue-500 transition-colors" translate="no">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium" translate="no">IFSC DIRECTORY</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide uppercase">Banking Directory</div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">India Bank IFSC Codes</h1>
            <p className="text-slate-300 text-base font-light max-w-xl">Find exact IFSC, MICR, addresses, and contacts for 1.8 Lakh+ banks across India.</p>
          </div>
          
          <div className="w-full md:w-96 relative flex items-center">
            <svg className="w-5 h-5 absolute left-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder={selectedBank ? `Search within ${selectedBank}...` : "Search Bank, City, IFSC..."} 
              value={inputValue} // Instant visual typing updates
              onChange={(e) => setInputValue(e.target.value)} 
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-blue-500 transition-colors shadow-inner font-medium"
            />
            <button onClick={handleVoiceSearch} className={`absolute right-2 p-2 rounded-lg transition-all ${isListening ? 'bg-blue-500 animate-pulse text-white' : 'text-slate-400 hover:text-blue-400 hover:bg-slate-800'}`} title="Voice Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
            {showSuggestions && searchQuery.length >= 2 && filteredBranches.length > 0 && (
              <ul className="absolute top-14 left-0 z-50 w-full bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                {filteredBranches.slice(0, 6).map((row: any, idx: number) => (
                  <li key={idx} onClick={() => { setInputValue(row.ifsc); setSearchQuery(row.ifsc); setShowSuggestions(false); }} className="px-4 py-3 hover:bg-blue-500 cursor-pointer border-b border-slate-700 last:border-0 transition-colors group flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200 group-hover:text-white truncate max-w-[200px]" translate="no">{row.bank}</span>
                      <span className="text-xs text-slate-400 group-hover:text-blue-100 truncate max-w-[200px]" translate="no">{row.branch}, {row.city}</span>
                    </div>
                    <span className="text-xs font-black bg-slate-900 text-blue-400 px-2 py-1 rounded group-hover:bg-white group-hover:text-blue-600 shrink-0">{row.ifsc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 animate-pulse text-lg">Activating Banking Filter Index...</p>
        </div>
      ) : (
        <>
          {selectedBank && (
            <button onClick={() => { setSelectedBank(null); setInputValue(''); setSearchQuery(''); }} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 w-fit">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Back to All Banks
            </button>
          )}

          {showBankList && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedBanks.map((bank, index) => (
                <div key={index} onClick={() => setSelectedBank(bank.name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏦</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2" translate="no">{bank.name}</h3>
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide mt-auto">{bank.count} Branches</span>
                </div>
              ))}
            </div>
          )}

          {!showBankList && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedBranches.length > 0 ? (
                paginatedBranches.map((row: any, index: number) => {
                  const seoUrl = `/ifsc-directory/${row.ifsc}?bank=${encodeURIComponent(row.bank)}&branch=${encodeURIComponent(row.branch)}&city=${encodeURIComponent(row.city)}&district=${encodeURIComponent(row.district)}&state=${encodeURIComponent(row.state)}&micr=${encodeURIComponent(row.micr)}&address=${encodeURIComponent(row.address)}&contact=${encodeURIComponent(row.contact)}`;
                  return (
                    <Link href={seoUrl} prefetch={false} key={index} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all flex flex-col relative shadow-xl block cursor-pointer group hover:scale-[1.01]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:bg-blue-500/10 transition-colors"></div>
                      <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-1 group-hover:text-blue-300" translate="no">{row.bank}</h3>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> Branch: <span translate="no">{row.branch}</span>
                          </p>
                        </div>
                        <span className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xl font-black shadow-lg shadow-blue-600/20 shrink-0 tracking-widest">{row.ifsc}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-3 pt-2 text-sm flex-grow">
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">MICR Code</span><span className="text-white font-medium truncate block tracking-widest">{row.micr}</span></div>
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">City</span><span className="text-white font-medium truncate block" translate="no">{row.city}</span></div>
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">District</span><span className="text-white font-medium truncate block" translate="no">{row.district}</span></div>
                      </div>
                    </Link>
                  )
                })
              ) : (
                <div className="col-span-full py-12 text-center"><p className="text-slate-400 text-lg">No branches found matching "{searchQuery}"</p></div>
              )}
            </div>
          )}

          {currentTotalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 mb-8 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({top: 300, behavior: 'smooth'}); }} disabled={currentPage === 1} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-blue-600 transition-all border border-slate-700">Previous</button>
              <span className="text-slate-400 font-medium px-4">Page <span className="text-white text-lg font-bold mx-1">{currentPage}</span> of <span className="text-white mx-1">{currentTotalPages}</span></span>
              <button onClick={() => { setCurrentPage(p => Math.min(currentTotalPages, p + 1)); window.scrollTo({top: 300, behavior: 'smooth'}); }} disabled={currentPage === currentTotalPages} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-blue-600 transition-all border border-slate-700">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}