// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PincodeDistrictsPage() {
  const params = useParams();
  const stateName = decodeURIComponent(params.state as string);
  
  const [districts, setDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDistricts() {
      // Fetch districts from pincodes table using exactly 'statename' and 'districtname'
      const { data } = await supabase
        .from('pincodes')
        .select('districtname')
        .ilike('statename', `%${stateName.trim()}%`);

      if (data && data.length > 0) {
        const validDistricts = data.filter(item => item.districtname);
        const uniqueDistricts = Array.from(new Set(validDistricts.map(item => item.districtname.trim().toUpperCase()))).sort();
        setDistricts(uniqueDistricts);
      }
      setIsLoading(false);
    }
    fetchDistricts();
  }, [stateName]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
        <Link href="/pin-codes" className="hover:text-purple-400 transition-colors">ALL STATES</Link>
        <span>/</span>
        <span className="text-white">{stateName.toUpperCase()}</span>
      </div>

      <div className="bg-gradient-to-r from-purple-900/40 to-slate-900 border border-slate-700 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">{stateName.toUpperCase()}</h1>
        <p className="text-slate-400 text-lg">Select your district to view regional and village post offices.</p>
      </div>

      {isLoading ? (
        <div className="text-center text-purple-400 animate-pulse font-bold text-xl py-12">Loading Districts...</div>
      ) : districts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {districts.map((district) => (
            <Link 
              key={district} 
              href={`/pin-codes/${encodeURIComponent(stateName)}/${encodeURIComponent(district)}`}
              className="bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/50 rounded-xl p-5 transition-all group flex justify-between items-center"
            >
              <span className="text-slate-300 font-bold group-hover:text-white transition-colors">{district}</span>
              <svg className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-lg">No districts found. Please check database data.</div>
      )}
    </div>
  );
}