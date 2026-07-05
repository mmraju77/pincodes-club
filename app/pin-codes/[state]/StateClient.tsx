'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

const getSafeKeyword = (stateName: string) => {
  if (!stateName) return '';
  const s = stateName.toLowerCase().replace(/[^a-z]/g, '');
  if (s.includes('tamil') || s.includes('pudu') || s.includes('pondi')) return 'tamil';
  if (s.includes('chhattisgarh') || s.includes('chattisgarh')) return 'chattis';
  if (s.includes('kerala') || s.includes('lakshadweep')) return 'kerala';
  if (s.includes('maharashtra') || s.includes('goa')) return 'maharashtra';
  if (s.includes('gujarat') || s.includes('daman') || s.includes('diu') || s.includes('dadra')) return 'gujarat';
  if (s.includes('bengal') || s.includes('andaman') || s.includes('nicobar') || s.includes('sikkim')) return 'bengal';
  if (s.includes('punjab') || s.includes('chandigarh')) return 'punjab';
  if (s.includes('jammu') || s.includes('kashmir')) return 'jammu';
  if (s.includes('arunachal') || s.includes('manipur') || s.includes('meghalaya') || s.includes('mizoram') || s.includes('nagaland') || s.includes('tripura')) return 'north';
  return stateName.split(' ')[0].trim();
};

