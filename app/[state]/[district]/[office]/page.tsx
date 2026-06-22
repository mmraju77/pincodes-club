'use client';

import Link from 'next/link';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { use, useState, useEffect } from 'react';
import Papa from 'papaparse';

type PageProps = {
  params: Promise<{
    state: string;
    district: string;
    office: string;
  }>;
};

const slugify = (text: string) => 
  text ? String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '') : '';

export default function OfficePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { t, language } = useLanguage();
  
  const [officeData, setOfficeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchOfficeData() {
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
            // Continue searching next path
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

            const targetState = resolvedParams.state;
            const targetDistrict = resolvedParams.district;
            const targetOffice = slugify(decodeURIComponent(resolvedParams.office));

            const foundOffice = results.data.find((row: any) => {
              return slugify(row.statename) === targetState && 
                     slugify(row.district) === targetDistrict && 
                     slugify(row.officename) === targetOffice;
            });

            if (foundOffice) {
              setOfficeData(foundOffice);
            } else {
              setIsError(true);
            }
            setIsLoading(false);
          }
        });
      } catch (err) {
        setIsError(true); 
        setIsLoading(false);
      }
    }

    fetchOfficeData();
  }, [resolvedParams.state, resolvedParams.district, resolvedParams.office]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl text-slate-300 font-semibold animate-pulse">Loading Area Details...</h2>
      </div>
    );
  }

  if (isError || !officeData) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center bg-slate-900 rounded-3xl border border-slate-800 mt-10">
        <h1 className="text-4xl font-bold text-white mb-4">Area Data Not Found</h1>
        <p className="text-slate-400 mb-8">The requested post office details could not be found.</p>
        <Link href={`/${resolvedParams.state}/${resolvedParams.district}`} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">Go Back to District</Link>
      </div>
    );
  }

  const mapQuery = `${officeData.officename} Post Office, ${officeData.district}, ${officeData.statename}`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <nav className="flex flex-wrap text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-orange-500 transition-colors">{t.home || "Home"}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/${resolvedParams.state}`} className="hover:text-orange-500 transition-colors capitalize">
          {translateName(officeData.statename, language)}
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/${resolvedParams.state}/${resolvedParams.district}`} className="hover:text-orange-500 transition-colors capitalize">
          {translateName(officeData.district, language)}
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium capitalize">{translateName(officeData.officename, language)}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-bl-full -z-10 blur-3xl"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 border-b border-slate-700/50 pb-10">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
              Official Post Office Details
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight capitalize mb-2">
              {translateName((officeData.officename || '').toLowerCase(), language)}
            </h1>
            <p className="text-slate-400 text-lg">
              {translateName(officeData.district, language)}, {translateName(officeData.statename, language)}
            </p>
          </div>
          
          <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-2xl text-center min-w-[200px] shadow-lg">
            <p className="text-orange-300 text-sm font-semibold uppercase tracking-widest mb-1">PIN CODE</p>
            <p className="text-5xl font-black text-orange-400 tracking-wider">{officeData.pincode}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-1">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Office Type</p>
            <p className="text-white font-semibold text-lg">{officeData.officetype || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Delivery Status</p>
            <p className={`font-semibold text-lg ${officeData.delivery?.toLowerCase() === 'delivery' ? 'text-green-400' : 'text-yellow-400'}`}>
              {officeData.delivery || 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Division</p>
            <p className="text-white font-semibold text-lg capitalize">{(officeData.divisionname || '').toLowerCase() || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Region</p>
            <p className="text-white font-semibold text-lg capitalize">{(officeData.regionname || '').toLowerCase() || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Postal Circle</p>
            <p className="text-white font-semibold text-lg capitalize">{(officeData.circlename || '').toLowerCase() || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row gap-4">
          <a 
            href={mapLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            View Area on Google Maps
          </a>
        </div>

      </div>
    </div>
  );
}