// @ts-nocheck
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// 🛠️ 1. Scalable Dictionary for Legacy Data Correction
const LEGACY_GEOGRAPHY_MAP: Record<string, { outdated: RegExp[], correct: string }> = {
  'paderu': {
    outdated: [/Visakhapatnam/ig, /Visakha Dist/ig, /Dist\.?\s*Visakhapatnam/ig, /Paderu District/ig],
    correct: 'Alluri Sitharama Raju District'
  }
  // Future-proof: You can add more cities and their new districts here
};

// 🛠️ 2. Garbage String Filter (For internal bank codes like HTHB, APGB etc.)
const removeGarbageStrings = (text: string) => {
  let cleanText = text;
  const garbagePatterns = [
    /Hthb\s*,\s*R\s*,\s*Rhtp\s*,\s*Pp/ig, 
    /Apgb\s*Paderu/ig,
    /Pnb\s*Paderu/ig
  ];
  
  garbagePatterns.forEach(pattern => {
    cleanText = cleanText.replace(pattern, 'Main Branch');
  });
  return cleanText;
};

// 🛠️ 3. Advanced Normalization Engine
const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatCleanAddress = (rawAddress: string, branchName: string, city: string, state: string) => {
  let addr = (rawAddress && rawAddress.length > 5) ? rawAddress : branchName;
  const cityKey = city.trim().toLowerCase();

  // A. Execute Legacy Geography Corrections
  if (LEGACY_GEOGRAPHY_MAP[cityKey]) {
    LEGACY_GEOGRAPHY_MAP[cityKey].outdated.forEach(regex => {
      addr = addr.replace(regex, LEGACY_GEOGRAPHY_MAP[cityKey].correct);
    });
  }

  // B. Remove Bank Internal Codes & Messy Formatting
  addr = removeGarbageStrings(addr);
  addr = addr.replace(/,+/g, ', ').replace(/\s+/g, ' ').trim();
  addr = addr.replace(/,\s*$/, ''); 
  
  // C. Title Casing for Professional UI
  addr = toTitleCase(addr);
  const cleanCity = toTitleCase(city);
  const cleanState = toTitleCase(state);
  
  // D. Ensure City and State are properly appended without duplication
  if (!addr.toLowerCase().includes(cleanCity.toLowerCase())) {
    addr = `${addr}, ${cleanCity}`;
  }
  if (cleanState && !addr.toLowerCase().includes(cleanState.toLowerCase())) {
    addr = `${addr}, ${cleanState}`;
  }
  
  return addr;
};

export default function ATMLocatorPage() {
  const [city, setCity] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [atmResults, setAtmResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState('');

  const topBanks = [
    "STATE BANK OF INDIA", "HDFC BANK", "ICICI BANK LIMITED", 
    "AXIS BANK", "PUNJAB NATIONAL BANK", "BANK OF BARODA", 
    "UNION BANK OF INDIA", "CANARA BANK"
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;
    
    setIsSearching(true);
    setAtmResults([]);
    setSearchError('');

    try {
      let query = supabase
        .from('ifsc_codes')
        .select('*')
        .ilike('city', `%${city.trim()}%`)
        .limit(20);

      if (selectedBank) {
        query = query.eq('bank', selectedBank.toUpperCase());
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData = data.map(branch => {
          // Pass raw data through the Normalization Engine
          const cleanedAddress = formatCleanAddress(branch.address, branch.branch, branch.city, branch.state);
          const cleanedBranchName = toTitleCase(branch.branch);
          
          return {
            id: branch.id,
            bank: toTitleCase(branch.bank),
            address: cleanedAddress,
            branchName: cleanedBranchName,
            status: 'Likely Open 24/7 (Branch Attached)',
            type: 'Cash & Services'
          };
        });
        setAtmResults(formattedData);
      } else {
        setSearchError('No branches or ATMs found in this specific location. Try searching a major nearby city.');
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setSearchError('Connection error. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-teal-500/10 rounded-2xl mb-2">
          <span className="text-6xl drop-shadow-md">🏧</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">ATM Locator</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Find the nearest ATMs and bank branches in your city instantly, powered by our live directory.
        </p>
      </div>

      <div className="bg-[#0f172a] p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <form onSubmit={handleSearch} className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="relative">
              <label className="block text-sm font-bold text-slate-400 mb-2">ENTER CITY NAME</label>
              <div className="absolute inset-y-0 top-7 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-teal-500 rounded-xl text-white font-medium outline-none transition-all shadow-inner uppercase"
                placeholder="E.g., PADERU or HYDERABAD"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-slate-400 mb-2">SELECT BANK (OPTIONAL)</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-teal-500 rounded-xl text-white font-medium outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">All Banks</option>
                {topBanks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 top-7 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSearching}
                className={`w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-lg font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 ${isSearching ? 'animate-pulse' : 'hover:-translate-y-1'}`}
              >
                {isSearching ? 'Locating...' : 'Find ATMs Near Me'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {searchError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-semibold mb-8 animate-fade-in-up">
          {searchError}
        </div>
      )}

      {atmResults.length > 0 && (
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Found {atmResults.length} Branches/ATMs in {toTitleCase(city)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {atmResults.map((atm, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-md border border-slate-700 hover:border-teal-500/50 rounded-2xl p-6 shadow-xl transition-all group flex gap-4 flex-col sm:flex-row">
                
                <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 hidden sm:flex">
                  <span className="text-2xl">📍</span>
                </div>
                
                <div className="w-full">
                  <div className="flex flex-col xl:flex-row justify-between items-start mb-2 gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                      {atm.bank} <span className="text-sm font-normal text-slate-400 block sm:inline">({atm.branchName})</span>
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 uppercase tracking-wider whitespace-nowrap border border-emerald-500/30">
                      {atm.status}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">{atm.address}</p>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-700 pt-4 gap-4">
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {atm.type}
                    </span>
                    
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${atm.bank} ATM, ${atm.branchName}, ${city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg hover:shadow-teal-500/20"
                    >
                      Get Directions 
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}