export default function StateClient() {
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const params = useParams();
  const rawState = params?.state as string;
  const decodedState = rawState ? decodeURIComponent(rawState) : '';

  useEffect(() => {
    if (decodedState) {
      fetchDistricts(decodedState);
    }
  }, [decodedState]);

  const fetchDistricts = async (stateName: string) => {
    setIsLoadingDistricts(true);
    setErrorMessage('');
    
    try {
      const keyword = getSafeKeyword(stateName);
      let allData: any[] = [];
      let keepFetching = true;
      let offset = 0;
      const pageSize = 1000;
      
      while (keepFetching) {
        // Optimized: Removed the non-existent districtname columns to prevent crash
        const { data, error } = await supabase
          .from('pincodes')
          .select('district, divisionname')
          .or(`circlename.ilike.%${keyword}%,statename.ilike.%${keyword}%`)
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
        const uniqueDistricts = Array.from(
          new Set(allData.map((d: any) => d.district || d.divisionname).filter(Boolean))
        );
        uniqueDistricts.sort();
        setDistrictsList(uniqueDistricts as string[]);
      }
    } catch (err: any) {
      console.error("Database Error:", err.message);
      setErrorMessage(err.message);
    }
    
    setIsLoadingDistricts(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performDeepSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performDeepSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const keyword = getSafeKeyword(decodedState);
      const safeQuery = query.trim();
      const dbQuery = safeQuery.replace(/\s+/g, '%');
      
      let q = supabase.from('pincodes').select('pincode, officename, officetype, district, statename, circlename, divisionname').or(`circlename.ilike.%${keyword}%,statename.ilike.%${keyword}%`).limit(16);

      if (/^\d+$/.test(safeQuery)) {
        q = q.eq('pincode', Number(safeQuery));
      } else {
        q = q.or(`officename.ilike.%${dbQuery}%,district.ilike.%${dbQuery}%,divisionname.ilike.%${dbQuery}%`);
      }

      const { data, error } = await q;
      if (error) throw error;
      
      if (data) {
          const sortedData = data.sort((a, b) => {
             const aName = (a.officename || '').toLowerCase();
             const bName = (b.officename || '').toLowerCase();
             const sq = safeQuery.toLowerCase();
             
             if (aName === sq || aName === `${sq} s.o` || aName === `${sq} b.o`) return -1;
             if (bName === sq || bName === `${sq} s.o` || bName === `${sq} b.o`) return 1;
             if (aName.startsWith(sq)) return -1;
             if (bName.startsWith(sq)) return 1;
             return 0;
          });
          
          const uniqueResults = sortedData.filter((v, i, a) => a.findIndex(t => (t.pincode === v.pincode && t.officename === v.officename)) === i);
          setSearchResults(uniqueResults);
      }
    } catch (err: any) {
      console.error("Search error:", err);
    }
    setIsSearching(false);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-IN'; 
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = event.results[0][0].transcript;
        let cleaned = transcript.replace(/[.,!?]/g, '').trim();
        if (/^[\d\s]+$/.test(cleaned)) {
            cleaned = cleaned.replace(/\s+/g, ''); 
        }
        setSearchQuery(cleaned);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const filteredDistricts = districtsList.filter(d => 
    d.toLowerCase().replace(/\s+/g, '').includes(searchQuery.toLowerCase().replace(/\s+/g, ''))
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 min-h-screen space-y-10">
      <div className="bg-[#0f172a] p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start mb-3">
            <Link href="/pin-codes" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-xs">
              ALL STATES
            </Link>
            <span className="text-slate-600 font-bold text-sm">&rarr;</span>
            <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold rounded-lg text-xs uppercase">
              {decodedState}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            Districts in {decodedState.toUpperCase()}
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Browse by state, district, and village, or search any post office details.</p>
          {errorMessage && (
            <p className="text-red-400 mt-3 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 inline-block text-sm">
              Error: {errorMessage}
            </p>
          )}
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search District, Village, Town or PIN..." 
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-slate-500 text-sm"
            />
            <div onClick={startListening} className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-orange-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7-7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {isLoadingDistricts ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 font-medium text-sm">Fetching districts...</p>
        </div>
      ) : searchQuery.trim().length > 2 ? (
        <div className="space-y-10">
          {filteredDistricts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 mb-4">
                Districts matching "{searchQuery}"
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredDistricts.map((districtName, index) => (
                  <Link key={index} href={`/pin-codes/${encodeURIComponent(decodedState)}/${encodeURIComponent(districtName)}`} className="group block">
                    <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-800 hover:border-orange-500/30 cursor-pointer transition-all shadow-sm">
                      <div className="text-slate-500 group-hover:text-orange-400 transition-colors shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-orange-50 transition-colors line-clamp-2">
                          {districtName}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 mb-4">
              Villages & Post Offices matching "{searchQuery}"
            </h2>
            {isSearching ? (
               <div className="py-12 text-center">
                 <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
               </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {searchResults.map((item, index) => {
                  const dName = item.district || item.divisionname || 'Unknown';
                  return (
                    <Link key={index} href={`/pin-codes/${encodeURIComponent(decodedState)}/${encodeURIComponent(dName)}/${item.pincode}`} className="group block h-full">
                      <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer h-full shadow-md flex flex-col justify-between">
                        <div className="mb-3">
                          <div className="flex justify-between items-start gap-2 mb-2">
                             <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1" title={item.officename}>
                               {item.officename}
                             </h3>
                             <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold px-2 py-0.5 rounded text-xs shrink-0">
                               {item.pincode}
                             </span>
                          </div>
                          <span className="text-[10px] uppercase text-slate-500 font-semibold">{item.officetype || 'POST OFFICE'}</span>
                        </div>
                        <div className="mt-auto text-xs text-slate-400 space-y-1">
                          <p className="line-clamp-1">District: <span className="text-slate-200">{dName}</span></p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#0f172a] rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm">No post offices found matching "{searchQuery}".</p>
              </div>
            )}
          </div>
        </div>
      ) : filteredDistricts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredDistricts.map((districtName, index) => (
            <Link key={index} href={`/pin-codes/${encodeURIComponent(decodedState)}/${encodeURIComponent(districtName)}`} className="group block">
              <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-800 hover:border-orange-500/30 cursor-pointer transition-all shadow-sm">
                <div className="text-slate-500 group-hover:text-orange-400 transition-colors shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-orange-50 transition-colors line-clamp-2">
                    {districtName}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0f172a] rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-2">No districts found</h3>
          <p className="text-slate-400 text-sm">We couldn't find any districts matching your query.</p>
        </div>
      )}
    </div>
  );
}