// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function DistrictCentersPage() {
  const params = useParams();
  const stateName = decodeURIComponent(params.state as string).toUpperCase();
  const districtName = decodeURIComponent(params.district as string).toUpperCase();
  
  const [centers, setCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCenters() {
      const { data, error } = await supabase
        .from('aadhaar_centers')
        .select('*')
        .ilike('state', stateName)
        .ilike('district', districtName);

      if (data) setCenters(data);
      setIsLoading(false);
    }
    fetchCenters();
  }, [stateName, districtName]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
        <Link href="/services/aadhaar-centers" className="hover:text-blue-400 transition-colors">ALL STATES</Link>
        <span>/</span>
        <Link href={`/services/aadhaar-centers/${encodeURIComponent(stateName)}`} className="hover:text-blue-400 transition-colors">{stateName}</Link>
        <span>/</span>
        <span className="text-white">{districtName}</span>
      </div>

      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-slate-700 rounded-3xl p-8 md:p-10 mb-10 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">{districtName} District</h1>
        <p className="text-slate-400">Showing {centers.length} registered Aadhaar Centers</p>
      </div>

      {isLoading ? (
        <div className="text-center text-blue-400 animate-pulse font-bold text-xl py-12">Fetching Centers...</div>
      ) : centers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {centers.map((center, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-md border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {toTitleCase(center.center_name)}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 uppercase tracking-wider whitespace-nowrap border border-emerald-500/30">Active</span>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{toTitleCase(center.address)}</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">City / Town</span>
                    <span className="text-sm text-slate-300 font-medium">{toTitleCase(center.city)}</span>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Pincode</span>
                    <span className="text-sm text-blue-400 font-bold">{center.pincode}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-700 pt-4 mt-2">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${center.center_name}, ${center.address}, ${center.pincode}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-700 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-blue-500/20"
                >
                  📍 Get Directions on Map
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-lg">No centers found in this district yet.</div>
      )}
    </div>
  );
}