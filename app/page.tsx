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

  // Dynamic SEO Search Links Configuration
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-6 pb-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          India's Ultimate <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500">
            Directory Hub
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Lightning-fast platform for searching PIN, IFSC, STD, and Railway codes across India. 100% Free & Accurate.
        </p>
      </div>

      {/* Main Core Directories */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/pin-codes" className="group bg-slate-900 border border-slate-700 p-8 rounded-3xl hover:border-orange-500/50 transition-colors shadow-lg">
          <div className="text-4xl mb-4">📍</div>
          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">PIN Codes Directory</h2>
          <p className="text-slate-400 mb-6 text-sm md:text-base">Search through 1.5 Lakh+ Indian Post Office PIN codes by state, district, or village.</p>
          <div className="inline-flex items-center gap-2 text-white font-bold bg-orange-600 px-5 py-2.5 rounded-xl shadow-md group-hover:bg-orange-500 transition-colors text-sm">
            Search PIN Codes <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </div>
        </Link>

        <Link href="/ifsc-directory" className="group bg-slate-900 border border-slate-700 p-8 rounded-3xl hover:border-blue-500/50 transition-colors shadow-lg">
          <div className="text-4xl mb-4">🏦</div>
          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">IFSC & Bank Directory</h2>
          <p className="text-slate-400 mb-6 text-sm md:text-base">Find exact IFSC, MICR, and branch addresses for 1.8 Lakh+ banks across India.</p>
          <div className="inline-flex items-center gap-2 text-white font-bold bg-blue-600 px-5 py-2.5 rounded-xl shadow-md group-hover:bg-blue-500 transition-colors text-sm">
            Search Bank Codes <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </div>
        </Link>
      </div>

      {/* AdSense Placeholder 1 */}
      <div className="w-full h-24 bg-slate-800/30 border border-slate-700/50 rounded-xl flex items-center justify-center text-slate-500 text-sm border-dashed">
        Advertisement Area
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-orange-500">⚡</span> Quick Navigation
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/pin-codes" className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors text-center group">
            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">🗺️</span>
            <span className="text-sm font-semibold text-slate-300">Search by State</span>
          </Link>
          <Link href="/pin-codes" className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors text-center group">
            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">📍</span>
            <span className="text-sm font-semibold text-slate-300">Search by District</span>
          </Link>
          <Link href="/ifsc-directory" className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors text-center group">
            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">🏦</span>
            <span className="text-sm font-semibold text-slate-300">Search by Bank</span>
          </Link>
          <Link href="/std-codes" className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors text-center group">
            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">🏙️</span>
            <span className="text-sm font-semibold text-slate-300">Popular Cities</span>
          </Link>
        </div>
      </div>

      {/* SEO Sections */}
      <div className="grid md:grid-cols-2 gap-8 pt-4">
        {/* Trending PINs with Search Parameters */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">🔥 Trending PIN Codes</h3>
          <div className="flex flex-wrap gap-2">
            {trendingPINs.map((item, i) => (
              <Link key={i} href={`/pin-codes?search=${item.query}`} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-orange-500 hover:text-white transition-colors border border-slate-700">
                {item.label}
              </Link>
            ))}
            <Link href="/pin-codes" className="text-orange-400 text-sm px-2 py-1.5 hover:underline">View more...</Link>
          </div>
        </div>

        {/* Popular IFSCs with Search Parameters */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">💎 Popular IFSC Codes</h3>
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

      {/* Popular City PIN Codes Grid with Automated Search Filter */}
      <div className="pt-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-orange-500">🏙️</span> Popular City PIN Codes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularCityPINs.map((item, i) => (
            <Link key={i} href={`/pin-codes?search=${item.city}`} className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 hover:border-orange-500/50 hover:bg-slate-800 transition-all group flex justify-between items-center shadow-sm">
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{item.city}</span>
              <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20">{item.pin}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* AdSense Placeholder 2 */}
      <div className="w-full h-24 bg-slate-800/30 border border-slate-700/50 rounded-xl flex items-center justify-center text-slate-500 text-sm border-dashed my-8">
        Advertisement Area
      </div>

      {/* Utility Directories */}
      <div className="pt-8 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6">More Utility Directories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {utilityDirectories.map((dir, idx) => (
            <Link key={idx} href={dir.link} className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors group">
              <div className="text-3xl bg-slate-800 w-12 h-12 flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform">{dir.icon}</div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-slate-300 transition-colors">{dir.title}</h3>
                <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{dir.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}