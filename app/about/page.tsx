'use client';

import Link from 'next/link';
import { useLanguage } from '@/src/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-6">
        <div className="inline-block px-3 py-1 mb-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
          {t.aboutUs}
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          Pioneering <span className="text-orange-500">Financial</span> Intelligence
        </h1>
        <p className="max-w-3xl mx-auto text-slate-300 text-lg md:text-xl font-light leading-relaxed">
          Pincode Club leverages sophisticated data architecture to provide robust, lightning-fast discovery for critical routing codes across the global banking ecosystem.
        </p>
      </div>

      {/* Founder Profile Section */}
      <section className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 lg:p-16 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
        {/* Background glow for premium feel */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Profile Image/Avatar Column */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-6">
             <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full p-2 bg-gradient-to-br from-orange-500 to-slate-800 shadow-2xl">
                <div className="w-full h-full rounded-full bg-slate-900 border-4 border-orange-500 flex items-center justify-center overflow-hidden">
                  <img src="/raju.jpg.jpeg" alt="Munchangi Matyaraju" className="w-full h-full object-cover rounded-full" />
                </div>
             </div>
             
             <div className="text-center">
               <h2 className="text-3xl font-bold text-white tracking-tight">Munchangi Matyaraju</h2>
               <p className="text-orange-400 font-medium tracking-wide mt-1">(mm Raju)</p>
               <div className="mt-4 py-1.5 px-4 bg-slate-900/80 border border-slate-700 rounded-full inline-block">
                 <p className="text-slate-300 text-sm font-semibold uppercase tracking-widest">{t.role}</p>
               </div>
             </div>
          </div>

          {/* Biography & Mission Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white">{t.theVisionaryForce}</h3>
              <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
            </div>
            
            <p className="text-slate-300 text-lg leading-relaxed">
              {t.bioText}
            </p>
            
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-orange-500/20 shadow-lg mt-6">
              <h4 className="text-orange-400 font-semibold mb-2 uppercase tracking-wide text-sm">{t.coreMission}</h4>
              <p className="text-white text-xl font-medium leading-relaxed italic">
                &quot;Providing instant, reliable, and ad-free access to millions of Indian postal and banking codes.&quot;
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <p className="text-orange-500 font-bold text-2xl mb-1">0.1s</p>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{t.searchLatencyLabel}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <p className="text-orange-500 font-bold text-2xl mb-1">99.9%</p>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{t.routeAccuracyLabel}</p>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* Footer Return */}
      <div className="flex justify-center pt-8">
        <Link href="/" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 hover:border-slate-500 transition-all shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return Home
        </Link>
      </div>

    </div>
  );
}
