'use client';

import Link from 'next/link';

export default function HomePage() {
  const utilityDirectories = [
    { title: 'STD Codes Directory', desc: 'Find all India city landline calling codes', link: '/std-codes', icon: '📞' },
    { title: 'MICR Codes Directory', desc: 'Magnetic Ink Character Recognition codes', link: '/micr-codes', icon: '📄' },
    { title: 'Railway Station Codes', desc: 'Search Indian Railways station code names', link: '/railway-codes', icon: '🚂' },
    { title: 'RTO Vehicle Codes', desc: 'Check regional state vehicle registration codes', link: '/rto-codes', icon: '🚗' },
    { title: 'GST State Codes List', desc: 'Find official structural GST state prefixes', link: '/gst-codes', icon: '📊' }
  ];

  const trendingPINs = [
    { label: '531031 (Anakapalle)', query: '531031' },
    { label: '500032 (Gachibowli)', query: '500032' },
    { label: '533001 (Kakinada)', query: '533001' },
    { label: '522001 (Guntur)', query: '522001' },
    { label: '532001 (Srikakulam)', query: '532001' },
    { label: '500081 (Madhapur)', query: '500081' }
  ];

  const popularIFSCs = ['SBIN0000952', 'HDFC0000042', 'ICIC0000008', 'PUNB0011200', 'CNRB0000400', 'IDIB000C017'];
  
  const popularCityPINs = [
    { city: 'Visakhapatnam', pin: '530001' },
    { city: 'Hyderabad', pin: '500001' },
    { city: 'Vijayawada', pin: '520001' },
    { city: 'Bengaluru', pin: '560001' },
    { city: 'Mumbai', pin: '400001' },
    { city: 'Chennai', pin: '600001' },
    { city: 'New Delhi', pin: '110001' },
    { city: 'Pune', pin: '411001' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      
      {/* Hero Section */}
      <div className="text-center space-y-5 pt-4 pb-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          India's Ultimate <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500">
            Directory Hub
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Lightning-fast platform for searching PIN, IFSC, STD, and Railway codes across India. 100% Free & Accurate.
        </p>
      </div>

      {/* Main Core Directories (Ultra Compact Design) */}
      <div className="grid md:grid-cols-2 gap-4 lg:px-16">
        <Link href="/pin-codes" className="group bg-slate-900 border border-slate-700 px-6 py-5 rounded-2xl hover:border-orange-500/50 transition-colors shadow-lg flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📍</span>
              <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">PIN Codes Directory</h2>
            </div>
            <p className="text-slate-400 mb-5 text-sm ml-11">Search through 1.5 Lakh+ Indian Post Office PIN codes by state, district, or village.</p>
          </div>
          <div className="ml-11 inline-flex items-center justify-center gap-2 text-white font-bold bg-orange-600 px-4 py-2 rounded-lg shadow-md group-hover:bg-orange-500 transition-colors text-sm w-max">
            Search PIN Codes <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </div>
        </Link>

        <Link href="/ifsc-directory" className="group bg-slate-900 border border-slate-700 px-6 py-5 rounded-2xl hover:border-blue-500/50 transition-colors shadow-lg flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏦</span>
              <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">IFSC & Bank Directory</h2>
            </div>
            <p className="text-slate-400 mb-5 text-sm ml-11">Find exact IFSC, MICR, and branch addresses for 1.8 Lakh+ banks across India.</p>
          </div>
          <div className="ml-11 inline-flex items-center justify-center gap-2 text-white font-bold bg-blue-600 px-4 py-2 rounded-lg shadow-md group-hover:bg-blue-500 transition-colors text-sm w-max">
            Search Bank Codes <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </div>
        </Link>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-orange-500">⚡</span> Quick Navigation
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/pin-codes" className="bg-slate-800/50 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors text-center group flex items-center justify-center gap-2">
            <span className="text-xl group-hover:scale-110 transition-transform">🗺️</span>
            <span className="text-sm font-semibold text-slate-300">Search by State</span>
          </Link>
          <Link href="/pin-codes" className="bg-slate-800/50 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors text-center group flex items-center justify-center gap-2">
            <span className="text-xl group-hover:scale-110 transition-transform">📍</span>
            <span className="text-sm font-semibold text-slate-300">Search by District</span>
          </Link>
          <Link href="/ifsc-directory" className="bg-slate-800/50 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors text-center group flex items-center justify-center gap-2">
            <span className="text-xl group-hover:scale-110 transition-transform">🏦</span>
            <span className="text-sm font-semibold text-slate-300">Search by Bank</span>
          </Link>
          <Link href="/std-codes" className="bg-slate-800/50 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors text-center group flex items-center justify-center gap-2">
            <span className="text-xl group-hover:scale-110 transition-transform">🏙️</span>
            <span className="text-sm font-semibold text-slate-300">Popular Cities</span>
          </Link>
        </div>
      </div>

      {/* SEO Sections */}
      <div className="grid md:grid-cols-2 gap-4 pt-2">
        {/* Trending PINs */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-3 border-b border-slate-700 pb-2">🔥 Trending PIN Codes</h3>
          <div className="flex flex-wrap gap-2">
            {trendingPINs.map((item, i) => (
              <Link key={i} href={`/pin-codes?search=${item.query}`} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-orange-500 hover:text-white transition-colors border border-slate-700">
                {item.label}
              </Link>
            ))}
            <Link href="/pin-codes" className="text-orange-400 text-sm px-2 py-1.5 hover:underline">View more...</Link>
          </div>
        </div>

        {/* Popular IFSCs */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-3 border-b border-slate-700 pb-2">💎 Popular IFSC Codes</h3>
          <div className="flex flex-wrap gap-2">
            {popularIFSCs.map((ifsc, i) => (
              <Link key={i} href={`/ifsc-directory?search=${ifsc}`} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition-colors border border-slate-700">
                {ifsc}
              </Link>
            ))}
            <Link href="/ifsc-directory" className="text-blue-400 text-sm px-2 py-1.5 hover:underline">View more...</Link>
          </div>
        </div>
      </div>

      {/* Popular City PIN Codes */}
      <div className="pt-2">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-orange-500">🏙️</span> Popular City PIN Codes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {popularCityPINs.map((item, i) => (
            <Link key={i} href={`/pin-codes?search=${item.city}`} className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50 hover:border-orange-500/50 hover:bg-slate-800 transition-all group flex justify-between items-center shadow-sm">
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{item.city}</span>
              <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20">{item.pin}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Utility Directories */}
      <div className="pt-6 border-t border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4">More Utility Directories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {utilityDirectories.map((dir, idx) => (
            <Link key={idx} href={dir.link} className="flex items-center gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors group">
              <div className="text-xl bg-slate-800 w-10 h-10 flex shrink-0 items-center justify-center rounded-lg group-hover:scale-105 transition-transform">{dir.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-slate-300 transition-colors">{dir.title}</h3>
                <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{dir.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}