import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Bypassing the strict PageProps type error using 'any' for Vercel deployment
export default async function PincodeDetailPage(props: any) {
  // Safely await the params to extract URL data
  const resolvedParams = await props.params;
  
  const stateName = resolvedParams?.state ? decodeURIComponent(resolvedParams.state).toUpperCase() : '';
  const districtName = resolvedParams?.district ? decodeURIComponent(resolvedParams.district).toUpperCase() : '';
  const currentPincode = resolvedParams?.pincode || '';

  // 1. Fetch nearby post offices in the same district (excluding current)
  const { data: nearbyAreas } = await supabase
    .from('pincodes') 
    .select('office_name, pincode')
    .eq('district', districtName)
    .neq('pincode', currentPincode)
    .limit(8);

  // 2. Fetch nearby banks in the same district
  const { data: nearbyBanks } = await supabase
    .from('ifsc_codes')
    .select('bank_name, ifsc, branch')
    .ilike('district', `%${districtName}%`)
    .limit(5);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen space-y-10">
      
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex text-sm text-slate-400 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-orange-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/pin-codes" className="hover:text-orange-400 transition-colors">PIN CODES</Link>
        <span className="text-slate-600">/</span>
        <Link href={`/pin-codes/${resolvedParams?.state}`} className="hover:text-orange-400 transition-colors">{stateName}</Link>
        <span className="text-slate-600">/</span>
        <Link href={`/pin-codes/${resolvedParams?.state}/${resolvedParams?.district}`} className="hover:text-orange-400 transition-colors">{districtName}</Link>
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

      {/* 3. Internal Linking Sections (SEO Optimized) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        
        {/* Nearby Areas */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Nearby Areas</h2>
          </div>
          <div className="flex flex-wrap gap-2 flex-grow">
            {nearbyAreas && nearbyAreas.length > 0 ? (
              nearbyAreas.map((area: any, index: number) => (
                <Link key={index} href={`/pin-codes/${resolvedParams?.state}/${resolvedParams?.district}/${area.pincode}`} className="text-xs font-medium bg-slate-800 text-slate-300 px-3 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all border border-slate-700">
                  {area.office_name} ({area.pincode})
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">More areas loading soon...</p>
            )}
          </div>
          <Link href={`/pin-codes/${resolvedParams?.state}/${resolvedParams?.district}`} className="mt-6 text-sm text-center text-blue-400 hover:text-blue-300 font-bold w-full bg-slate-800/50 py-2 rounded-xl transition-all">
            View All in {districtName} &rarr;
          </Link>
        </div>

        {/* Nearby Banks */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Banks in {districtName}</h2>
          </div>
          <div className="flex flex-col gap-3 flex-grow">
            {nearbyBanks && nearbyBanks.length > 0 ? (
              nearbyBanks.map((bank: any, index: number) => (
                <Link key={index} href="/ifsc-directory" className="text-slate-400 hover:text-emerald-400 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl transition-all text-sm">
                  <span className="truncate pr-4">{bank.bank_name} - {bank.branch}</span>
                  <span className="text-emerald-500/50 text-xs font-mono">{bank.ifsc}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">Searching for banks nearby...</p>
            )}
          </div>
          <Link href="/ifsc-directory" className="mt-6 text-sm text-center text-emerald-400 hover:text-emerald-300 font-bold w-full bg-slate-800/50 py-2 rounded-xl transition-all">
            Search Bank IFSC Codes &rarr;
          </Link>
        </div>

        {/* Helpful Guides */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Helpful Guides</h2>
          </div>
          <div className="flex flex-col gap-3 flex-grow">
             <Link href="/guides/postal/speed-post-tracking" className="text-slate-400 hover:text-purple-400 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl transition-all text-sm">
              <span>How to Track Speed Post</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/guides/postal/correct-pincode" className="text-slate-400 hover:text-purple-400 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl transition-all text-sm">
              <span>Importance of Pincode</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/guides/banking/bsbda-zero-balance-account" className="text-slate-400 hover:text-purple-400 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl transition-all text-sm">
              <span>Zero Balance Accounts</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <Link href="/guides" className="mt-6 text-sm text-center text-purple-400 hover:text-purple-300 font-bold w-full bg-slate-800/50 py-2 rounded-xl transition-all">
            Explore Knowledge Hub &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}