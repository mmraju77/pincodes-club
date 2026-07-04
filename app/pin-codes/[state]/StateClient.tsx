'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

// Phase 12.5: Bulletproof State Keyword Extractor (Ignores spaces and spelling errors)
const getSafeKeyword = (stateName: string) => {
  if (!stateName) return '';
  const s = stateName.toLowerCase().replace(/[^a-z]/g, '');
  if (s.includes('tamil') || s.includes('pudu') || s.includes('pondi')) return 'tamil';
  if (s.includes('chhattisgarh') || s.includes('chattisgarh')) return 'chattis';
  if (s.includes('kerala') || s.includes('lakshadweep')) return 'kerala';
  if (s.includes('maharashtra') || s.includes('goa')) return 'maharashtra';
  if (s.includes('gujarat') || s.includes('daman') || s.includes('diu') || s.includes('dadra')) return 'gujarat';
  if (s.includes('bengal') || s.includes('andaman') || s.includes('sikkim')) return 'bengal';
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
      
      // Fetch data based on bulletproof keyword
      while (keepFetching) {
        const { data, error } = await supabase
          .from('pincodes')
          .select('*')
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
        const normalizedTarget = stateName.toLowerCase().replace(/[^a-z]/g, '');
        
        // Advanced JSON string filtering to bypass column name mismatches
        const finalData = allData.filter((row: any) => {
          const rStr = JSON.stringify(row).toLowerCase().replace(/[^a-z]/g, '');
          
          if (normalizedTarget.includes('pudu') || normalizedTarget.includes('pondi')) return rStr.includes('pudu') || rStr.includes('pondi');
          if (normalizedTarget.includes('andaman')) return rStr.includes('andaman');
          if (normalizedTarget.includes('sikkim')) return rStr.includes('sikkim');
          if (normalizedTarget.includes('arunachal')) return rStr.includes('arunachal');
          if (normalizedTarget.includes('manipur')) return rStr.includes('manipur');
          if (normalizedTarget.includes('meghalaya')) return rStr.includes('meghalaya');
          if (normalizedTarget.includes('mizoram')) return rStr.includes('mizoram');
          if (normalizedTarget.includes('nagaland')) return rStr.includes('nagaland');
          if (normalizedTarget.includes('tripura')) return rStr.includes('tripura');
          if (normalizedTarget.includes('chandigarh')) return rStr.includes('chandigarh');
          if (normalizedTarget.includes('dadra') || normalizedTarget.includes('nagar')) return rStr.includes('dadra') || rStr.includes('nagar');
          if (normalizedTarget.includes('daman') || normalizedTarget.includes('diu')) return rStr.includes('daman') || rStr.includes('diu');
          if (normalizedTarget.includes('goa')) return rStr.includes('goa');
          if (normalizedTarget.includes('lakshadweep')) return rStr.includes('lakshadweep');
          
          if (normalizedTarget.includes('tamil')) return !(rStr.includes('pudu') || rStr.includes('pondi'));
          if (normalizedTarget.includes('bengal')) return !(rStr.includes('andaman') || rStr.includes('sikkim'));
          if (normalizedTarget.includes('punjab')) return !rStr.includes('chandigarh');
          if (normalizedTarget.includes('gujarat')) return !(rStr.includes('dadra') || rStr.includes('daman') || rStr.includes('diu') || rStr.includes('nagar'));
          if (normalizedTarget.includes('maharashtra')) return !rStr.includes('goa');
          if (normalizedTarget.includes('kerala')) return !rStr.includes('lakshadweep');
          if (normalizedTarget.includes('chhattisgarh') || normalizedTarget.includes('chattisgarh')) return rStr.includes('chattis');
          
          return true;
        });

        const uniqueDistricts = Array.from(
          new Set(finalData.map((d: any) => d.districtname || d.Districtname || d.district || d.divisionname).filter(Boolean))
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
      if (searchQuery.length > 2) {
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
      let q = supabase.from('pincodes').select('*').or(`circlename.ilike.%${keyword}%,statename.ilike.%${keyword}%`).limit(300);

      if (/^\d+$/.test(query)) {
        q = q.eq('pincode', Number(query));
      } else {
        q = q.ilike('officename', `%${query}%`);
      }

      const { data, error } = await q;
      if (error) throw error;
      if (data) setSearchResults(data.slice(0, 30));
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
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript.replace(/[^a-zA-Z0-9 ]/g, ""));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const filteredDistricts = districtsList.filter(d => 
    d.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen space-y-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Districts in {decodedState.toUpperCase()}
        </h1>
        <p className="text-slate-400 text-lg">Select a district or search for any village/post office.</p>
        {errorMessage && (
          <p className="text-red-400 mt-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20 inline-block">
            Error: {errorMessage}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-[#0f172a] p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/pin-codes" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-sm">
            ALL STATES
          </Link>
          <span className="text-slate-600 font-bold">&rarr;</span>
          <span className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold rounded-lg text-sm">
            {decodedState.toUpperCase()}
          </span>
        </div>

        <div className="w-full lg:w-96 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Village, Town or PIN..." 
            className="w-full bg-slate-900/80 text-white border border-slate-700 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-slate-500 text-sm"
          />
          <div onClick={startListening} className={`absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-orange-400'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
        </div>
      </div>

      {searchQuery.length > 2 && searchResults.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
            Villages/Post Offices matching "{searchQuery}"
          </h2>
          {isSearching ? (
             <div className="py-12 text-center">
               <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((item, index) => {
                const dName = item.districtname || item.Districtname || item.district || item.divisionname || 'Unknown';
                return (
                  <Link 
                    key={index}
                    href={`/pin-codes/${encodeURIComponent(decodedState)}/${encodeURIComponent(dName)}/${item.pincode}`}
                    className="group block h-full"
                  >
                    <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer h-full shadow-lg flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                            {item.officename}
                          </h3>
                          <span className="text-xs text-slate-400">{item.officetype || 'POST OFFICE'}</span>
                        </div>
                        <span className="bg-orange-500 text-white font-black px-3 py-1 rounded-lg">
                          {item.pincode}
                        </span>
                      </div>
                      <div className="mt-auto text-sm text-slate-400">
                        <p>District: <span className="text-slate-200">{dName}</span></p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {isLoadingDistricts ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 font-medium">Fetching districts...</p>
            </div>
          ) : filteredDistricts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDistricts.map((districtName, index) => (
                <Link key={index} href={`/pin-codes/${encodeURIComponent(decodedState)}/${encodeURIComponent(districtName)}`} className="group block">
                  <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center hover:bg-slate-800/80 hover:border-orange-500/30 cursor-pointer transition-all shadow-lg h-full">
                    <div className="mb-5 text-slate-500 group-hover:text-orange-400 transition-colors">
                      <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-6 text-center group-hover:text-orange-50 transition-colors">
                      {districtName}
                    </h3>
                    <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold px-5 py-2 rounded-full flex items-center gap-2 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      Select District 
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-[#0f172a] rounded-3xl border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
              <p className="text-slate-400">We couldn't find any districts or villages matching your query.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}