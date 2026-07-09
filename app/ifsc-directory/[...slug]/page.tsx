// @ts-nocheck
'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../lib/supabase';

// Expert Fix: Safely parse URL segments for exact matching
const formatFromSlug = (slug) => {
  if (!slug) return '';
  return decodeURIComponent(slug).replace(/-/g, ' ').trim();
};

const formatToSlug = (text) => {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const formatContactNumber = (contact) => {
  if (!contact || contact === 'Not Available' || contact === 'NULL') return 'Not Available';
  let strContact = String(contact).trim();
  if (strContact.toUpperCase().includes('E')) return 'Not Available';
  if (strContact.endsWith('.0')) strContact = strContact.slice(0, -2);
  if (strContact === 'NaN' || strContact === '' || strContact === '0') return 'Not Available';
  return strContact;
};

export default function DynamicIfscPage(props) {
  // Unwrap Next.js 15 Promise safely
  const params = props.params instanceof Promise ? use(props.params) : props.params;
  const slug = params?.slug || [];

  // Strict Hierarchy Definition: [Bank] / [State] / [District] / [City] / [Branch]
  const bankSlug = slug[0] || null;
  const stateSlug = slug[1] || null;
  const districtSlug = slug[2] || null;
  const citySlug = slug[3] || null;
  const branchSlug = slug[4] || null;

  const dbBank = formatFromSlug(bankSlug);
  const dbState = formatFromSlug(stateSlug);
  const dbDistrict = formatFromSlug(districtSlug);
  const dbCity = formatFromSlug(citySlug);
  const dbBranch = formatFromSlug(branchSlug);

  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data dynamically based on strict path depth matching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // EXPERT ARCHITECTURE: Fetching only required columns for faster loading & Using Strict ILIKE without wildcards
        let q = supabase.from('ifsc_codes').select('bank, state, district, city, centre, branch, ifsc, address, contact, phone, micr');
        
        if (dbBank) q = q.ilike('bank', dbBank);
        if (dbState) q = q.ilike('state', dbState);
        if (dbDistrict) q = q.ilike('district', dbDistrict);
        if (dbCity) q = q.or(`centre.ilike.${dbCity},city.ilike.${dbCity}`);
        if (dbBranch) q = q.ilike('branch', dbBranch);

        // Increased limit to 20,000 to perfectly load massive banks like SBI in major states without missing any districts
        q = q.limit(branchSlug ? 1 : 20000); 

        const { data, error } = await q;
        if (error) throw error;
        if (data) setDataList(data);
      } catch (error) {
        console.error("Database query execution error:", error);
      }
      setIsLoading(false);
    };

    if (bankSlug) {
      fetchData();
    }
  }, [dbBank, dbState, dbDistrict, dbCity, dbBranch, bankSlug]);

  // Handle structural routing states based purely on URL depth
  let displayCards = [];
  let isFinalBranchView = false;
  let branchDataToShow = [];

  if (dataList.length > 0) {
    // LEVEL 1: Bank -> Shows States
    if (bankSlug && !stateSlug) {
      const uniqueStates = Array.from(new Set(dataList.map(d => d.state?.trim().toUpperCase()))).filter(Boolean);
      displayCards = uniqueStates.sort().map(s => ({
        name: s,
        icon: '🗺️',
        label: 'Select State ➔',
        url: `/ifsc-directory/${bankSlug}/${formatToSlug(s)}`
      }));
    } 
    // LEVEL 2: Bank + State -> Shows STRICTLY Districts
    else if (bankSlug && stateSlug && !districtSlug) {
      const uniqueDistricts = Array.from(new Set(dataList.map(d => d.district?.trim().toUpperCase()))).filter(Boolean);
      displayCards = uniqueDistricts.sort().map(d => ({
        name: d,
        icon: '🏢',
        label: 'Select District ➔',
        url: `/ifsc-directory/${bankSlug}/${stateSlug}/${formatToSlug(d)}`
      }));
    }
    // LEVEL 3: Bank + State + District -> Shows Cities
    else if (bankSlug && stateSlug && districtSlug && !citySlug) {
      const uniqueCities = Array.from(new Set(dataList.map(d => (d.centre || d.city)?.trim().toUpperCase()))).filter(Boolean);
      displayCards = uniqueCities.sort().map(c => ({
        name: c,
        icon: '🏙️',
        label: 'Select City ➔',
        url: `/ifsc-directory/${bankSlug}/${stateSlug}/${districtSlug}/${formatToSlug(c)}`
      }));
    }
    // LEVEL 4: Bank + State + District + City -> Shows Branches
    else if (bankSlug && stateSlug && districtSlug && citySlug && !branchSlug) {
      const uniqueBranches = Array.from(new Set(dataList.map(d => d.branch?.trim().toUpperCase()))).filter(Boolean);
      displayCards = uniqueBranches.sort().map(b => ({
        name: b,
        icon: '🏦',
        label: 'View Branch ➔',
        url: `/ifsc-directory/${bankSlug}/${stateSlug}/${districtSlug}/${citySlug}/${formatToSlug(b)}`
      }));
    }
    // LEVEL 5: Full Path -> Show Branch Card
    else if (bankSlug && stateSlug && districtSlug && citySlug && branchSlug) {
      isFinalBranchView = true;
      branchDataToShow = dataList;
    }
  }

  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      
      {/* Dynamic SEO Path Breadcrumbs */}
      <nav className="flex flex-wrap text-sm font-medium gap-2 bg-slate-900/80 p-4 rounded-xl border border-slate-700 shadow-md">
        <Link href="/ifsc-directory" className="text-blue-400 hover:text-white transition-colors">BANKS</Link>
        {bankSlug && (
          <>
            <span className="text-slate-600">➔</span>
            <Link href={`/ifsc-directory/${bankSlug}`} className="text-blue-400 hover:text-white transition-colors capitalize" translate="no">{formatFromSlug(bankSlug)}</Link>
          </>
        )}
        {stateSlug && (
          <>
            <span className="text-slate-600">➔</span>
            <Link href={`/ifsc-directory/${bankSlug}/${stateSlug}`} className="text-blue-400 hover:text-white transition-colors capitalize" translate="no">{formatFromSlug(stateSlug)}</Link>
          </>
        )}
        {districtSlug && (
          <>
            <span className="text-slate-600">➔</span>
            <Link href={`/ifsc-directory/${bankSlug}/${stateSlug}/${districtSlug}`} className="text-blue-400 hover:text-white transition-colors capitalize" translate="no">{formatFromSlug(districtSlug)}</Link>
          </>
        )}
        {citySlug && (
          <>
            <span className="text-slate-600">➔</span>
            <Link href={`/ifsc-directory/${bankSlug}/${stateSlug}/${districtSlug}/${citySlug}`} className="text-blue-400 hover:text-white transition-colors capitalize" translate="no">{formatFromSlug(citySlug)}</Link>
          </>
        )}
        {branchSlug && (
          <>
            <span className="text-slate-600">➔</span>
            <span className="text-slate-200 capitalize" translate="no">{formatFromSlug(branchSlug)}</span>
          </>
        )}
      </nav>

      {/* Dynamic Header Section */}
      <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
        <h1 className="text-3xl font-extrabold text-white capitalize mb-2">
          {capitalizeWords(dbBank)}
          {dbState && ` ➔ ${capitalizeWords(dbState)}`}
          {dbDistrict && ` ➔ ${capitalizeWords(dbDistrict)} District`}
          {dbCity && ` ➔ ${capitalizeWords(dbCity)}`}
          {dbBranch && ` ➔ ${capitalizeWords(dbBranch)}`}
        </h1>
        <p className="text-slate-400 text-sm font-light">
          {!stateSlug && "Select a State to view available districts."}
          {stateSlug && !districtSlug && "Select a District to explore cities."}
          {districtSlug && !citySlug && "Select a City to pull branch details."}
          {citySlug && !branchSlug && "Select a Branch to view full details."}
          {branchSlug && "Showing verified live branch records."}
        </p>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Querying active routing infrastructure...</p>
        </div>
      ) : (
        <>
          {/* Grid View for Navigation Levels */}
          {!isFinalBranchView && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayCards.length > 0 ? displayCards.map((card, i) => (
                <Link href={card.url} key={i} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 transition-all flex flex-col items-center justify-center text-center group shadow-md hover:scale-[1.02]">
                   <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                     {card.icon}
                   </div>
                   <h3 className="text-white font-bold text-base capitalize group-hover:text-blue-400 transition-colors" translate="no">{card.name.toLowerCase()}</h3>
                   <span className="text-slate-500 text-xs mt-3 group-hover:text-blue-400 transition-colors">{card.label}</span>
                </Link>
              )) : (
                <p className="text-slate-400 col-span-full text-center py-12">No regional directory items found under this scope.</p>
              )}
            </div>
          )}

          {/* Final View: Branch Data Card */}
          {isFinalBranchView && (
            <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto w-full">
              {branchDataToShow.length > 0 ? branchDataToShow.map((row, index) => {
                const contact = formatContactNumber(row.contact || row.phone);
                return (
                  <div key={index} className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] -z-10"></div>
                    <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                      <div className="flex-1 pr-4">
                        <h3 className="text-2xl md:text-3xl font-extrabold text-blue-400 mb-2 capitalize" translate="no">{(row.bank || 'N/A').toLowerCase()}</h3>
                        <p className="text-lg font-semibold text-slate-300 capitalize" translate="no">📍 {(row.branch || 'N/A').toLowerCase()}</p>
                      </div>
                      <span className="bg-blue-600 text-white px-5 py-3 rounded-xl text-lg md:text-xl font-black tracking-widest shadow-md shrink-0">{row.ifsc || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 pt-2 text-sm flex-grow">
                      <div><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">City / Centre</span><span className="text-white text-base font-medium capitalize" translate="no">{(row.centre || row.city || 'N/A').toLowerCase()}</span></div>
                      <div><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">Contact Number</span><span className="text-white text-base font-medium">{contact}</span></div>
                      <div><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">MICR Code</span><span className="text-white text-base font-medium">{row.micr || 'Not Available'}</span></div>
                      <div><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">District</span><span className="text-white text-base font-medium capitalize" translate="no">{(row.district || 'N/A').toLowerCase()}</span></div>
                      <div className="col-span-1 md:col-span-2"><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">State</span><span className="text-white text-base font-medium capitalize" translate="no">{(row.state || 'N/A').toLowerCase()}</span></div>
                      <div className="col-span-1 md:col-span-2"><span className="text-slate-500 text-xs uppercase font-bold block mb-1 tracking-wider">Address</span><span className="text-white text-sm leading-relaxed capitalize" translate="no">{(row.address || 'N/A').toLowerCase()}</span></div>
                    </div>
                  </div>
                )
              }) : (
                <div className="col-span-full py-12 text-center text-slate-400">No active branches found matching this location.</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}