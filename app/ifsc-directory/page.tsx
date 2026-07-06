'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const INDIAN_STATES = [
  "ANDAMAN AND NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR",
  "CHANDIGARH", "CHHATTISGARH", "DADRA AND NAGAR HAVELI AND DAMAN AND DIU", "DELHI", "GOA",
  "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JAMMU AND KASHMIR", "JHARKHAND", "KARNATAKA",
  "KERALA", "LADAKH", "LAKSHADWEEP", "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA",
  "MIZORAM", "NAGALAND", "ODISHA", "PUDUCHERRY", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU",
  "TELANGANA", "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND", "WEST BENGAL"
];

const POPULAR_BANKS = [
  "STATE BANK OF INDIA", "HDFC BANK", "ICICI BANK", "PUNJAB NATIONAL BANK",
  "BANK OF BARODA", "AXIS BANK", "CANARA BANK", "UNION BANK OF INDIA",
  "BANK OF INDIA", "INDIAN BANK", "CENTRAL BANK OF INDIA", "INDIAN OVERSEAS BANK",
  "KOTAK MAHINDRA BANK", "UCO BANK", "BANK OF MAHARASHTRA", "INDUSIND BANK",
  "PUNJAB AND SIND BANK", "YES BANK", "IDFC FIRST BANK", "BANDHAN BANK",
  "FEDERAL BANK", "SOUTH INDIAN BANK", "KARNATAKA BANK", "KARUR VYSYA BANK"
];

