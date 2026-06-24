'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

// Popular banks list mapped to standard uppercase DB formats
const POPULAR_BANKS = [
  "STATE BANK OF INDIA", "HDFC BANK", "ICICI BANK LIMITED", "PUNJAB NATIONAL BANK",
  "BANK OF BARODA", "AXIS BANK", "CANARA BANK", "UNION BANK OF INDIA",
  "BANK OF INDIA", "INDIAN BANK", "CENTRAL BANK OF INDIA", "INDIAN OVERSEAS BANK",
  "KOTAK MAHINDRA BANK LIMITED", "UCO BANK", "BANK OF MAHARASHTRA", "INDUSIND BANK",
  "PUNJAB AND SIND BANK", "YES BANK", "IDFC FIRST BANK LIMITED", "BANDHAN BANK LIMITED",
  "FEDERAL BANK", "SOUTH INDIAN BANK", "KARNATAKA BANK LIMITED", "KARUR VYSYA BANK"
];

export default function IfscDirectoryPage() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  
  const [stateSummary, setStateSummary] = useState<any[]>([]);
  const [districtSummary, setDistrictSummary] = useState<any[]>([]);
  
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 400); 
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Fetch States for a specific Bank
  useEffect(() => {
    if (selectedBank && !selectedState && !searchQuery) {
      const fetchStates = async () => {
        setIsLoading(true);
        const { data } = await supabase.from('ifsc_codes').select('STATE').eq('BANK', selectedBank);
        
        if (data) {
          const counts = new Map();
          data.forEach((row: any) => {
            const s = row.STATE || 'Unknown';
            counts.set(s, (counts.get(s) || 0) + 1);
          });
          const states = Array.from(counts.entries()).map(([name, count]) => ({ name, count })).sort((a,b) => a.name.localeCompare(b.name));
          setStateSummary(states);
        }
        setIsLoading(false);
      };
      fetchStates();
    }
  }, [selectedBank, selectedState, searchQuery]);

  // Fetch Districts for a specific Bank and State
  useEffect(() => {
    if (selectedBank && selectedState && !selectedDistrict && !searchQuery) {
      const fetchDistricts = async () => {
        setIsLoading(true);
        const { data } = await supabase.from('ifsc_codes').select('DISTRICT').eq('BANK', selectedBank).eq('STATE', selectedState);
        
        if (data) {
          const counts = new Map();
          data.forEach((row: any) => {
            const d = row.DISTRICT || 'Unknown';
            counts.set(d, (counts.get(d) || 0) + 1);
          });
          const dists = Array.from(counts.entries()).map(([name, count]) => ({ name, count })).sort((a,b) => a.name.localeCompare(b.name));
          setDistrictSummary(dists);
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
        setTotalResults(0);
        return;
      }
      setIsLoading(true);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let q = supabase.from('ifsc_codes').select('*', { count: 'exact' });

      // Apply context filters if drilling down
      if (selectedBank) q = q.eq('BANK', selectedBank);
      if (selectedState) q = q.eq('STATE', selectedState);
      if (selectedDistrict) q = q.eq('DISTRICT', selectedDistrict);

      let qText = searchQuery.trim().toLowerCase();

      // Dictionary for bank abbreviations
      const abbreviations: {[key: string]: string} = {
        'sbi': 'state bank',
        'pnb': 'punjab national',
        'boi': 'bank of india',
        'bob': 'bank of baroda',
        'cbi': 'central bank',
        'iob': 'indian overseas',
        'bom': 'bank of maharashtra',
        'ubi': 'union bank',
        'hfc': 'hdfc' 
      };

      Object.keys(abbreviations).forEach(abbr => {
        const regex = new RegExp(`\\b${abbr}\\b`, 'g');
        qText = qText.replace(regex, abbreviations[abbr]);
      });

      if (qText) {
        const words = qText.split(/\s+/).filter(w => w.length > 0);
        words.forEach(word => {
           q = q.or(`IFSC.ilike.%${word}%,BANK.ilike.%${word}%,BRANCH.ilike.%${word}%,CENTRE.ilike.%${word}%,DISTRICT.ilike.%${word}%,CITY.ilike.%${word}%,ADDRESS.ilike.%${word}%`);
        });
      }

      const { data, count, error } = await q.range(start, end);
      
      if (data) { setResultsData(data); setTotalResults(count || 0); }
      setIsLoading(false);
    };
    fetchMainData();
  }, [searchQuery, selectedBank, selectedState, selectedDistrict, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedBank, selectedState, selectedDistrict]);

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

  const showBankList = !searchQuery && !selectedBank;
  const showStateList = !searchQuery && selectedBank && !selectedState;
  const showDistrictList = !searchQuery && selectedBank && selectedState && !selectedDistrict;
  const showResultsList = searchQuery || (selectedBank && selectedState && selectedDistrict);
  
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

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

      <div className="flex flex-wrap items-center gap-3">
        {selectedBank && (
          <button onClick={() => { setSelectedBank(null); setSelectedState(null); setSelectedDistrict(null); setInputValue(''); setSearchQuery(''); }} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 text-sm font-medium">
            ← All Banks
          </button>
        )}
        {selectedState && selectedBank && (
          <button onClick={() => { setSelectedState(null); setSelectedDistrict(null); setInputValue(''); setSearchQuery(''); }} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 text-sm font-medium">
            ← All States
          </button>
        )}
        {selectedDistrict && selectedState && selectedBank && (
          <button onClick={() => { setSelectedDistrict(null); setInputValue(''); setSearchQuery(''); }} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 text-sm font-medium">
            ← All Districts in <span className="capitalize" translate="no">{selectedState.toLowerCase()}</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 animate-pulse text-lg">Fetching live banking data...</p>
        </div>
      ) : (
        <>
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
              {stateSummary.map((state: any, index: number) => (
                <div key={index} onClick={() => setSelectedState(state.name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2 capitalize" translate="no">{state.name?.toLowerCase()}</h3>
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide mt-auto">{state.count} Branches</span>
                </div>
              ))}
            </div>
          )}

          {showDistrictList && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {districtSummary.map((dist: any, index: number) => (
                <div key={index} onClick={() => setSelectedDistrict(dist.name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2 capitalize" translate="no">{dist.name?.toLowerCase()}</h3>
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide mt-auto">{dist.count} Branches</span>
                </div>
              ))}
            </div>
          )}

          {showResultsList && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {resultsData.length > 0 ? (
                resultsData.map((row: any, index: number) => {
                  const bankName = row.BANK || 'N/A';
                  const ifscCode = row.IFSC || 'N/A';
                  const branchName = row.BRANCH || 'N/A';
                  const distName = row.DISTRICT || 'N/A';
                  const stateName = row.STATE || 'N/A';
                  const city = row.CENTRE || row.CITY || 'N/A';
                  const address = row.ADDRESS || 'N/A';
                  const micrCode = row.MICR || 'Not Available';

                  return (
                    <div key={index} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all flex flex-col relative shadow-xl group hover:scale-[1.01]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:bg-blue-500/10 transition-colors"></div>
                      <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-1 group-hover:text-blue-300 capitalize" translate="no">{bankName.toLowerCase()}</h3>
                          <p className="text-sm font-semibold text-slate-300 capitalize flex items-center gap-1" translate="no">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> {branchName.toLowerCase()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="bg-blue-600 text-white px-4 py-2 rounded-xl text-lg font-black shadow-lg shadow-blue-600/20 shrink-0 tracking-widest">{ifscCode}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-2 text-sm flex-grow">
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">City / Centre</span><span className="text-white font-medium truncate block capitalize" translate="no">{city.toLowerCase()}</span></div>
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">MICR Code</span><span className="text-white font-medium truncate block">{micrCode}</span></div>
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">District</span><span className="text-white font-medium truncate block capitalize" translate="no">{distName.toLowerCase()}</span></div>
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">State</span><span className="text-white font-medium truncate block capitalize" translate="no">{stateName.toLowerCase()}</span></div>
                        <div className="col-span-2"><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">Address</span><span className="text-white font-medium block text-xs leading-relaxed capitalize" translate="no">{address.toLowerCase()}</span></div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full py-12 text-center"><p className="text-slate-400 text-lg">No branches found matching "{searchQuery}"</p></div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 mb-8 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({top: 300, behavior: 'smooth'}); }} disabled={currentPage === 1} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-blue-500 transition-all border border-slate-700">Previous</button>
              <span className="text-slate-400 font-medium px-4">Page <span className="text-white text-lg font-bold mx-1">{currentPage}</span> of <span className="text-white mx-1">{totalPages}</span></span>
              <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({top: 300, behavior: 'smooth'}); }} disabled={currentPage === totalPages} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-blue-500 transition-all border border-slate-700">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}