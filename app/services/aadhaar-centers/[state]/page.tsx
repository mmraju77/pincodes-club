// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function StateDistrictsPage() {
  const params = useParams();
  // Decode the state name exactly as it came from the URL
  const stateName = decodeURIComponent(params.state as string);
  
  const [districts, setDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDistricts() {
      // Use case-insensitive search (ilike) but with wildcards to catch spacing issues
      const { data, error } = await supabase
        .from('aadhaar_centers')
        .select('district')
        .ilike('state', `%${stateName.trim()}%`);

      if (data && data.length > 0) {
        // Filter out null or empty districts and get unique names
        const validData = data.filter(item => item.district);
        const uniqueDistricts = Array.from(new Set(validData.map(item => item.district.trim().toUpperCase()))).sort();
        setDistricts(uniqueDistricts);
      } else {
        console.log("No data found for state:", stateName);
      }
      setIsLoading(false);
    }
    fetchDistricts();
  }, [stateName]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
        <Link href="/services/aadhaar-centers" className="hover:text-blue-400 transition-colors">ALL STATES</Link>
        <span>/</span>
        <span className="text-white">{stateName.toUpperCase()}</span>
      </div>

      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-slate-700 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">{stateName.toUpperCase()}</h1>
        <p className="text-slate-400 text-lg">Select your district to view all active Aadhaar centers.</p>
      </div>

      {isLoading ? (
        <div className="text-center text-blue-400 animate-pulse font-bold text-xl py-12">Loading Districts...</div>
      ) : districts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {districts.map((district) => (
            <Link 
              key={district} 
              href={`/services/aadhaar-centers/${encodeURIComponent(stateName)}/${encodeURIComponent(district)}`}
              className="bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 rounded-xl p-5 transition-all group flex justify-between items-center"
            >
              <span className="text-slate-300 font-bold group-hover:text-white transition-colors">{district}</span>
              <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-800/30 rounded-3xl border border-slate-700/50">
          <span className="text-5xl mb-4 block">😔</span>
          <h3 className="text-2xl font-bold text-white mb-2">No Centers Found</h3>
          <p className="text-slate-400">We are currently updating the database for {stateName}.</p>
        </div>
      )}
    </div>
  );
}