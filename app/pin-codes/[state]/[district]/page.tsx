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

export default function DistrictOfficesPage() {
  const params = useParams();
  const stateName = decodeURIComponent(params.state as string).toUpperCase();
  const districtName = decodeURIComponent(params.district as string).toUpperCase();
  
  const [offices, setOffices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOffices() {
      const { data } = await supabase
        .from('pincodes')
        .select('*')
        .ilike('statename', `%${stateName}%`)
        .ilike('districtname', `%${districtName}%`);

      if (data) setOffices(data);
      setIsLoading(false);
    }
    fetchOffices();
  }, [stateName, districtName]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
        <Link href="/pin-codes" className="hover:text-purple-400">ALL STATES</Link>
        <span>/</span>
        <Link href={`/pin-codes/${encodeURIComponent(stateName)}`} className="hover:text-purple-400">{stateName}</Link>
        <span>/</span>
        <span className="text-white">{districtName}</span>
      </div>

      <div className="bg-gradient-to-r from-purple-900/40 to-slate-900 border border-slate-700 rounded-3xl p-8 md:p-10 mb-10 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">{districtName} Postal Region</h1>
        <p className="text-slate-400">Showing {offices.length} registered Post Offices and Villages</p>
      </div>

      {isLoading ? (
        <div className="text-center text-purple-400 animate-pulse font-bold text-xl py-12">Fetching Offices...</div>
      ) : offices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offices.map((item, index) => (
             <div key={index} className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl group hover:border-purple-500/50 transition-all">
             <div className="flex justify-between items-start mb-4 border-b border-slate-700/50 pb-4">
               <div>
                 <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                   {toTitleCase(item.officename)}
                 </h3>
                 <p className="text-slate-400 text-sm mt-1">Status: <span className="text-emerald-400">{item.deliverystatus || 'Available'}</span></p>
               </div>
               <div className="bg-purple-500/10 px-3 py-2 rounded-lg text-center border border-purple-500/30">
                 <span className="block text-[10px] text-purple-300 font-bold uppercase mb-1">PINCODE</span>
                 <span className="text-lg text-white font-black">{item.pincode}</span>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <span className="block text-xs text-slate-500 uppercase">Office Type</span>
                 <span className="text-sm text-slate-300 font-bold">{item.officetype || 'N/A'}</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-500 uppercase">Region / Taluk</span>
                 <span className="text-sm text-slate-300">{toTitleCase(item.regionname || item.taluk || 'N/A')}</span>
               </div>
             </div>
           </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-lg">No offices found in this district yet.</div>
      )}
    </div>
  );
}