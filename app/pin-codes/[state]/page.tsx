'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function StateDistrictsPage(props: any) {
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const decodedState = props.params?.state ? decodeURIComponent(props.params.state) : '';

  useEffect(() => {
    if (decodedState) {
      fetchDistricts(decodedState);
    }
  }, [decodedState]);

  const fetchDistricts = async (stateName: string) => {
    setIsLoading(true);
    
    // Updated to match your exact database columns: 'districtname', 'statename', 'circlename'
    const { data, error } = await supabase
      .from('pincodes')
      .select('districtname')
      .or(`statename.ilike.%${stateName}%,circlename.ilike.%${stateName}%`)
      .order('districtname');
    
    if (error) {
      console.error("Database Error:", error);
    }
    
    if (data && data.length > 0) {
      // Extracting the 'districtname' column perfectly
      const uniqueDistricts = Array.from(new Set(data.map(d => d.districtname).filter(Boolean)));
      setDistrictsList(uniqueDistricts as string[]);
    }
    
    setIsLoading(false);
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
        <p className="text-slate-400 text-lg">Select a district to explore PIN codes.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#0f172a] p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/pin-codes" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-sm">
            ALL STATES
          </Link>
          <span className="text-slate-600 font-bold">&rarr;</span>
          <span className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold rounded-lg text-sm">
            {decodedState.toUpperCase()}
          </span>
        </div>

        <div className="w-full md:w-72">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search district in ${decodedState}...`}
            className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-slate-500 text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Fetching districts...</p>
        </div>
      ) : (
        <>
          {filteredDistricts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDistricts.map((districtName, index) => (
                <Link 
                  key={index}
                  href={`/pin-codes/${encodeURIComponent(decodedState)}/${encodeURIComponent(districtName)}`}
                  className="group block"
                >
                  <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center hover:bg-slate-800/80 hover:border-orange-500/30 cursor-pointer transition-all shadow-lg h-full">
                    <div className="mb-5 text-slate-500 group-hover:text-orange-400 transition-colors">
                      <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-6 text-center group-hover:text-orange-50 transition-colors">
                      {districtName}
                    </h3>
                    <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold px-5 py-2 rounded-full flex items-center gap-2 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      Select District 
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-[#0f172a] rounded-3xl border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-2">No districts found</h3>
              <p className="text-slate-400">Try adjusting your search query.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}