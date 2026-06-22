'use client';

import Link from 'next/link';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { use, useState, useEffect } from 'react';
import Papa from 'papaparse';

type PageProps = {
  params: Promise<{
    state: string;
  }>;
};

// Utility to convert text to URL slug
const slugify = (text: string) => 
  text ? String(text).toLowerCase().replace(/ & /g, '-and-').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';

export default function StatePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { t, language } = useLanguage();
  
  const [districts, setDistricts] = useState<any[]>([]);
  const [stateName, setStateName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchStateData() {
      const targetSlug = resolvedParams.state;
      
      try {
        // Try multiple paths to find the CSV file
        const possiblePaths = [
          '/pincodes.csv', '/data/pincodes.csv', '/data/pincodes.csv.csv', '/pincodes.csv.csv', '/data/pincode.csv'
        ];
        
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
            // Keep searching next path
          }
        }

        if (!finalCsvText) {
          setIsError(true);
          setIsLoading(false);
          return;
        }

        // Parse the valid CSV text
        Papa.parse(finalCsvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim(),
          complete: (results) => {
            if (!results.data || results.data.length === 0) {
              setIsError(true);
              setIsLoading(false);
              return;
            }

            let foundStateName = '';
            const districtMap = new Map();

            results.data.forEach((row: any) => {
              const sName = row.StateName || row.statename; 
              if (!sName) return;
              
              const sSlug = slugify(sName);
              
              // Process only data for the selected state
              if (sSlug === targetSlug) {
                if (!foundStateName) foundStateName = sName;
                
                const dName = row.District || row.district;
                if (dName) {
                  const dSlug = slugify(dName);
                  // Count post offices per district
                  if (districtMap.has(dSlug)) {
                    districtMap.get(dSlug).count += 1;
                  } else {
                    districtMap.set(dSlug, { name: dName, slug: dSlug, count: 1 });
                  }
                }
              }
            });

            if (!foundStateName) {
              setIsError(true);
            } else {
              setStateName(foundStateName);
              // Sort districts alphabetically
              const distArray = Array.from(districtMap.values()).sort((a, b) => a.name.localeCompare(b.name));
              setDistricts(distArray);
            }
            setIsLoading(false);
          }
        });
        
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
      }
    }

    fetchStateData();
  }, [resolvedParams.state]);

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl text-slate-300 font-semibold animate-pulse">Extracting Districts Data...</h2>
      </div>
    );
  }

  // Error State
  if (isError || !stateName) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center bg-slate-900 rounded-3xl border border-slate-800 mt-10">
        <svg className="w-20 h-20 text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h1 className="text-4xl font-bold text-white mb-4">State Data Not Found</h1>
        <p className="text-slate-400 mb-8">We couldn't locate the Pincode database for this region.</p>
        <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">Go Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-orange-500 transition-colors">{t.home || "Home"}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium">{translateName(stateName, language)}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="inline-block px-3 py-1 mb-6 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
          State Level Directory
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight capitalize mb-6">
          <span className="text-orange-500">{translateName(stateName, language)}</span> {t.pinCodes || "PIN Codes"}
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-transparent mb-8"></div>
        <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed mb-10">
          This is the SEO-friendly landing page for all PIN codes in the state of <strong className="text-white capitalize">{translateName(stateName, language)}</strong>. Select a district below to narrow your search.
        </p>

        {/* District Grid */}
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-4">
          {t.districtsIn || "Districts in"} {translateName(stateName, language)} ({districts.length})
        </h2>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {districts.map(district => (
            <Link 
              key={district.slug} 
              href={`/${resolvedParams.state}/${district.slug}`} 
              className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-orange-500/50 hover:bg-slate-800 transition-all group flex flex-col justify-between shadow-lg"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors capitalize">
                  {translateName(district.name.toLowerCase(), language)}
                </h3>
                <svg className="w-5 h-5 text-slate-500 group-hover:text-orange-500 transition-colors transform group-hover:translate-x-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
              <p className="text-slate-400 mt-4 text-sm font-medium bg-slate-800/50 inline-block px-3 py-1 rounded-lg border border-slate-700/50 w-max">
                {district.count} Post Offices
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}