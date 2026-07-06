'use client';

import Link from 'next/link';

const POPULAR_BANKS = [
  { name: "State Bank of India", slug: "state-bank-of-india" },
  { name: "HDFC Bank", slug: "hdfc-bank" },
  { name: "ICICI Bank", slug: "icici-bank" },
  { name: "Punjab National Bank", slug: "punjab-national-bank" },
  { name: "Bank of Baroda", slug: "bank-of-baroda" },
  { name: "Axis Bank", slug: "axis-bank" },
  { name: "Canara Bank", slug: "canara-bank" },
  { name: "Union Bank of India", slug: "union-bank-of-india" }
];

const TOP_STATES = [
  { name: "Andhra Pradesh", slug: "andhra-pradesh" },
  { name: "Telangana", slug: "telangana" },
  { name: "Maharashtra", slug: "maharashtra" },
  { name: "Karnataka", slug: "karnataka" },
  { name: "Tamil Nadu", slug: "tamil-nadu" },
  { name: "Gujarat", slug: "gujarat" }
];

const POPULAR_CITIES = [
  { name: "Hyderabad", bank: "state-bank-of-india", state: "telangana", city: "hyderabad" },
  { name: "Visakhapatnam", bank: "state-bank-of-india", state: "andhra-pradesh", city: "visakhapatnam" },
  { name: "Vijayawada", bank: "hdfc-bank", state: "andhra-pradesh", city: "vijayawada" },
  { name: "Bengaluru", bank: "icici-bank", state: "karnataka", city: "bangalore" }
];

export default function IfscHubPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-12 flex flex-col min-h-screen">
      
      {/* Header Section */}
      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase">IFSC Directory Hub</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">India Bank Routing Center</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Find IFSC codes, MICR codes, and branch addresses across India using our fast navigation directory.</p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-12">
        
        {/* Search by Bank */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">Search by Popular Banks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {POPULAR_BANKS.map((bank) => (
              <Link href={`/ifsc-directory/${bank.slug}`} key={bank.slug} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all text-center group">
                <div className="text-3xl mb-3">🏦</div>
                <h3 className="text-white font-semibold group-hover:text-blue-400">{bank.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Search by State */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-emerald-500 pl-4">Browse by State</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TOP_STATES.map((state) => (
              <div key={state.slug} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 text-center opacity-70 cursor-not-allowed">
                <div className="text-2xl mb-2">🗺️</div>
                <h3 className="text-slate-300 font-medium text-sm">{state.name}</h3>
                <p className="text-[10px] text-emerald-400 mt-2">Select Bank First ⬆️</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Cities Quick Links */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">Direct City Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {POPULAR_CITIES.map((city) => (
              <Link href={`/ifsc-directory/${city.bank}/${city.state}/${city.city}`} key={city.name} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 hover:border-purple-500 hover:bg-slate-800 transition-all flex items-center justify-between group">
                <span className="text-white font-medium group-hover:text-purple-400">{city.name}</span>
                <span className="text-slate-500">➔</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}