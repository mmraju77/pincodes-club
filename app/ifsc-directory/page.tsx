'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function IfscPage() {
  
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtSummary, setDistrictSummary] = useState<any[]>([]);
  
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    if (inputValue === '') {
      setSearchQuery('');
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
      setShowSuggestions(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Fetch Suggestions
  useEffect(() => {
    if (searchQuery.length < 3) { setSuggestions([]); return; }
    const fetchSuggestions = async () => {
      const qText = searchQuery.trim();
      let q = supabase.from('ifsc_codes').select('bank, BANK, ifsc, IFSC, branch, BRANCH, district, DISTRICT, state, STATE').limit(6);
      
      q = q.or(`ifsc.ilike.%${qText}%,IFSC.ilike.%${qText}%,bank.ilike.%${qText}%,BANK.ilike.%${qText}%,branch.ilike.%${qText}%,BRANCH.ilike.%${qText}%`);
      
      const { data } = await q;
      if (data) setSuggestions(data);
    };
    fetchSuggestions();
  }, [searchQuery]);

  // Fetch Districts
  useEffect(() => {
    if (selectedState && !selectedDistrict && !searchQuery) {
      const fetchDistricts = async () => {
        setIsLoading(true);
        let { data } = await supabase.from('ifsc_codes').select('district, DISTRICT').ilike('state', `%${selectedState}%`);
        
        if (!data || data.length === 0) {
            const res = await supabase.from('ifsc_codes').select('district, DISTRICT').ilike('STATE', `%${selectedState}%`);
            data = res.data;
        }
        
        if (data) {
          const counts = new Map();
          data.forEach((row: any) => {
            const d = row.district || row.DISTRICT || 'Unknown';
            counts.set(d, (counts.get(d) || 0) + 1);
          });
          const dists = Array.from(counts.entries()).map(([name, count]) => ({ name, count })).sort((a,b) => a.name.localeCompare(b.name));
          setDistrictSummary(dists);
        }
        setIsLoading(false);
      };
      fetchDistricts();
    }
  }, [selectedState, selectedDistrict, searchQuery]);

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
      const qText = searchQuery.trim();

      if (searchQuery) {
        q = q.or(`ifsc.ilike.%${qText}%,IFSC.ilike.%${qText}%,bank.ilike.%${qText}%,BANK.ilike.%${qText}%,branch.ilike.%${qText}%,BRANCH.ilike.%${qText}%`);
      } else if (selectedDistrict && selectedState) {
        q = q.ilike('state', `%${selectedState}%`).ilike('district', `%${selectedDistrict}%`);
      }

      let { data, count, error } = await q.range(start, end);
      
      if (error && selectedDistrict && selectedState && !searchQuery) {
          const fallbackQ = supabase.from('ifsc_codes').select('*', { count: 'exact' })
            .ilike('STATE', `%${selectedState}%`).ilike('DISTRICT', `%${selectedDistrict}%`);
          const res = await fallbackQ.range(start, end);
          data = res.data;
          count = res.count;
      }

      if (data) { setResultsData(data); setTotalResults(count || 0); }
      setIsLoading(false);
    };
    fetchMainData();
  }, [searchQuery, selectedDistrict, selectedState, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedState, selectedDistrict]);
  useEffect(() => { if (inputValue.length > 0) { setSelectedState(null); setSelectedDistrict(null); } }, [inputValue]);

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

  const showStateList = !searchQuery && !selectedState;
  const showDistrictList = !searchQuery && selectedState && !selectedDistrict;
  const showResultsList = searchQuery || (selectedState && selectedDistrict);
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-orange-500 transition-colors" translate="no">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium" translate="no">IFSC DIRECTORY</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">Banking Directory</div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">India IFSC Codes Hub</h1>
            <p className="text-slate-300 text-base font-light max-w-xl">Search any bank branch, IFSC code, or browse through states and districts.</p>
          </div>
          
          <div className="w-full md:w-96 relative flex items-center">
            <svg className="w-5 h-5 absolute left-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search IFSC, Bank Name, Branch..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} 
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-orange-500 transition-colors shadow-inner font-medium"
            />
            <button onClick={handleVoiceSearch} className={`absolute right-2 p-2 rounded-lg transition-all ${isListening ? 'bg-orange-500 animate-pulse text-white' : 'text-slate-400 hover:text-orange-400 hover:bg-slate-800'}`} title="Voice Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-14 left-0 z-50 w-full bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                {suggestions.map((row: any, idx: number) => {
                  const bName = row.bank || row.BANK || 'Bank';
                  const ifscCode = row.ifsc || row.IFSC;
                  const dist = row.district || row.DISTRICT;
                  return (
                    <li key={idx} onClick={() => { setInputValue(ifscCode); setSearchQuery(ifscCode); setShowSuggestions(false); }} className="px-4 py-3 hover:bg-orange-500 cursor-pointer border-b border-slate-700 last:border-0 transition-colors group flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200 group-hover:text-white truncate max-w-[200px]" translate="no">{bName} - {row.branch || row.BRANCH}</span>
                        <span className="text-xs text-slate-400 group-hover:text-orange-100 truncate max-w-[200px]" translate="no">{dist}, {row.state || row.STATE}</span>
                      </div>
                      <span className="text-xs font-black bg-slate-900 text-orange-400 px-2 py-1 rounded group-hover:bg-white group-hover:text-orange-600 shrink-0">{ifscCode}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {selectedState && <button onClick={() => { setSelectedState(null); setSelectedDistrict(null); setInputValue(''); setSearchQuery(''); }} className="flex items-center gap-2 text-orange-400 hover:text-white transition-colors bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20 text-sm font-medium">← All States</button>}
        {selectedDistrict && <button onClick={() => {setSelectedDistrict(null); setInputValue(''); setSearchQuery('');}} className="flex items-center gap-2 text-orange-400 hover:text-white transition-colors bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20 text-sm font-medium">← All Districts in <span translate="no">{selectedState}</span></button>}
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 animate-pulse text-lg">Fetching live bank data...</p>
        </div>
      ) : (
        <>
          {showStateList && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {INDIAN_STATES.map((stateName, index) => (
                <div key={index} onClick={() => setSelectedState(stateName)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-orange-500/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-2" translate="no">{stateName}</h3>
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide mt-auto">Explore Districts ➔</span>
                </div>
              ))}
            </div>
          )}

          {showDistrictList && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {districtSummary.map((dist: any, index: number) => (
                <div key={index} onClick={() => setSelectedDistrict(dist.name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-orange-500/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏦</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-2" translate="no">{dist.name}</h3>
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide mt-auto">{dist.count} Branches</span>
                </div>
              ))}
            </div>
          )}

          {showResultsList && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resultsData.length > 0 ? (
                resultsData.map((row: any, index: number) => {
                  const bName = row.bank || row.BANK || 'Bank Name N/A';
                  const ifscCode = row.ifsc || row.IFSC || 'N/A';
                  const branchName = row.branch || row.BRANCH || 'N/A';
                  const stateName = row.state || row.STATE || 'N/A';
                  const distName = row.district || row.DISTRICT || 'N/A';
                  const addr = row.address || row.ADDRESS || 'N/A';

                  return (
                    <div key={index} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-all flex flex-col relative shadow-xl group hover:scale-[1.01]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-[100px] -z-10 group-hover:bg-orange-500/10 transition-colors"></div>
                      <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                        <div>
                          <h3 className="text-xl font-bold text-orange-400 mb-1 group-hover:text-orange-300" translate="no">{bName}</h3>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> {branchName}
                          </p>
                        </div>
                        <span className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xl font-black shadow-lg shadow-orange-600/20 shrink-0 tracking-widest">{ifscCode}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-2 text-sm flex-grow">
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">State</span><span className="text-white font-medium truncate block" translate="no">{stateName}</span></div>
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">District</span><span className="text-white font-medium truncate block" translate="no">{distName}</span></div>
                        <div className="col-span-2"><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">Address</span><span className="text-white font-medium block text-xs leading-relaxed" translate="no">{addr}</span></div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full py-12 text-center"><p className="text-slate-400 text-lg">No Bank records found matching "{searchQuery}"</p></div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 mb-8 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({top: 300, behavior: 'smooth'}); }} disabled={currentPage === 1} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-orange-500 transition-all border border-slate-700">Previous</button>
              <span className="text-slate-400 font-medium px-4">Page <span className="text-white text-lg font-bold mx-1">{currentPage}</span> of <span className="text-white mx-1">{totalPages}</span></span>
              <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({top: 300, behavior: 'smooth'}); }} disabled={currentPage === totalPages} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-orange-500 transition-all border border-slate-700">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}