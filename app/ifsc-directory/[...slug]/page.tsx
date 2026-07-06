'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

// Helper to convert URL slugs to database readable text (e.g., "state-bank-of-india" -> "STATE BANK OF INDIA")
const formatFromSlug = (slug: string) => {
  if (!slug) return '';
  return decodeURIComponent(slug).replace(/-/g, ' ').toUpperCase();
};

const formatToSlug = (text: string) => {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const formatContact = (contact: any) => {
  if (!contact || contact === 'Not Available' || contact === 'NULL') return 'Not Available';
  let str = String(contact).trim();
  if (str.toUpperCase().includes('E')) return 'Not Available';
  if (str.endsWith('.0')) str = str.slice(0, -2);
  return (str === 'NaN' || str === '' || str === '0') ? 'Not Available' : str;
};

export default function DynamicIfscPage({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  
  // URL Path Logic: [bank, state, city, branch]
  const bankSlug = slug[0] || null;
  const stateSlug = slug[1] || null;
  const citySlug = slug[2] || null;
  const branchSlug = slug[3] || null;

  const dbBank = formatFromSlug(bankSlug || '');
  const dbState = formatFromSlug(stateSlug || '');
  const dbCity = formatFromSlug(citySlug || '');
  const dbBranch = formatFromSlug(branchSlug || '');

  const [dataList, setDataList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Magic Fetch Logic based on URL Depth
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let q = supabase.from('ifsc_codes').select('*');
        
        if (dbBank) q = q.ilike('bank', `%${dbBank}%`);
        if (dbState) q = q.eq('state', dbState);
        if (dbCity) q = q.or(`centre.eq.${dbCity},city.eq.${dbCity}`);
        if (dbBranch) q = q.ilike('branch', `%${dbBranch}%`);

        // Limit results depending on level to avoid crashing
        q = q.limit(branchSlug ? 1 : 2000); 

        const { data, error } = await q;
        if (error) throw error;
        
        if (data) {
          setDataList(data);
        }
      } catch (error) {
        console.error("DB Error", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [dbBank, dbState, dbCity, dbBranch]);

  // Derive next options based on current level
  let displayCards: { name: string; url: string }[] = [];
  
  if (dataList.length > 0) {
    if (bankSlug && !stateSlug) {
      // Show States
      const states = Array.from(new Set(dataList.map(d => d.state))).filter(Boolean) as string[];
      displayCards = states.sort().map(s => ({ name: s, url: `/ifsc-directory/${bankSlug}/${formatToSlug(s)}` }));
    } 
    else if (bankSlug && stateSlug && !citySlug) {
      // Show Cities (Centres)
      const cities = Array.from(new Set(dataList.map(d => d.centre || d.city))).filter(Boolean) as string[];
      displayCards = cities.sort().map(c => ({ name: c, url: `/ifsc-directory/${bankSlug}/${stateSlug}/${formatToSlug(c)}` }));
    }
    else if (bankSlug && stateSlug && citySlug && !branchSlug) {
      // Show Branches
      const branches = Array.from(new Set(dataList.map(d => d.branch))).filter(Boolean) as string[];
      displayCards = branches.sort().map(b => ({ name: b, url: `/ifsc-directory/${bankSlug}/${stateSlug}/${citySlug}/${formatToSlug(b)}` }));
    }
  }

  // Branch Detail View
  if (branchSlug && dataList.length > 0) {
    const branchInfo = dataList[0];
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col min-h-screen space-y-6">
        <Breadcrumbs slugs={slug} />
        <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] -z-10"></div>
           <div className="flex justify-between items-start border-b border-slate-700 pb-6 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-blue-400 mb-2 capitalize">{branchInfo.bank?.toLowerCase()}</h1>
                <p className="text-lg text-white font-medium capitalize">📍 {branchInfo.branch?.toLowerCase()}</p>
              </div>
              <span className="bg-blue-600 text-white px-5 py-3 rounded-xl text-xl font-black tracking-widest shadow-lg">{branchInfo.ifsc}</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div><span className="text-slate-500 uppercase font-bold block mb-1 text-xs">City</span><span className="text-white text-lg capitalize">{branchInfo.centre?.toLowerCase()}</span></div>
              <div><span className="text-slate-500 uppercase font-bold block mb-1 text-xs">District</span><span className="text-white text-lg capitalize">{branchInfo.district?.toLowerCase()}</span></div>
              <div><span className="text-slate-500 uppercase font-bold block mb-1 text-xs">State</span><span className="text-white text-lg capitalize">{branchInfo.state?.toLowerCase()}</span></div>
              <div><span className="text-slate-500 uppercase font-bold block mb-1 text-xs">Contact</span><span className="text-white text-lg">{formatContact(branchInfo.contact || branchInfo.phone)}</span></div>
              <div className="col-span-full"><span className="text-slate-500 uppercase font-bold block mb-1 text-xs">Address</span><span className="text-white text-base leading-relaxed capitalize">{branchInfo.address?.toLowerCase()}</span></div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <Breadcrumbs slugs={slug} />
      
      <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
        <h1 className="text-3xl font-extrabold text-white capitalize mb-2">
          {dbBank.toLowerCase()} {dbState && `in ${dbState.toLowerCase()}`} {dbCity && `- ${dbCity.toLowerCase()}`}
        </h1>
        <p className="text-slate-400">Select an option below to continue.</p>
      </div>

      {isLoading ? (
        <div className="py-24 text-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayCards.length > 0 ? displayCards.map((card, i) => (
            <Link href={card.url} key={i} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all flex flex-col items-center justify-center text-center group">
               <h3 className="text-white font-semibold text-lg capitalize group-hover:text-blue-400">{card.name.toLowerCase()}</h3>
               <span className="text-slate-500 text-xs mt-3 group-hover:text-blue-400">View Details ➔</span>
            </Link>
          )) : (
            <p className="text-slate-400 col-span-full text-center py-12">No data found for this selection.</p>
          )}
        </div>
      )}
    </div>
  );
}

// Helper Component for the Path Links
function Breadcrumbs({ slugs }: { slugs: string[] }) {
  let currentPath = '/ifsc-directory';
  return (
    <nav className="flex flex-wrap text-sm font-medium gap-2 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
      <Link href={currentPath} className="text-blue-400 hover:text-white">HOME</Link>
      {slugs.map((s, idx) => {
        currentPath += `/${s}`;
        return (
          <span key={idx} className="flex items-center gap-2">
            <span className="text-slate-600">➔</span>
            <Link href={currentPath} className="text-blue-400 hover:text-white capitalize">{s.replace(/-/g, ' ')}</Link>
          </span>
        );
      })}
    </nav>
  );
}