'use client';

import Link from 'next/link';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { use, useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

type PageProps = {
  params: Promise<{
    state: string;
    district: string;
  }>;
};

// Utility function to safely format text for URLs without breaking dots or spaces
const slugify = (text: string) => 
  text ? String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '') : '';

export default function DistrictPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { t, language } = useLanguage();
  
  const [postOffices, setPostOffices] = useState<any[]>([]);
  const [stateName, setStateName] = useState<string>('');
  const [districtName, setDistrictName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    async function fetchDistrictData() {
      const targetState = resolvedParams.state;
      const targetDistrict = resolvedParams.district;
      
      try {
        const possiblePaths = ['/pincodes.csv', '/data/pincodes.csv', '/data/pincodes.csv.csv', '/pincodes.csv.csv'];
        
        let finalCsvText = '';
        for (const path of possiblePaths) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              const text = await response.text();
              if (!text.trim().startsWith('<!DOCTYPE html>')) {
                finalCsvText = text; 
                break;
              }
            }
          } catch (e) {
            // Check next path if error occurs
          }
        }

        if (!finalCsvText) { 
          setIsError(true); 
          setIsLoading(false); 
          return; 
        }

        Papa.parse(finalCsvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim().toLowerCase(),
          complete: (results) => {
            if (!results.data || results.data.length === 0) { 
              setIsError(true); 
              setIsLoading(false); 
              return; 
            }

            let foundState = '';
            let foundDistrict = '';
            const offices: any[] = [];

            results.data.forEach((row: any) => {
              const sName = row.statename; 
              const dName = row.district;
              if (!sName || !dName) return;
              
              if (slugify(sName) === targetState && slugify(dName) === targetDistrict) {
                if (!foundState) foundState = sName;
                if (!foundDistrict) foundDistrict = dName;
                offices.push(row);
              }
            });

            if (!foundDistrict || offices.length === 0) {
              setIsError(true);
            } else {
              setStateName(foundState);
              setDistrictName(foundDistrict);
              offices.sort((a, b) => (a.officename || '').localeCompare(b.officename || ''));
              setPostOffices(offices);
            }
            setIsLoading(false);
          }
        });
      } catch (err) {
        setIsError(true); 
        setIsLoading(false);
      }
    }
    fetchDistrictData();
  }, [resolvedParams.state, resolvedParams.district]);

  const filteredOffices = useMemo(() => {
    if (!localSearch.trim()) return postOffices;
    const q = localSearch.toLowerCase();
    return postOffices.filter(po => 
      (po.officename && po.officename.toLowerCase().includes(q)) || 
      (po.pincode && po.pincode.toString().includes(q))
    );
  }, [postOffices, localSearch]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl text-slate-300 font-semibold animate-pulse">Loading Post Offices...</h2>
      </div>
    );
  }

  if (isError || !districtName) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center bg-slate-900 rounded-3xl border border-slate-800 mt-10">
        <h1 className="text-4xl font-bold text-white mb-4">District Data Not Found</h1>
        <Link href={`/${resolvedParams.state}`} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <nav className="flex flex-wrap text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-orange-500 transition-colors">{t.home || "Home"}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/${resolvedParams.state}`} className="hover:text-orange-500 transition-colors capitalize">
          {translateName(stateName, language)}
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium capitalize">{translateName(districtName, language)}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">District Directory</div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight capitalize mb-4">
              <span className="text-orange-500">{translateName(districtName, language)}</span> PIN Codes
            </h1>
            <p className="text-slate-300 text-lg font-light">Showing all <strong className="text-white">{postOffices.length}</strong> active post offices.</p>
          </div>
          <div className="w-full md:w-72 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Filter by Name or Pincode..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredOffices.length > 0 ? (
          filteredOffices.map((po, index) => {
            const officeSlug = slugify(po.officename);
            const linkHref = `/${resolvedParams.state}/${resolvedParams.district}/${officeSlug}`;
            
            return (
              <Link key={index} href={linkHref} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-orange-500/50 hover:bg-slate-800 transition-all group flex flex-col shadow-md relative overflow-hidden block cursor-pointer">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -z-10 group-hover:bg-orange-500/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white pr-4 capitalize leading-tight group-hover:text-orange-400 transition-colors">
                    {translateName((po.officename || '').toLowerCase(), language)}
                  </h3>
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-lg font-bold shadow-sm shrink-0">
                    {po.pincode}
                  </span>
                </div>
                <div className="mt-auto space-y-2 text-sm">
                  <div className="flex items-center text-slate-400">
                    <span className="w-24 text-slate-500 font-medium">Type:</span>
                    <span className="text-slate-300">{po.officetype || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <span className="w-24 text-slate-500 font-medium">Division:</span>
                    <span className="text-slate-300 capitalize">{(po.divisionname || '').toLowerCase() || 'N/A'}</span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-slate-400 text-lg">No post offices found matching "{localSearch}"</p>
          </div>
        )}
      </div>
    </div>
  );
}