export default function IfscDirectoryPage() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  
  const [districtSummary, setDistrictSummary] = useState<any[]>([]);
  const [resultsData, setResultsData] = useState<any[]>([]);
  
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim().length > 2 || inputValue === '') {
         setSearchQuery(inputValue);
      }
    }, 400); 
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Fetch Districts Fast & Safely
  useEffect(() => {
    if (selectedBank && selectedState && !selectedDistrict && !searchQuery) {
      const fetchDistricts = async () => {
        setIsLoading(true);
        setDbError(null);
        
        let allData: any[] = [];
        let keepFetching = true;
        let offset = 0;
        const pageSize = 1000;
        
        try {
          while (keepFetching) {
            // FIX 1: Changed .eq to .ilike so it matches regardless of capital/small letters in DB
            const { data, error } = await supabase.from('ifsc_codes')
              .select('district')
              .ilike('bank', selectedBank)
              .ilike('state', selectedState)
              .range(offset, offset + pageSize - 1);
            
            if (error) throw error;
            
            if (data && data.length > 0) {
              allData = [...allData, ...data];
              offset += pageSize;
              if (data.length < pageSize) keepFetching = false;
            } else {
              keepFetching = false;
            }
          }

          if (allData.length > 0) {
            const uniqueDists = Array.from(new Set(allData.map((r: any) => r.district))).filter(Boolean).sort();
            setDistrictSummary(uniqueDists.map(d => ({ name: d as string })));
          } else {
            setDistrictSummary([]);
          }
        } catch (err: any) {
          setDbError(`Database Error: ${err.message}`);
          setDistrictSummary([]);
        }
        setIsLoading(false);
      };
      fetchDistricts();
    }
  }, [selectedBank, selectedState, selectedDistrict, searchQuery]);

  // Fetch Main Results
  useEffect(() => {
    const fetchMainData = async () => {
      if (!searchQuery && !selectedDistrict) {
        setResultsData([]);
        return;
      }
      setIsLoading(true);
      setDbError(null);

      let q = supabase.from('ifsc_codes').select('bank, ifsc, branch, district, state, centre, address, micr, contact').limit(ITEMS_PER_PAGE);

      // FIX 2: Changed to .ilike here as well to fix "Data Ravatledu" issue completely
      if (selectedBank && !searchQuery) q = q.ilike('bank', selectedBank);
      if (selectedState && !searchQuery) q = q.ilike('state', selectedState);
      if (selectedDistrict && !searchQuery) q = q.ilike('district', selectedDistrict);

      let qText = searchQuery.trim().toLowerCase();

      const exactBanks: Record<string, string> = {
        'sbi': 'STATE BANK OF INDIA',
        'hdfc': 'HDFC BANK',
        'icici': 'ICICI BANK',
        'pnb': 'PUNJAB NATIONAL BANK',
        'bob': 'BANK OF BARODA',
        'boi': 'BANK OF INDIA',
        'cbi': 'CENTRAL BANK OF INDIA',
        'iob': 'INDIAN OVERSEAS BANK',
        'bom': 'BANK OF MAHARASHTRA',
        'ubi': 'UNION BANK OF INDIA',
      };

      let recognizedBank = '';
      
      for (const [key, fullName] of Object.entries(exactBanks)) {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(qText)) {
          recognizedBank = fullName;
          qText = qText.replace(regex, '').replace(/\s+/g, ' ').trim();
          break;
        }
      }

      if (recognizedBank) {
        q = q.ilike('bank', recognizedBank);
      }

      if (qText) {
         const dbQuery = qText.replace(/\s+/g, '%');
         q = q.or(`ifsc.ilike.%${dbQuery}%,branch.ilike.%${dbQuery}%,centre.ilike.%${dbQuery}%,district.ilike.%${dbQuery}%,bank.ilike.%${dbQuery}%`);
      }

      const { data, error } = await q;
      
      if (error) {
        setDbError(`Database Error: ${error.message}`);
        setResultsData([]);
      } else if (data) { 
        const sortedData = data.sort((a, b) => {
           const aBranch = (a.branch || '').toLowerCase();
           const bBranch = (b.branch || '').toLowerCase();
           const aCity = (a.centre || '').toLowerCase();
           const bCity = (b.centre || '').toLowerCase();
           const aIfsc = (a.ifsc || '').toLowerCase();
           const bIfsc = (b.ifsc || '').toLowerCase();
           const sq = qText.toLowerCase();

           if (aIfsc === sq) return -1;
           if (bIfsc === sq) return 1;
           if (aBranch === sq || aCity === sq) return -1;
           if (bBranch === sq || bCity === sq) return 1;
           if (aBranch.startsWith(sq)) return -1;
           if (bBranch.startsWith(sq)) return 1;

           return 0;
        });

        const uniqueResults = sortedData.filter((v, i, a) => a.findIndex(t => (t.ifsc === v.ifsc)) === i);
        setResultsData(uniqueResults); 
      }
      setIsLoading(false);
    };
    
    if (searchQuery.trim().length > 2 || selectedDistrict) {
       fetchMainData();
    } else {
       setResultsData([]);
    }
  }, [searchQuery, selectedBank, selectedState, selectedDistrict]);

  const handleVoiceSearch = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Your browser doesn't support Voice Search.");
      const recognition = new SpeechRecognition();
      recognition.continuous = false; recognition.interimResults = false; recognition.maxAlternatives = 1; 
      recognition.lang = 'en-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.replace(/[.,!?]/g, '').trim(); 
        setInputValue(transcript); setSearchQuery(transcript); setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  // UI Flow Logic
  const showBankList = !searchQuery && !selectedBank;
  const showStateList = !searchQuery && selectedBank && !selectedState;
  const showDistrictList = !searchQuery && selectedBank && selectedState && !selectedDistrict;
  const showResultsList = (searchQuery.trim().length > 2) || (selectedBank && selectedState && selectedDistrict);

  // STEP-BY-STEP Navigation Handlers (FIX 3)
  const goBackToBanks = () => setSelectedBank(null);
  const goBackToStates = () => setSelectedState(null);
  const goBackToDistricts = () => setSelectedDistrict(null);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <div className="flex-grow space-y-8">
        <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
          <Link href="/" className="hover:text-blue-500 transition-colors" translate="no">HOME</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          <span className="text-white font-medium" translate="no">IFSC DIRECTORY</span>
        </nav>

        <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide uppercase">Banking Directory</div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">India IFSC Codes Hub</h1>
              <p className="text-slate-300 text-base font-light max-w-xl">Browse by bank name, state, and district, or search any branch details.</p>
            </div>
            
            <div className="w-full md:w-96 relative flex items-center">
              <svg className="w-5 h-5 absolute left-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search IFSC, Bank Name, Branch, City..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-blue-500 transition-colors shadow-inner font-medium"
              />
              <button onClick={handleVoiceSearch} className={`absolute right-2 p-2 rounded-lg transition-all ${isListening ? 'bg-blue-500 animate-pulse text-white' : 'text-slate-400 hover:text-blue-400 hover:bg-slate-800'}`} title="Voice Search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* STEP-BY-STEP BREADCRUMBS */}
        <div className="flex flex-wrap items-center gap-3">
          {showStateList && (
            <button onClick={goBackToBanks} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 text-sm font-medium">
              ← Back to All Banks
            </button>
          )}
          
          {showDistrictList && (
            <button onClick={goBackToStates} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 text-sm font-medium">
              ← Back to States in <span className="capitalize">{selectedBank?.toLowerCase()}</span>
            </button>
          )}
          
          {showResultsList && !searchQuery && (
            <button onClick={goBackToDistricts} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 text-sm font-medium">
              ← Back to Districts in <span className="capitalize">{selectedState?.toLowerCase()}</span>
            </button>
          )}

          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setInputValue(''); }} className="flex items-center gap-2 text-red-400 hover:text-white transition-colors bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 text-sm font-medium">
              ✕ Clear Search
            </button>
          )}
        </div>

        {isLoading && !showStateList && !showBankList && !showDistrictList ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 animate-pulse text-lg">Fetching live banking data...</p>
          </div>
        ) : (
          <>
            {dbError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 mb-6 text-center shadow-lg">
                <p className="text-red-400 font-bold text-lg mb-2">⚠️ Database Connection Issue</p>
                <p className="text-slate-300 text-sm">{dbError}</p>
              </div>
            )}

            {showBankList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {POPULAR_BANKS.map((bankName, index) => (
                  <div key={index} onClick={() => setSelectedBank(bankName)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏦</div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2 capitalize" translate="no">{bankName.toLowerCase()}</h3>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide mt-auto">Select Bank ➔</span>
                  </div>
                ))}
              </div>
            )}

            {showStateList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {INDIAN_STATES.map((stateName, index) => (
                  <div key={index} onClick={() => setSelectedState(stateName)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2 capitalize" translate="no">{stateName.toLowerCase()}</h3>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide mt-auto">Explore Districts ➔</span>
                  </div>
                ))}
              </div>
            )}

            {showDistrictList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {districtSummary.length > 0 ? (
                  districtSummary.map((dist: any, index: number) => (
                    <div key={index} onClick={() => setSelectedDistrict(dist.name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2 capitalize" translate="no">{dist.name?.toLowerCase()}</h3>
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide mt-auto">View Branches ➔</span>
                    </div>
                  ))
                ) : (
                  !dbError && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-slate-400 text-lg">No {selectedBank} branches found in {selectedState}.</p>
                    </div>
                  )
                )}
              </div>
            )}

            {showResultsList && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {resultsData.length > 0 ? (
                  resultsData.map((row: any, index: number) => {
                    const bankName = row.bank || 'N/A';
                    const ifscCode = row.ifsc || 'N/A';
                    const branchName = row.branch || 'N/A';
                    const distName = row.district || 'N/A';
                    const stateName = row.state || 'N/A';
                    const city = row.centre || row.city || 'N/A';
                    const address = row.address || 'N/A';
                    const micrCode = row.micr || 'Not Available';
                    const contact = row.contact || row.phone || 'Not Available'; 

                    return (
                      <div key={index} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all flex flex-col relative shadow-xl group hover:scale-[1.01]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:bg-blue-500/10 transition-colors"></div>
                        <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                          <div className="flex-1 pr-4">
                            <h3 className="text-xl font-bold text-blue-400 mb-1 group-hover:text-blue-300 capitalize" translate="no">{bankName.toLowerCase()}</h3>
                            <p className="text-sm font-semibold text-slate-300 capitalize flex items-center gap-1" translate="no">
                              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> {branchName.toLowerCase()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span className="bg-blue-600 text-white px-4 py-2 rounded-xl text-lg font-black shadow-lg shadow-blue-600/20 tracking-widest mb-2">{ifscCode}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-2 text-sm flex-grow">
                          <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">City / Centre</span><span className="text-white font-medium truncate block capitalize" translate="no">{city.toLowerCase()}</span></div>
                          <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">Contact Number</span><span className="text-white font-medium truncate block">{contact}</span></div>
                          <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">MICR Code</span><span className="text-white font-medium truncate block">{micrCode}</span></div>
                          <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">District</span><span className="text-white font-medium truncate block capitalize" translate="no">{distName.toLowerCase()}</span></div>
                          <div className="col-span-2"><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">State</span><span className="text-white font-medium block capitalize" translate="no">{stateName.toLowerCase()}</span></div>
                          <div className="col-span-2"><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">Address</span><span className="text-white font-medium block text-xs leading-relaxed capitalize" translate="no">{address.toLowerCase()}</span></div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  !dbError && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-slate-400 text-lg">No branches found matching your search.</p>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-auto pt-12 pb-4 text-center border-t border-slate-800/50">
        <p className="text-slate-500 text-xs font-medium">© 2026 Pincode Club. All rights reserved. Global Operations. | <span className="text-blue-400 font-bold">App Version: 5.0 (Step-by-Step UI)</span></p>
      </div>
    </div>
  );
}