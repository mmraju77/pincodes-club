'use client';

import Link from 'next/link';
import { postalDatabase } from '@/src/data/pincodeData';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { use } from 'react';

type PageProps = {
  params: Promise<{
    state: string;
    district: string;
    taluk: string;
    area: string;
  }>;
};

export default function AreaPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { t, language } = useLanguage();
  
  const stateData = postalDatabase.find(s => s.slug === resolvedParams.state);
  const districtData = stateData?.districts.find(d => d.slug === resolvedParams.district);
  const talukData = districtData?.taluks.find(t => t.slug === resolvedParams.taluk);
  const officeData = talukData?.offices.find(o => o.slug === resolvedParams.area);

  if (!stateData || !districtData || !talukData || !officeData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl text-white">Post Office not found</h1>
        <Link href="/" className="text-orange-500 hover:underline mt-4 inline-block">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-orange-500 transition-colors">{t.home}</Link>
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/${stateData.slug}`} className="hover:text-orange-500 transition-colors">{translateName(stateData.name, language)}</Link>
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/${stateData.slug}/${districtData.slug}`} className="hover:text-orange-500 transition-colors">{translateName(districtData.name, language)}</Link>
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/${stateData.slug}/${districtData.slug}/${talukData.slug}`} className="hover:text-orange-500 transition-colors">{translateName(talukData.name, language)}</Link>
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium">{translateName(officeData.name, language)}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="inline-block px-3 py-1 mb-6 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
          Post Office Details
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight capitalize mb-6">
          <span className="text-orange-500">{translateName(officeData.name, language)}</span>
        </h1>
        
        <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-transparent mb-8"></div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col justify-center outline outline-1 outline-orange-500/20 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-500/10 blur-xl rounded-full"></div>
            <span className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-2">{t.pinCode}</span>
            <span className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-orange-400">{officeData.pincode}</span>
          </div>

          <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col justify-center relative overflow-hidden">
            <span className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-2">{t.deliveryStatus}</span>
            <span className="font-sans text-white text-2xl font-medium tracking-wide">{officeData.deliveryStatus}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col justify-center">
            <span className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-1">State</span>
            <span className="font-medium text-white text-lg">{translateName(officeData.state, language)}</span>
          </div>
          <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col justify-center">
            <span className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-1">District</span>
            <span className="font-medium text-white text-lg">{translateName(officeData.district, language)}</span>
          </div>
          <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col justify-center">
            <span className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-1">Taluk</span>
            <span className="font-medium text-white text-lg">{translateName(officeData.taluk, language)}</span>
          </div>
          <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col justify-center">
            <span className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-1">Division</span>
            <span className="font-medium text-white text-lg">{translateName(officeData.division, language)}</span>
          </div>
          <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col justify-center">
            <span className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-1">Region</span>
            <span className="font-medium text-white text-lg">{translateName(officeData.region, language)}</span>
          </div>
          <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col justify-center">
            <span className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-1">Circle</span>
            <span className="font-medium text-white text-lg">{translateName(officeData.circle, language)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
