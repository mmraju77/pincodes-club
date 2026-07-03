import Link from 'next/link';

export default function PincodeDetailPage({ 
  params 
}: { 
  params: { state: string, district: string, pincode: string } 
}) {
  // URL లో ఉన్న పేర్లను క్లియర్ గా చదవడానికి
  const stateName = decodeURIComponent(params.state).toUpperCase();
  const districtName = decodeURIComponent(params.district).toUpperCase();
  const currentPincode = params.pincode;

  // 🚀 భవిష్యత్తులో ఇక్కడ మీ Supabase డేటాబేస్ నుండి రియల్ డేటా లాగుతాము 
  // ప్రస్తుతానికి ఇంటర్నల్ లింకింగ్ కోసం డమ్మీ ఆకృతిని (Structure) సెట్ చేద్దాం.
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen space-y-10">
      
      {/* 1. Breadcrumb Navigation (SEO కి చాలా ముఖ్యం) */}
      <nav className="flex text-sm text-slate-400 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-orange-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/pin-codes" className="hover:text-orange-400 transition-colors">PIN CODES</Link>
        <span className="text-slate-600">/</span>
        <Link href={`/pin-codes/${params.state}`} className="hover:text-orange-400 transition-colors">{stateName}</Link>
        <span className="text-slate-600">/</span>
        <Link href={`/pin-codes/${params.state}/${params.district}`} className="hover:text-orange-400 transition-colors">{districtName}</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold">{currentPincode}</span>
      </nav>

      {/* 2. Hero Section: Pincode Details */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-32 h-32 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        
        <span className="bg-orange-500/20 text-orange-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 inline-block border border-orange-500/30">
          PINCODE DIRECTORY
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Pincode: <span className="text-orange-400">{currentPincode}</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          Complete postal and banking details for pincode {currentPincode} located in {districtName} district, {stateName}.
        </p>
      </div>

      {/* 3. Internal Linking Sections (The SEO Magic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        
        {/* Nearby Areas / Post Offices */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Other Post Offices</h2>
          </div>
          <div className="flex flex-col gap-3">
            {/* Supabase లింక్ చేశాక ఇవి ఆటోమేటిక్ గా లూప్ అవుతాయి */}
            <Link href={`/pin-codes/${params.state}/${params.district}`} className="text-slate-400 hover:text-orange-400 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl transition-all">
              <span>View all in {districtName}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

        {/* Nearby Banks / IFSC */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Banks in {districtName}</h2>
          </div>
          <div className="flex flex-col gap-3">
             <Link href="/ifsc-directory" className="text-slate-400 hover:text-emerald-400 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl transition-all">
              <span>Search Bank IFSC Codes</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

        {/* Essential Guides */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Helpful Guides</h2>
          </div>
          <div className="flex flex-col gap-3">
             <Link href="/guides/postal" className="text-slate-400 hover:text-purple-400 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl transition-all">
              <span>How to Track Speed Post</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/guides/banking" className="text-slate-400 hover:text-purple-400 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl transition-all">
              <span>Zero Balance Accounts</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}